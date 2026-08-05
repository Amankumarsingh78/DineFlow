const express = require("express");

const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} = require("../controllers/adminController");

const authenticateToken = require("../middleware/authenticateToken");

// ===============================
// Public Routes
// ===============================
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// ===============================
// Protected Routes
// ===============================
router.get("/profile", authenticateToken, getAdminProfile);

module.exports = router;
