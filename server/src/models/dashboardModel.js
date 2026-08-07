const db = require("../config/db");

// Today's Orders
const getTodayOrders = async () => {
  const [rows] = await db.execute(`
    SELECT COUNT(*) AS total
    FROM orders
    WHERE DATE(created_at) = CURDATE()
      AND status IN ('ACTIVE', 'COMPLETED')
  `);

  return rows[0].total;
};

// Today's Revenue
const getTodayRevenue = async () => {
  const [rows] = await db.execute(`
    SELECT IFNULL(SUM(subtotal), 0) AS revenue
    FROM orders
    WHERE DATE(created_at) = CURDATE()
      AND status = 'COMPLETED'
  `);

  return rows[0].revenue;
};

// Monthly Revenue
const getMonthlyRevenue = async () => {
  const [rows] = await db.execute(`
    SELECT IFNULL(SUM(subtotal), 0) AS revenue
    FROM orders
    WHERE YEAR(created_at) = YEAR(CURDATE())
      AND MONTH(created_at) = MONTH(CURDATE())
      AND status = 'COMPLETED'
  `);

  return rows[0].revenue;
};

// Total Foods
const getTotalFoods = async () => {
  const [rows] = await db.execute(`
    SELECT COUNT(*) AS total
    FROM foods
  `);

  return rows[0].total;
};

module.exports = {
  getTodayOrders,
  getTodayRevenue,
  getMonthlyRevenue,
  getTotalFoods,
};
