const tableModel = require("../models/tableModel");

// Create Table
const createTable = async (req, res) => {
  try {
    let { table_number } = req.body;

    // Validation
    if (!table_number || !table_number.trim()) {
      return res.status(400).json({
        success: false,
        message: "Table number is required",
      });
    }

    table_number = table_number.trim();

    if (table_number.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Table number cannot exceed 50 characters",
      });
    }

    // Duplicate Check
    const existingTable = await tableModel.getTableByNumber(table_number);

    if (existingTable) {
      return res.status(409).json({
        success: false,
        message: "Table already exists",
      });
    }

    // Generate QR Identifier
    const qr_code = `DINEFLOW_TABLE_${table_number.replace(/\s+/g, "_")}`;

    const result = await tableModel.createTable({
      table_number,
      qr_code,
    });

    return res.status(201).json({
      success: true,
      message: "Table created successfully",
      tableId: result.insertId,
    });
  } catch (error) {
    console.error("Create Table Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get All Tables
const getAllTables = async (req, res) => {
  try {
    const tables = await tableModel.getAllTables();

    return res.status(200).json({
      success: true,
      data: tables,
    });
  } catch (error) {
    console.error("Get Tables Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Table By ID
const getTableById = async (req, res) => {
  try {
    const table = await tableModel.getTableById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    console.error("Get Table Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update Table
const updateTable = async (req, res) => {
  try {
    let { table_number } = req.body;

    const { id } = req.params;

    if (!table_number || !table_number.trim()) {
      return res.status(400).json({
        success: false,
        message: "Table number is required",
      });
    }

    table_number = table_number.trim();

    const table = await tableModel.getTableById(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    const existingTable = await tableModel.getTableByNumber(table_number);

    if (existingTable && existingTable.id !== Number(id)) {
      return res.status(409).json({
        success: false,
        message: "Table number already exists",
      });
    }

    await tableModel.updateTable(id, {
      table_number,
    });

    return res.status(200).json({
      success: true,
      message: "Table updated successfully",
    });
  } catch (error) {
    console.error("Update Table Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Table
const deleteTable = async (req, res) => {
  try {
    const table = await tableModel.getTableById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    await tableModel.deleteTable(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    console.error("Delete Table Error:", error);

    return res.status(500).json({
      success: false,

      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createTable,

  getAllTables,

  getTableById,

  updateTable,

  deleteTable,
};
