const express = require("express");

const router = express.Router();

const tableController = require("../controllers/tableController");

const authenticateToken = require("../middleware/authenticateToken");

// Admin Protected Routes

// Create Table
router.post("/", authenticateToken, tableController.createTable);

// Get All Tables
router.get("/", authenticateToken, tableController.getAllTables);

// Get Table By ID
router.get("/:id", authenticateToken, tableController.getTableById);

// Update Table
router.put("/:id", authenticateToken, tableController.updateTable);

// Delete Table
router.delete("/:id", authenticateToken, tableController.deleteTable);

module.exports = router;
