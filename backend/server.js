require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const aiRoutes = require("./routes/ai");
const budgetRoutes = require("./routes/budget");
const subscriptionRoutes = require("./routes/subscriptions");
const {
  apiLimiter,
  aiLimiter,
  authLimiter,
} = require("./middleware/rateLimit");
const connectDB = require("./config/Database");

const app = express();
const PORT = process.env.PORT || 6000;

app.use(helmet());
app.use(
  cors({
    origin: (
      process.env.FRONTEND_URL || "http://localhost:3000,http://localhost:3001"
    ).split(","),
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/", apiLimiter);
app.use("/api/ai", aiLimiter);
app.use("/api/auth", authLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", time: new Date() }),
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong", message: err.message });
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`),
  );
});

module.exports = app;
