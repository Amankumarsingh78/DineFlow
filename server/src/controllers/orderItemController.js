const orderModel = require("../models/orderModel");
const foodModel = require("../models/foodModel");
const orderItemModel = require("../models/orderItemModel");

// Add Item to Order
const addOrderItem = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { food_id, quantity } = req.body;

    // Validation
    if (!food_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Food ID and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero",
      });
    }

    // Check Order
    const order = await orderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Order is not active",
      });
    }

    // Check Food
    const food = await foodModel.getFoodById(food_id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    if (!food.is_available) {
      return res.status(400).json({
        success: false,
        message: "Food is currently unavailable",
      });
    }

    // Check Existing Item
    const existingItem = await orderItemModel.getOrderItem(orderId, food_id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const newSubtotal = newQuantity * Number(food.price);

      await orderItemModel.updateOrderItem(
        existingItem.id,
        newQuantity,
        newSubtotal,
      );
    } else {
      const subtotal = quantity * Number(food.price);

      await orderItemModel.createOrderItem({
        order_id: orderId,
        food_id,
        quantity,
        price: food.price,
        subtotal,
      });
    }

    // Update Order Total
    const total = await orderItemModel.calculateOrderTotal(orderId);

    await orderModel.updateOrderSubtotal(orderId, total);

    return res.status(201).json({
      success: true,
      message: "Item added successfully",
      subtotal: total,
    });
  } catch (error) {
    console.error("Add Order Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Order Items
const getOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check Order
    const order = await orderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Get Items
    const items = await orderItemModel.getOrderItemsWithFoodDetails(orderId);

    // Calculate Total
    const total = await orderItemModel.calculateOrderTotal(orderId);

    return res.status(200).json({
      success: true,
      count: items.length,
      subtotal: total,
      data: items,
    });
  } catch (error) {
    console.error("Get Order Items Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Update Order Item Quantity
const updateOrderItemQuantity = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid quantity is required",
      });
    }

    // Check Order
    const order = await orderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Order is not active",
      });
    }

    // Check Item
    const item = await orderItemModel.getOrderItemById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    // Security Check
    if (item.order_id != orderId) {
      return res.status(400).json({
        success: false,
        message: "Item does not belong to this order",
      });
    }

    // Calculate New Subtotal
    const newSubtotal = Number(item.price) * quantity;

    // Update Item
    await orderItemModel.updateOrderItem(itemId, quantity, newSubtotal);

    // Update Order Total
    const total = await orderItemModel.calculateOrderTotal(orderId);

    await orderModel.updateOrderSubtotal(orderId, total);

    return res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      subtotal: total,
    });
  } catch (error) {
    console.error("Update Order Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Order Item
const deleteOrderItem = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;

    // Check Order
    const order = await orderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Order is not active",
      });
    }

    // Check Item
    const item = await orderItemModel.getOrderItemById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order item not found",
      });
    }

    // Security Check
    if (item.order_id != orderId) {
      return res.status(400).json({
        success: false,
        message: "Item does not belong to this order",
      });
    }

    // Delete Item
    await orderItemModel.deleteOrderItem(itemId);

    // Recalculate Order Total
    const total = await orderItemModel.calculateOrderTotal(orderId);

    await orderModel.updateOrderSubtotal(orderId, total);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      subtotal: total,
    });
  } catch (error) {
    console.error("Delete Order Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addOrderItem,
  getOrderItems,
  updateOrderItemQuantity,
  deleteOrderItem,
};
