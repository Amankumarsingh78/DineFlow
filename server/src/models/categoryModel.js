const db = require("../config/db");

// Create Category
const createCategory = async ({ name, description }) => {
  const [result] = await db.execute(
    `INSERT INTO categories (name, description)
     VALUES (?, ?)`,
    [name, description],
  );

  return result;
};

// Get All Categories
const getAllCategories = async () => {
  const [rows] = await db.execute(
    `SELECT *
     FROM categories
     ORDER BY name ASC`,
  );

  return rows;
};

// Get Category By ID
const getCategoryById = async (id) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM categories
     WHERE id = ?`,
    [id],
  );

  return rows[0];
};

// Get Category By Name
const getCategoryByName = async (name) => {
  const [rows] = await db.execute(
    `SELECT *
     FROM categories
     WHERE name = ?`,
    [name],
  );

  return rows[0];
};

// Update Category
const updateCategory = async (id, { name, description }) => {
  const [result] = await db.execute(
    `UPDATE categories
     SET
       name = ?,
       description = ?,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [name, description, id],
  );

  return result;
};

// Delete Category
const deleteCategory = async (id) => {
  const [result] = await db.execute(
    `DELETE FROM categories
     WHERE id = ?`,
    [id],
  );

  return result;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  updateCategory,
  deleteCategory,
};
