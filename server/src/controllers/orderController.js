const orderModel = require("../models/orderModel");
const tableModel = require("../models/tableModel");

// Create Order
const createOrder = async (req, res) => {
  try {
    const { table_id, customer_name, special_instruction } = req.body;

    // Validation
    if (!table_id || !customer_name || !customer_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Table ID and customer name are required",
      });
    }

    // Check table exists
    const table = await tableModel.getTableById(table_id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Check active order
    const activeOrder = await orderModel.getActiveOrderByTableId(table_id);

    if (activeOrder) {
      return res.status(200).json({
        success: true,
        message: "Active order already exists",
        data: activeOrder,
      });
    }

    // Create order
    const result = await orderModel.createOrder({
      table_id,
      customer_name: customer_name.trim(),
      special_instruction: special_instruction?.trim() || null,
    });

    // Mark table occupied
    await tableModel.occupyTable(
      table_id,
      result.insertId,
      customer_name.trim(),
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: result.insertId,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Order By ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Active Order By Table ID
const getActiveOrderByTableId = async (req, res) => {
  try {
    const { tableId } = req.params;

    const order = await orderModel.getActiveOrderByTableId(tableId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No active order found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Active Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Complete Order
const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check order exists
    const order = await orderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only ACTIVE orders can be completed
    if (order.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Order is not active",
      });
    }

    // Complete order
    await orderModel.completeOrder(orderId);

    // Free restaurant table
    await tableModel.freeTable(order.table_id);

    return res.status(200).json({
      success: true,
      message: "Order completed successfully",
    });
  } catch (error) {
    console.error("Complete Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getActiveOrderByTableId,
  completeOrder,
};
