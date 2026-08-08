import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import categoryService from "../../services/categoryService";
import foodService from "../../services/foodService";

function Foods() {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    image: "",
    estimated_prep_time: "",
    is_available: true,
  });

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();

      setCategories(response.data || []);
    } catch (error) {
      console.error("Category fetch error:", error);
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await foodService.getFoods();

      setFoods(response.data || []);
    } catch (error) {
      console.error("Food fetch error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchFoods();
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditId(null);

    setFormData({
      name: "",
      description: "",
      category_id: "",
      price: "",
      image: "",
      estimated_prep_time: "",
      is_available: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await foodService.updateFood(editId, formData);

        toast.success("Food updated successfully");
      } else {
        await foodService.createFood(formData);

        toast.success("Food added successfully");
      }

      resetForm();

      await fetchFoods();
    } catch (error) {
      console.error("Food submit error:", error);

      toast.error(error.response?.data?.message || "Food operation failed");
    }
  };

  const handleEdit = (food) => {
    setEditId(food.id);

    setFormData({
      name: food.name,
      description: food.description || "",
      category_id: food.category_id,
      price: food.price,
      image: food.image || "",
      estimated_prep_time: food.estimated_prep_time || "",
      is_available: Boolean(food.is_available),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this food?",
      );

      if (!confirmDelete) return;

      await foodService.deleteFood(id);

      toast.success("Food deleted successfully");

      await fetchFoods();
    } catch (error) {
      console.error("Delete food error:", error);

      toast.error(error.response?.data?.message || "Failed to delete food");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Food Management 🍔
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Add and manage restaurant food items.
        </p>
      </div>

      {/* Food Form */}

      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-slate-900">
          {editId ? "Edit Food" : "Add New Food"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Food name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          />

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            type="number"
            name="estimated_prep_time"
            placeholder="Preparation time"
            value={formData.estimated_prep_time}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3"
          />

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
            />

            <span>Available</span>
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              {editId ? "Update Food" : "Save Food"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Food List */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold">Food List</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="pb-3">Name</th>

                <th className="pb-3">Price</th>

                <th className="pb-3">Prep Time</th>

                <th className="pb-3">Status</th>

                <th className="pb-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {foods.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    No foods available
                  </td>
                </tr>
              ) : (
                foods.map((food) => (
                  <tr key={food.id} className="border-b">
                    <td className="py-4 font-medium">{food.name}</td>

                    <td className="py-4">₹{food.price}</td>

                    <td className="py-4">{food.estimated_prep_time} min</td>

                    <td className="py-4">
                      {food.is_available ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                          Unavailable
                        </span>
                      )}
                    </td>

                    <td className="py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(food)}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(food.id)}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Foods;
