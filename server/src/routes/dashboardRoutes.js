const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const authenticateToken = require("../middleware/authenticateToken");

// Dashboard Summary
router.get(
  "/summary",
  authenticateToken,
  dashboardController.getDashboardSummary,
);

module.exports = router;
