const categoryModel = require("../models/categoryModel");

// Create Category
const createCategory = async (req, res) => {
  try {
    let { name, description } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    name = name.trim();

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Category name cannot exceed 100 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 500 characters",
      });
    }

    // Check duplicate
    const existingCategory = await categoryModel.getCategoryByName(name);

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const result = await categoryModel.createCategory({
      name,
      description: description?.trim() || null,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      categoryId: result.insertId,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Category By ID
const getCategoryById = async (req, res) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    let { name, description } = req.body;
    const { id } = req.params;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    name = name.trim();

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Category name cannot exceed 100 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 500 characters",
      });
    }

    const category = await categoryModel.getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const existingCategory = await categoryModel.getCategoryByName(name);

    if (existingCategory && existingCategory.id !== Number(id)) {
      return res.status(409).json({
        success: false,
        message: "Category name already exists",
      });
    }

    await categoryModel.updateCategory(id, {
      name,
      description: description?.trim() || null,
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await categoryModel.deleteCategory(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
