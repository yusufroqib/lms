const express = require("express");

const { handleStripeWebhook } = require("../controllers/courseController");

const router = express.Router();
router.post("/webhook", handleStripeWebhook);

module.exports = router;
