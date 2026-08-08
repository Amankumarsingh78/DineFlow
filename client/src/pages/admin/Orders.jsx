import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import orderService from "../../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [items, setItems] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrders();

      setOrders(response.data || []);
    } catch (error) {
      console.error("Order fetch error:", error);

      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewItems = async (order) => {
    try {
      const response = await orderService.getOrderItems(order.id);

      setSelectedOrder(order);
      setItems(response.data || []);
    } catch (error) {
      console.error("Items fetch error:", error);

      toast.error("Failed to load order items");
    }
  };

  const handleComplete = async (id) => {
    const confirmComplete = window.confirm("Complete this order?");

    if (!confirmComplete) return;

    try {
      await orderService.completeOrder(id);

      toast.success("Order completed successfully");

      setSelectedOrder(null);
      setItems([]);

      fetchOrders();
    } catch (error) {
      console.error("Complete order error:", error);

      toast.error(error.response?.data?.message || "Failed to complete order");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Order Management 🧾
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage customer orders and restaurant workflow.
        </p>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-slate-900">Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="pb-3">ID</th>

                <th className="pb-3">Customer</th>

                <th className="pb-3">Table</th>

                <th className="pb-3">Amount</th>

                <th className="pb-3">Status</th>

                <th className="pb-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-4">#{order.id}</td>

                    <td className="py-4 font-medium">{order.customer_name}</td>

                    <td className="py-4">
                      {order.table_number || order.table_id}
                    </td>

                    <td className="py-4">₹{order.subtotal || 0}</td>

                    <td className="py-4">
                      {order.status === "COMPLETED" ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          Completed
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="space-x-2 py-4">
                      <button
                        onClick={() => handleViewItems(order)}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                      >
                        View
                      </button>

                      {order.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleComplete(order.id)}
                          className="rounded-lg bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details */}

      {selectedOrder && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Order #{selectedOrder.id} Items
          </h2>

          {items.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-3">
              <span>
                {item.name} × {item.quantity}
              </span>

              <span className="font-semibold">₹{item.subtotal}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
