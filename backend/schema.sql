-- FarmInvest Database Schema
-- Drop database if exists (for clean setup)
DROP DATABASE IF EXISTS farminvest_db;

-- Create database
CREATE DATABASE farminvest_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE farminvest_db;

-- Create investments table
CREATE TABLE investments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farmer_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  crop VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_farmer_name (farmer_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments to table and columns
ALTER TABLE investments COMMENT 'Stores farm investment records';
