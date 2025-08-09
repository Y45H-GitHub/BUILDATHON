-- OptiLogix Database Schema

-- Users and Authentication
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'dispatcher', 'driver', 'supplier') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Docks Management
CREATE TABLE docks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dock_number VARCHAR(10) UNIQUE NOT NULL,
  status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
  dock_type ENUM('loading', 'unloading', 'both') NOT NULL,
  capacity_tons DECIMAL(10,2),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trucks and Vehicles
CREATE TABLE trucks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  truck_number VARCHAR(20) UNIQUE NOT NULL,
  driver_id INT,
  license_plate VARCHAR(15),
  capacity_tons DECIMAL(10,2),
  status ENUM('available', 'in_transit', 'at_dock', 'maintenance') DEFAULT 'available',
  current_location VARCHAR(255),
  FOREIGN KEY (driver_id) REFERENCES users(id)
);

-- Appointments and Scheduling
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  truck_id INT NOT NULL,
  supplier VARCHAR(100) NOT NULL,
  appointment_time DATETIME NOT NULL,
  type ENUM('loading', 'unloading') NOT NULL,
  status ENUM('scheduled', 'arrived', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  dock_id INT,
  priority_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (truck_id) REFERENCES trucks(id),
  FOREIGN KEY (dock_id) REFERENCES docks(id)
);

-- Products and Inventory
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  barcode VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  unit_price DECIMAL(10,2),
  weight_kg DECIMAL(10,3),
  dimensions VARCHAR(50),
  supplier VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Tracking
CREATE TABLE inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  location VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  reserved_quantity INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Route Optimization
CREATE TABLE routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  truck_id INT NOT NULL,
  start_location VARCHAR(255) NOT NULL,
  end_location VARCHAR(255) NOT NULL,
  waypoints JSON,
  distance_km DECIMAL(10,2),
  estimated_time_minutes INT,
  fuel_cost DECIMAL(10,2),
  status ENUM('planned', 'active', 'completed') DEFAULT 'planned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (truck_id) REFERENCES trucks(id)
);

-- Compliance and Risk
CREATE TABLE compliance_checks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  truck_id INT NOT NULL,
  check_type VARCHAR(100) NOT NULL,
  status ENUM('passed', 'failed', 'pending') NOT NULL,
  details JSON,
  checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (truck_id) REFERENCES trucks(id)
);

-- Blockchain Provenance
CREATE TABLE blockchain_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  transaction_hash VARCHAR(66) NOT NULL,
  block_number BIGINT,
  event_type VARCHAR(50) NOT NULL,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Analytics and Forecasting
CREATE TABLE demand_forecasts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  forecast_date DATE NOT NULL,
  predicted_demand INT NOT NULL,
  confidence_score DECIMAL(5,2),
  model_version VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample data
INSERT INTO docks (dock_number, dock_type, capacity_tons) VALUES
('D001', 'both', 50.00),
('D002', 'loading', 30.00),
('D003', 'unloading', 40.00);

INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@optilogix.com', '$2a$10$example', 'admin'),
('dispatcher1', 'dispatch@optilogix.com', '$2a$10$example', 'dispatcher'),
('driver1', 'driver1@optilogix.com', '$2a$10$example', 'driver');