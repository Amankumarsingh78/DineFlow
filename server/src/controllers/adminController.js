const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const generateToken = require("../utils/generateToken");

// ===============================
// Admin Registration
// ===============================
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate request
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findAdminByEmail(email);

    if (existingAdmin.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare data
    const adminData = {
      name,
      email,
      password: hashedPassword,
      role: "admin",
    };

    // Save admin
    const result = await Admin.createAdmin(adminData);

    // Success response
    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: result.insertId,
        name,
        email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Register Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ===============================
// Admin Login
// ===============================
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find admin
    const admins = await Admin.findAdminByEmail(email);

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const admin = admins[0];

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(admin);

    // Success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// ===============================
// Admin Profile
// ===============================
const getAdminProfile = async (req, res) => {
  try {
    const admins = await Admin.findAdminById(req.admin.id);

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin: admins[0],
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
};
