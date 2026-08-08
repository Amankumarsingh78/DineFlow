import api from "./api";

// =======================
// Admin Order APIs
// =======================

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

// =======================
// Customer Order APIs
// =======================

const createCustomerOrder = async (
  tableId,
  customerName,
  specialInstruction = "",
) => {
  const response = await api.post("/customer/orders", {
    table_id: tableId,
    customer_name: customerName,
    special_instruction: specialInstruction,
  });

  return response.data;
};

const getActiveCustomerOrder = async (tableId) => {
  const response = await api.get(
    `/customer/orders/table/${tableId}/active`,
  );

  return response.data;
};

const getCustomerOrderById = async (orderId) => {
  const response = await api.get(`/customer/orders/${orderId}`);
  return response.data;
};

const addCustomerOrderItem = async (
  orderId,
  foodId,
  quantity = 1,
) => {
  const response = await api.post(
    `/customer/orders/${orderId}/items`,
    {
      food_id: foodId,
      quantity,
    },
  );

  return response.data;
};

const getCustomerOrderItems = async (orderId) => {
  const response = await api.get(
    `/customer/orders/${orderId}/items`,
  );

  return response.data;
};

const updateCustomerOrderItem = async (
  orderId,
  itemId,
  quantity,
) => {
  const response = await api.put(
    `/customer/orders/${orderId}/items/${itemId}`,
    {
      quantity,
    },
  );

  return response.data;
};

const deleteCustomerOrderItem = async (
  orderId,
  itemId,
) => {
  const response = await api.delete(
    `/customer/orders/${orderId}/items/${itemId}`,
  );

  return response.data;
};

const orderService = {
  // Admin
  getOrders,
  getOrderById,
  getOrderItems,
  completeOrder,

  // Customer
  createCustomerOrder,
  getActiveCustomerOrder,
  getCustomerOrderById,
  addCustomerOrderItem,
  getCustomerOrderItems,
  updateCustomerOrderItem,
  deleteCustomerOrderItem,
};

export default orderService;
