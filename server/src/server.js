require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

// Database Connection Test
async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("✅ MySQL Database Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("❌ Database Connection Failed");
    console.log(error.message);

    process.exit(1);
  }
}

startServer();
