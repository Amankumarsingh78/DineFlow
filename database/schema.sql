-- ==========================================
-- DineFlow Database Schema
-- QR Restaurant Ordering System
-- ==========================================


CREATE DATABASE IF NOT EXISTS dineflow;

USE dineflow;


-- ==========================================
-- Users Table
-- Stores admin users
-- ==========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);



-- ==========================================
-- Categories Table
-- Food categories
-- ==========================================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);



-- ==========================================
-- Foods Table
-- Restaurant menu items
-- ==========================================

CREATE TABLE foods (
    id INT AUTO_INCREMENT PRIMARY KEY,

    category_id INT NOT NULL,

    name VARCHAR(150) NOT NULL,
    description TEXT,

    price DECIMAL(10,2) NOT NULL,

    image VARCHAR(255),

    estimated_prep_time INT NOT NULL,

    is_available BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,


    FOREIGN KEY(category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);



-- ==========================================
-- Restaurant Tables
-- Stores QR table information
-- ==========================================

CREATE TABLE restaurant_tables (

    id INT AUTO_INCREMENT PRIMARY KEY,

    table_number INT UNIQUE NOT NULL,

    qr_code VARCHAR(255) UNIQUE NOT NULL,

    is_occupied BOOLEAN DEFAULT FALSE,

    current_order_id INT NULL,

    current_customer_name VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP

);



-- ==========================================
-- Orders Table
-- Customer orders
-- ==========================================

CREATE TABLE orders (

    id INT AUTO_INCREMENT PRIMARY KEY,

    table_id INT NOT NULL,

    customer_name VARCHAR(100) NOT NULL,

    subtotal DECIMAL(10,2) DEFAULT 0,

    estimated_time INT DEFAULT 0,

    special_instruction TEXT,

    status VARCHAR(50) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,


    FOREIGN KEY(table_id)
    REFERENCES restaurant_tables(id)
);



-- ==========================================
-- Order Items Table
-- Items inside orders
-- ==========================================

CREATE TABLE order_items (

    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    food_id INT NOT NULL,

    quantity INT NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE,


    FOREIGN KEY(food_id)
    REFERENCES foods(id)
);
