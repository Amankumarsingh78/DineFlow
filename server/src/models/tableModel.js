const db = require("../config/db");

// Create Table
const createTable = async (tableData) => {
  const { table_number, qr_code } = tableData;

  const [result] = await db.execute(
    `INSERT INTO restaurant_tables
    (table_number, qr_code)
    VALUES (?, ?)`,
    [table_number, qr_code],
  );

  return result;
};

// Get All Tables
const getAllTables = async () => {
  const [rows] = await db.execute(
    `SELECT *
     FROM restaurant_tables
     ORDER BY id ASC`,
  );

  return rows;
};

// Get Table By ID
const getTableById = async (id) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM restaurant_tables
     WHERE id = ?`,
    [id],
  );

  return rows[0];
};

// Get Table By Number
const getTableByNumber = async (table_number) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM restaurant_tables
     WHERE table_number = ?`,
    [table_number],
  );

  return rows[0];
};

// Update Table
const updateTable = async (id, tableData) => {
  const { table_number } = tableData;

  const [result] = await db.execute(
    `UPDATE restaurant_tables
     SET table_number = ?,
     updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [table_number, id],
  );

  return result;
};

// Delete Table
const deleteTable = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM restaurant_tables
     WHERE id = ?`,
    [id],
  );

  return result;
};
// Occupy Table
const occupyTable = async (tableId, orderId, customerName) => {
  const [result] = await db.execute(
    `UPDATE restaurant_tables
     SET
       is_occupied = true,
       current_order_id = ?,
       current_customer_name = ?,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [orderId, customerName, tableId],
  );

  return result;
};

// Free Table
const freeTable = async (tableId) => {
  const [result] = await db.execute(
    `UPDATE restaurant_tables
     SET
       is_occupied = false,
       current_order_id = NULL,
       current_customer_name = NULL,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [tableId],
  );

  return result;
};

module.exports = {
  createTable,
  getAllTables,
  getTableById,
  getTableByNumber,
  updateTable,
  deleteTable,
  occupyTable,
  freeTable,
};
