const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

module.exports = app;
