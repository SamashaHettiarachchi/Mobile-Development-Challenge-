const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function setupDatabase() {
  let connection;

  try {
    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: process.env.DB_PORT || 3306,
      multipleStatements: true,
    });

    console.log("Connected to MySQL server");

    // Read and execute schema
    const schemaPath = path.join(__dirname, "..", "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    await connection.query(schema);
    console.log("✓ Database schema created successfully");

    // Read and execute seed data
    const seedPath = path.join(__dirname, "..", "seed.sql");
    const seedData = fs.readFileSync(seedPath, "utf8");

    await connection.query(seedData);
    console.log("✓ Seed data inserted successfully");

    console.log("\nDatabase setup complete!");
    console.log(`Database: ${process.env.DB_NAME || "farminvest_db"}`);
  } catch (error) {
    console.error("Error setting up database:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
