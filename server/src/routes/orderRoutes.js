const express = require("express");

const router = express.Router();

const orderController = require("../controllers/orderController");
const orderItemController = require("../controllers/orderItemController");
const authenticateToken = require("../middleware/authenticateToken");

// =======================
// Order Routes
// =======================

// Create Order
router.post("/", authenticateToken, orderController.createOrder);

// Get Active Order by Table
router.get(
  "/table/:tableId/active",
  authenticateToken,
  orderController.getActiveOrderByTableId,
);

// Complete Order
router.put(
  "/:orderId/complete",
  authenticateToken,
  orderController.completeOrder,
);

// Get Order by ID
router.get("/:orderId", authenticateToken, orderController.getOrderById);

// =======================
// Order Item Routes
// =======================

// Add Item
router.post(
  "/:orderId/items",
  authenticateToken,
  orderItemController.addOrderItem,
);

// Get Items
router.get(
  "/:orderId/items",
  authenticateToken,
  orderItemController.getOrderItems,
);

// Update Item
router.put(
  "/:orderId/items/:itemId",
  authenticateToken,
  orderItemController.updateOrderItemQuantity,
);

// Delete Item
router.delete(
  "/:orderId/items/:itemId",
  authenticateToken,
  orderItemController.deleteOrderItem,
);

module.exports = router;
