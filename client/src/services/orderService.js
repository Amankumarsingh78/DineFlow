import api from "./api";

const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

const getOrderItems = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/items`);
  return response.data;
};

const completeOrder = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/complete`);
  return response.data;
};

const orderService = {
  getOrders,
  getOrderById,
  getOrderItems,
  completeOrder,
};

export default orderService;
