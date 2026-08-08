import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import dashboardService from "../../services/dashboardService";

function Dashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    totalFoods: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardService.getDashboardSummary();

      setStats(response.data);
    } catch (error) {
      console.error("Dashboard error:", error);

      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Today's Orders",
      value: stats.todayOrders,
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue}`,
    },
    {
      title: "Monthly Revenue",
      value: `₹${stats.monthlyRevenue}`,
    },
    {
      title: "Total Foods",
      value: stats.totalFoods,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

        <p className="mt-2 text-sm text-slate-500">
          Welcome back. Here's what's happening with your restaurant.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{card.title}</p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {loading ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>

        <div className="flex min-h-48 items-center justify-center">
          <p className="text-sm text-slate-400">
            Recent order analytics coming next.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
