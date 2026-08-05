const db = require("../config/db");

// Check if category exists
const categoryExists = async (categoryId) => {
  const [rows] = await db.execute("SELECT id FROM categories WHERE id = ?", [
    categoryId,
  ]);

  return rows[0];
};

// Create Food
const createFood = async (foodData) => {
  const {
    category_id,
    name,
    description,
    price,
    image,
    estimated_prep_time,
    is_available,
  } = foodData;

  const [result] = await db.execute(
    `INSERT INTO foods
    (category_id, name, description, price, image, estimated_prep_time, is_available)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      category_id,
      name,
      description,
      price,
      image,
      estimated_prep_time,
      is_available,
    ],
  );

  return result;
};

// Get All Foods
const getAllFoods = async () => {
  const [rows] = await db.execute(
    `SELECT
        f.*,
        c.name AS category_name
     FROM foods f
     JOIN categories c ON f.category_id = c.id
     ORDER BY f.name ASC`,
  );

  return rows;
};

// Get Food By ID
const getFoodById = async (id) => {
  const [rows] = await db.execute(
    `SELECT
        f.*,
        c.name AS category_name
     FROM foods f
     JOIN categories c ON f.category_id = c.id
     WHERE f.id = ?`,
    [id],
  );

  return rows[0];
};

// Get Food By Name
const getFoodByName = async (name) => {
  const [rows] = await db.execute("SELECT * FROM foods WHERE name = ?", [name]);

  return rows[0];
};

// Update Food
const updateFood = async (id, foodData) => {
  const {
    category_id,
    name,
    description,
    price,
    image,
    estimated_prep_time,
    is_available,
  } = foodData;

  const [result] = await db.execute(
    `UPDATE foods
     SET
       category_id = ?,
       name = ?,
       description = ?,
       price = ?,
       image = ?,
       estimated_prep_time = ?,
       is_available = ?,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      category_id,
      name,
      description,
      price,
      image,
      estimated_prep_time,
      is_available,
      id,
    ],
  );

  return result;
};

// Delete Food
const deleteFood = async (id) => {
  const [result] = await db.execute("DELETE FROM foods WHERE id = ?", [id]);

  return result;
};

module.exports = {
  categoryExists,
  createFood,
  getAllFoods,
  getFoodById,
  getFoodByName,
  updateFood,
  deleteFood,
};
