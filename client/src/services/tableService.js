import api from "./api";

const getTables = async () => {
  const response = await api.get("/tables");

  return response.data;
};

const getTableById = async (id) => {
  const response = await api.get(`/tables/${id}`);

  return response.data;
};

const createTable = async (tableData) => {
  const response = await api.post("/tables", tableData);

  return response.data;
};

const updateTable = async (id, tableData) => {
  const response = await api.put(`/tables/${id}`, tableData);

  return response.data;
};

const deleteTable = async (id) => {
  const response = await api.delete(`/tables/${id}`);

  return response.data;
};

const tableService = {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
};

export default tableService;
