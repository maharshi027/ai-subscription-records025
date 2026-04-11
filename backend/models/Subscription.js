const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    billingCycle: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      default: "monthly",
    },
    category: {
      type: String,
      enum: [
        "Streaming",
        "Music",
        "Software",
        "Gaming",
        "News",
        "Fitness",
        "Cloud",
        "Other",
      ],
      default: "Other",
    },
    nextRenewalDate: { type: Date, required: true },
    startDate: { type: Date, default: Date.now },
    lastUsedDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    logo: { type: String },
    reminderDays: { type: Number, default: 3 },
    notes: { type: String },
  },
  { timestamps: true },
);

subscriptionSchema.virtual("daysUntilRenewal").get(function () {
  const diff = this.nextRenewalDate - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

subscriptionSchema.virtual("isZombie").get(function () {
  if (!this.lastUsedDate) return true;
  const daysSinceUse = (new Date() - this.lastUsedDate) / (1000 * 60 * 60 * 24);
  return daysSinceUse > 30;
});

subscriptionSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
