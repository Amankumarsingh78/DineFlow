const express = require("express");

const router = express.Router();

const foodController = require("../controllers/foodController");

const authenticateToken = require("../middleware/authenticateToken");

// Public Routes

router.get("/", foodController.getAllFoods);

router.get("/:id", foodController.getFoodById);

// Admin Protected Routes

router.post("/", authenticateToken, foodController.createFood);

router.put("/:id", authenticateToken, foodController.updateFood);

router.delete("/:id", authenticateToken, foodController.deleteFood);

module.exports = router;
