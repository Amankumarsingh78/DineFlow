import api from "./api";

const getFoods = async () => {
  const response = await api.get("/foods");
  return response.data;
};

const getFoodById = async (id) => {
  const response = await api.get(`/foods/${id}`);
  return response.data;
};

const createFood = async (foodData) => {
  const response = await api.post("/foods", foodData);
  return response.data;
};

const updateFood = async (id, foodData) => {
  const response = await api.put(`/foods/${id}`, foodData);
  return response.data;
};

const deleteFood = async (id) => {
  const response = await api.delete(`/foods/${id}`);
  return response.data;
};

const foodService = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};

export default foodService;
