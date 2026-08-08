import api from "./api";

const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

const getFoods = async () => {
  const response = await api.get("/foods");
  return response.data;
};

const getTableById = async (tableId) => {
  const response = await api.get(`/customer/tables/${tableId}`);
  return response.data;
};

const menuService = {
  getCategories,
  getFoods,
  getTableById,
};

export default menuService;
