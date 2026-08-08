import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";

import categoryService from "../../services/categoryService";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await categoryService.getCategories();

      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error("Fetch Categories Error:", error);

      toast.error(error.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
    });

    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      description: category.description || "",
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setModalOpen(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSubmitting(true);

      if (editingCategory) {
        const response = await categoryService.updateCategory(
          editingCategory.id,
          {
            name,
            description,
          },
        );

        if (response.success) {
          toast.success("Category updated successfully");
        }
      } else {
        const response = await categoryService.createCategory({
          name,
          description,
        });

        if (response.success) {
          toast.success("Category created successfully");
        }
      }

      closeModal();
      await fetchCategories();
    } catch (error) {
      console.error("Save Category Error:", error);

      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`,
    );

    if (!confirmed) return;

    try {
      const response = await categoryService.deleteCategory(category.id);

      if (response.success) {
        toast.success("Category deleted successfully");

        setCategories((previous) =>
          previous.filter((item) => item.id !== category.id),
        );
      }
    } catch (error) {
      console.error("Delete Category Error:", error);

      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((category) => {
    const searchValue = search.toLowerCase();

    return (
      category.name?.toLowerCase().includes(searchValue) ||
      category.description?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your restaurant food categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
        >
          <FiPlus size={18} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <FiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-56 items-center justify-center">
            <div className="text-sm text-slate-500">Loading categories...</div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
              🍽️
            </div>

            <h3 className="text-lg font-semibold text-slate-800">
              {search ? "No categories found" : "No categories yet"}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {search
                ? "Try a different search term."
                : "Create your first restaurant category."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Description
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 font-bold text-orange-500">
                            {category.name?.charAt(0)?.toUpperCase()}
                          </div>

                          <span className="font-semibold text-slate-800">
                            {category.name}
                          </span>
                        </div>
                      </td>

                      <td className="max-w-md px-6 py-5 text-sm text-slate-500">
                        {category.description || "No description"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(category)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-orange-50 hover:text-orange-500"
                            title="Edit"
                          >
                            <FiEdit2 size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(category)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                            title="Delete"
                          >
                            <FiTrash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredCategories.map((category) => (
                <div key={category.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 font-bold text-orange-500">
                        {category.name?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {category.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {category.description || "No description"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(category)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-orange-50 hover:text-orange-500"
                      >
                        <FiEdit2 size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-500"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingCategory
                    ? "Update category information."
                    : "Create a new food category."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category Name
                </label>

                <input
                  id="category-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Burgers"
                  disabled={submitting}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="category-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe this category..."
                  rows={4}
                  disabled={submitting}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
