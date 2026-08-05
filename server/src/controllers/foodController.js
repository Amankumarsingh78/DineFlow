const foodModel = require("../models/foodModel");

// Create Food
const createFood = async (req, res) => {
  try {
    let {
      category_id,
      name,
      description,
      price,
      estimated_prep_time,
      is_available,
    } = req.body;

    // Validation
    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Food name is required",
      });
    }

    name = name.trim();

    if (name.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Food name cannot exceed 150 characters",
      });
    }

    if (description && description.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 1000 characters",
      });
    }

    if (!price || isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    if (
      !estimated_prep_time ||
      isNaN(estimated_prep_time) ||
      Number(estimated_prep_time) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid preparation time is required",
      });
    }

    // Check category
    const category = await foodModel.categoryExists(category_id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Duplicate check
    const existingFood = await foodModel.getFoodByName(name);

    if (existingFood) {
      return res.status(409).json({
        success: false,
        message: "Food already exists",
      });
    }

    const result = await foodModel.createFood({
      category_id,
      name,
      description: description?.trim() || null,
      price,
      image: req.file ? req.file.filename : null,
      estimated_prep_time,
      is_available: is_available !== undefined ? is_available : true,
    });

    return res.status(201).json({
      success: true,
      message: "Food created successfully",
      foodId: result.insertId,
    });
  } catch (error) {
    console.error("Create Food Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get All Foods
const getAllFoods = async (req, res) => {
  try {
    const foods = await foodModel.getAllFoods();

    return res.status(200).json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.error("Get Foods Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Food By ID
const getFoodById = async (req, res) => {
  try {
    const food = await foodModel.getFoodById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: food,
    });
  } catch (error) {
    console.error("Get Food Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update Food
const updateFood = async (req, res) => {
  try {
    let {
      category_id,
      name,
      description,
      price,
      estimated_prep_time,
      is_available,
    } = req.body;

    const { id } = req.params;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Food name is required",
      });
    }

    name = name.trim();

    const food = await foodModel.getFoodById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const category = await foodModel.categoryExists(category_id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const existingFood = await foodModel.getFoodByName(name);

    if (existingFood && existingFood.id !== Number(id)) {
      return res.status(409).json({
        success: false,
        message: "Food name already exists",
      });
    }

    await foodModel.updateFood(id, {
      category_id,
      name,
      description: description?.trim() || null,
      price,
      image: req.file ? req.file.filename : food.image,
      estimated_prep_time,
      is_available,
    });

    return res.status(200).json({
      success: true,
      message: "Food updated successfully",
    });
  } catch (error) {
    console.error("Update Food Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Food
const deleteFood = async (req, res) => {
  try {
    const food = await foodModel.getFoodById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    await foodModel.deleteFood(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    console.error("Delete Food Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createFood,
  getAllFoods,
  getFoodById,
  updateFood,
  deleteFood,
};
