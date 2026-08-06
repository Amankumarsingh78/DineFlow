const db = require("../config/db");

// Create Order Item
const createOrderItem = async (itemData) => {
  const { order_id, food_id, quantity, price, subtotal } = itemData;

  const [result] = await db.execute(
    `INSERT INTO order_items
    (order_id, food_id, quantity, price, subtotal)
    VALUES (?, ?, ?, ?, ?)`,
    [order_id, food_id, quantity, price, subtotal],
  );

  return result;
};

// Get Existing Order Item
const getOrderItem = async (order_id, food_id) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM order_items
     WHERE order_id = ?
       AND food_id = ?`,
    [order_id, food_id],
  );

  return rows[0];
};

// Get All Items of an Order
const getOrderItemsByOrderId = async (order_id) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM order_items
     WHERE order_id = ?
     ORDER BY id ASC`,
    [order_id],
  );

  return rows;
};

// Get Order Items with Food Details
const getOrderItemsWithFoodDetails = async (order_id) => {
  const [rows] = await db.execute(
    `SELECT
        oi.id,
        oi.order_id,
        oi.food_id,
        f.name,
        f.description,
        f.image,
        oi.price,
        oi.quantity,
        oi.subtotal
     FROM order_items oi
     INNER JOIN foods f
       ON oi.food_id = f.id
     WHERE oi.order_id = ?
     ORDER BY oi.id ASC`,
    [order_id],
  );

  return rows;
};

// Get Order Item By ID
const getOrderItemById = async (id) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM order_items
     WHERE id = ?`,
    [id],
  );

  return rows[0];
};

// Update Quantity
const updateOrderItem = async (id, quantity, subtotal) => {
  const [result] = await db.execute(
    `UPDATE order_items
     SET quantity = ?,
         subtotal = ?
     WHERE id = ?`,
    [quantity, subtotal, id],
  );

  return result;
};

// Delete Item
const deleteOrderItem = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM order_items
     WHERE id = ?`,
    [id],
  );

  return result;
};

// Calculate Order Total
const calculateOrderTotal = async (order_id) => {
  const [rows] = await db.execute(
    `SELECT IFNULL(SUM(subtotal), 0) AS total
     FROM order_items
     WHERE order_id = ?`,
    [order_id],
  );

  return rows[0].total;
};

module.exports = {
  createOrderItem,
  getOrderItem,
  getOrderItemsByOrderId,
  getOrderItemById,
  getOrderItemsWithFoodDetails,
  updateOrderItem,
  deleteOrderItem,
  calculateOrderTotal,
};
