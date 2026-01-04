const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "farminvest_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Validation helper
const validateInvestment = (data) => {
  const errors = [];

  if (
    !data.farmer_name ||
    typeof data.farmer_name !== "string" ||
    data.farmer_name.trim().length === 0
  ) {
    errors.push("farmer_name is required and must be a non-empty string");
  }

  if (!data.amount || typeof data.amount !== "number" || data.amount <= 0) {
    errors.push("amount is required and must be a positive number");
  }

  if (
    !data.crop ||
    typeof data.crop !== "string" ||
    data.crop.trim().length === 0
  ) {
    errors.push("crop is required and must be a non-empty string");
  }

  return errors;
};

// Routes

// GET /api/investments - Get all investments
app.get("/api/investments", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, farmer_name, amount, crop, created_at FROM investments ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching investments:", error);
    res.status(500).json({
      error: "Failed to fetch investments",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// POST /api/investments - Create new investment
app.post("/api/investments", async (req, res) => {
  try {
    const { farmer_name, amount, crop } = req.body;

    // Validate input
    const validationErrors = validateInvestment({ farmer_name, amount, crop });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    // Insert into database using parameterized query
    const [result] = await pool.query(
      "INSERT INTO investments (farmer_name, amount, crop) VALUES (?, ?, ?)",
      [farmer_name.trim(), amount, crop.trim()]
    );

    // Fetch the created investment
    const [rows] = await pool.query(
      "SELECT id, farmer_name, amount, crop, created_at FROM investments WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating investment:", error);
    res.status(500).json({
      error: "Failed to create investment",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../mobile/test-app.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    pool.end();
  });
});

module.exports = app;
