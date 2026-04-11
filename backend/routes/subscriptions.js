const express = require("express");
const Subscription = require("../models/Subscription");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.use(protect);

router.get("/", async (req, res) => {
  try {
    const subs = await Subscription.find({
      user: req.user._id,
      isActive: true,
    }).sort({ nextRenewalDate: 1 });
    const now = new Date();
    const enriched = subs.map((s) => {
      const obj = s.toJSON();
      const daysSinceUse = s.lastUsedDate
        ? Math.floor((now - s.lastUsedDate) / (1000 * 60 * 60 * 24))
        : 999;
      obj.isZombie = daysSinceUse > 30;
      obj.daysSinceUse = daysSinceUse;
      obj.daysUntilRenewal = Math.ceil(
        (s.nextRenewalDate - now) / (1000 * 60 * 60 * 24),
      );
      return obj;
    });
    const totalMonthly = enriched.reduce((s, sub) => {
      if (sub.billingCycle === "monthly") return s + sub.amount;
      if (sub.billingCycle === "yearly") return s + sub.amount / 12;
      if (sub.billingCycle === "quarterly") return s + sub.amount / 3;
      return s;
    }, 0);
    const zombieCount = enriched.filter((s) => s.isZombie).length;
    const zombieWaste = enriched
      .filter((s) => s.isZombie)
      .reduce((s, sub) => {
        if (sub.billingCycle === "monthly") return s + sub.amount;
        if (sub.billingCycle === "yearly") return s + sub.amount / 12;
        return s;
      }, 0);
    res.json({
      subscriptions: enriched,
      totalMonthly: Math.round(totalMonthly),
      zombieCount,
      zombieWaste: Math.round(zombieWaste),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, amount, billingCycle, category, nextRenewalDate } = req.body;
    if (!name || !amount || !nextRenewalDate) {
      return res.status(400).json({
        error: "Name, amount, and renewal date are required",
      });
    }
    if (isNaN(Date.parse(nextRenewalDate))) {
      return res.status(400).json({ error: "Invalid renewal date format" });
    }
    const sub = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({ subscription: sub });
  } catch (err) {
    const errorMsg = err.message || "Error creating subscription";
    res.status(400).json({ error: errorMsg });
  }
});

router.put("/:id/used", async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { lastUsedDate: new Date() },
      { new: true },
    );
    res.json({
      subscription: sub,
      message: "Marked as used - no longer a zombie!",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id/cancel", async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isActive: false },
      { new: true },
    );
    res.json({
      subscription: sub,
      message: `Cancelled ${sub.name}. You'll save ₹${sub.amount} per ${sub.billingCycle}!`,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Subscription.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
