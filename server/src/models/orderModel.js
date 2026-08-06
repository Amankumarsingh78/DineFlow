const db = require("../config/db");

// Create Order
const createOrder = async ({
  table_id,
  customer_name,
  special_instruction,
}) => {
  const [result] = await db.execute(
    `INSERT INTO orders
    (table_id, customer_name, special_instruction)
    VALUES (?, ?, ?)`,
    [table_id, customer_name, special_instruction],
  );

  return result;
};

// Get Active Order By Table ID
const getActiveOrderByTableId = async (tableId) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM orders
     WHERE table_id = ?
       AND status = 'ACTIVE'
     LIMIT 1`,
    [tableId],
  );

  return rows[0];
};

// Get Order By ID
const getOrderById = async (id) => {
  const [rows] = await db.execute(
    `SELECT
        o.*,
        rt.table_number
     FROM orders o
     INNER JOIN restaurant_tables rt
       ON o.table_id = rt.id
     WHERE o.id = ?`,
    [id],
  );

  return rows[0];
};

// Complete Order
const completeOrder = async (id) => {
  const [result] = await db.execute(
    `UPDATE orders
     SET status = 'COMPLETED'
     WHERE id = ?`,
    [id],
  );

  return result;
};
// Update Order Subtotal
const updateOrderSubtotal = async (id, subtotal) => {
  const [result] = await db.execute(
    `UPDATE orders
     SET subtotal = ?
     WHERE id = ?`,
    [subtotal, id],
  );

  return result;
};

module.exports = {
  createOrder,
  getActiveOrderByTableId,
  getOrderById,
  completeOrder,
  updateOrderSubtotal,
};
