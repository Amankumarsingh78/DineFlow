const dashboardModel = require("../models/dashboardModel");

const getDashboardSummary = async (req, res) => {
  try {
    const [todayOrders, todayRevenue, monthlyRevenue, totalFoods] =
      await Promise.all([
        dashboardModel.getTodayOrders(),
        dashboardModel.getTodayRevenue(),
        dashboardModel.getMonthlyRevenue(),
        dashboardModel.getTotalFoods(),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        todayOrders: Number(todayOrders),
        todayRevenue: Number(todayRevenue),
        monthlyRevenue: Number(monthlyRevenue),
        totalFoods: Number(totalFoods),
      },
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getDashboardSummary,
};
