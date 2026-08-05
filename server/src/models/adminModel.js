const db = require("../config/db");

// Create Admin
const createAdmin = async (adminData) => {
  const { name, email, password, role } = adminData;

  const sql = `
    INSERT INTO admins (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [name, email, password, role]);

  return result;
};

// Find Admin By Email
const findAdminByEmail = async (email) => {
  const sql = `
    SELECT *
    FROM admins
    WHERE email = ?
  `;

  const [rows] = await db.query(sql, [email]);

  return rows;
};

// Find Admin By ID
const findAdminById = async (id) => {
  const sql = `
    SELECT id, name, email, role, created_at
    FROM admins
    WHERE id = ?
  `;

  const [rows] = await db.query(sql, [id]);

  return rows;
};

module.exports = {
  createAdmin,
  findAdminByEmail,
  findAdminById,
};
