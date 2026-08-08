import { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";

function FoodForm({ onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    image: "",
    estimated_prep_time: "",
    is_available: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();

        setCategories(response.data || []);
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // API integration next step
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-900">Add New Food 🍔</h2>

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
          placeholder="Preparation time (minutes)"
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

          <span className="text-sm text-slate-600">Available</span>
        </label>

        <button
          type="submit"
          className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Save Food
        </button>
      </form>
    </div>
  );
}

export default FoodForm;
