const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function seedDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "farminvest_db",
      port: process.env.DB_PORT || 3306,
      multipleStatements: true,
    });

    console.log("Connected to database");

    const seedPath = path.join(__dirname, "..", "seed.sql");
    const seedData = fs.readFileSync(seedPath, "utf8");

    await connection.query(seedData);
    console.log("✓ Seed data inserted successfully");
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();
