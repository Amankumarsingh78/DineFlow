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

module.exports = {
  createTable,
  getAllTables,
  getTableById,
  getTableByNumber,
  updateTable,
  deleteTable,
};
