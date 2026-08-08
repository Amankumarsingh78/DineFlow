import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import tableService from "../../services/tableService";

function Tables() {
  const [tables, setTables] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    table_number: "",
  });

  const fetchTables = async () => {
    try {
      const response = await tableService.getTables();
      setTables(response.data || []);
    } catch (error) {
      console.error("Table fetch error:", error);
      toast.error("Failed to load tables");
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormData({
      table_number: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await tableService.updateTable(editId, formData);
        toast.success("Table updated successfully");
      } else {
        await tableService.createTable(formData);
        toast.success("Table created successfully");
      }

      resetForm();
      await fetchTables();
    } catch (error) {
      console.error("Table save error:", error);

      toast.error(error.response?.data?.message || "Failed to save table");
    }
  };

  const handleEdit = (table) => {
    setEditId(table.id);

    setFormData({
      table_number: table.table_number,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this table?",
    );

    if (!confirmDelete) return;

    try {
      await tableService.deleteTable(id);

      toast.success("Table deleted successfully");

      if (editId === id) {
        resetForm();
      }

      await fetchTables();
    } catch (error) {
      console.error("Delete table error:", error);

      toast.error(error.response?.data?.message || "Failed to delete table");
    }
  };

  const getQrUrl = (tableNumber) => {
    return `${window.location.origin}/menu?table=${tableNumber}`;
  };

  const handleQrOpen = (tableNumber) => {
    const qrUrl = getQrUrl(tableNumber);

    window.open(
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        qrUrl,
      )}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Table Management 🪑
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage restaurant tables, availability and QR access.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-slate-900">
          {editId ? "Update Table" : "Add New Table"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="table_number"
            placeholder="Table Number"
            value={formData.table_number}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              {editId ? "Update Table" : "Save Table"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table List */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-slate-900">
          Restaurant Tables
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="pb-3">Table No.</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">QR</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {tables.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    No tables available
                  </td>
                </tr>
              ) : (
                tables.map((table) => (
                  <tr key={table.id} className="border-b">
                    <td className="py-4 font-medium text-slate-800">
                      Table {table.table_number}
                    </td>

                    <td className="py-4">
                      {table.is_occupied ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                          Occupied
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          Available
                        </span>
                      )}
                    </td>

                    <td className="py-4 text-slate-600">
                      {table.current_customer_name || "-"}
                    </td>

                    <td className="py-4">
                      <button
                        type="button"
                        onClick={() => handleQrOpen(table.table_number)}
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
                      >
                        QR
                      </button>
                    </td>

                    <td className="space-x-2 py-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(table)}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(table.id)}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
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

export default Tables;
