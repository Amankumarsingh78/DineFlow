# DineFlow – Database Design Document

# 1. Project Overview

## Project Name

DineFlow – QR Restaurant Ordering System

## Introduction

DineFlow is a production-style QR-based restaurant ordering system where customers can scan a QR code placed on their restaurant table, open a digital menu, select food items, place orders, view their current bill, and track estimated preparation time without creating an account.

The system provides a fast and simple ordering experience for customers while allowing restaurant administrators to manage menu items, categories, tables, orders, and revenue through an admin dashboard.

## Problem Statement

Traditional restaurant ordering systems require customers to wait for a waiter to manually take orders.

Problems:

- Long waiting time
- Order communication mistakes
- Difficulty managing peak hours
- Lack of real-time order visibility

DineFlow solves these problems by providing a QR-based digital ordering system where customers can directly order from their table.

## Project Objectives

- Provide QR-based table ordering
- Remove customer login requirement
- Allow customers to browse digital menu
- Allow customers to place and manage orders
- Maintain one active order per table
- Provide live bill visibility
- Provide estimated preparation time
- Provide restaurant management dashboard

## Target Users

DineFlow has two main users:

## Customer (Guest)

Customer can:

- Scan QR code
- View menu
- Search food items
- Filter categories
- Add items to cart
- Update quantity
- View current bill
- Add special instructions
- Track preparation time

Customer does not require:

- Registration
- Login
- Password

## Admin

Admin can:

- Login securely
- Manage categories
- Manage food items
- Manage tables
- Manage orders
- Complete orders
- Monitor revenue

## Technology Stack

Frontend:

- React
- Vite
- Tailwind CSS
- React Router
- Axios

Backend:

- Node.js
- Express.js

Database:

- MySQL

Authentication:

- JWT
- bcrypt

Upload:

- Multer

---

# 2. User Roles & Permissions

## Customer (Guest)

### Authentication

Customer does not require authentication.

Customer identity is maintained using:

- Table QR code
- Active order
- Customer name

### Customer Permissions

Customer can:

- Scan table QR code
- Access menu
- View categories
- View food details
- Search food
- Add food items
- Update quantity
- Remove items
- Add instructions
- Place order
- View current order
- View current bill
- View estimated preparation time
- Add more items to active order

### Customer Restrictions

Customer cannot:

- Access admin dashboard
- Manage food
- Manage categories
- Manage tables
- View revenue
- Modify completed orders

---

# Admin

## Authentication

Admin requires:

- Email
- Password
- JWT authentication

## Admin Permissions

Admin can:

- Login dashboard
- Manage food categories
- Manage food items
- Upload food images
- Set preparation time
- Manage orders
- Complete orders
- Manage restaurant tables
- View revenue

---

# 3. Business Workflow

## Step 1: QR Scan

Customer scans table QR code.

Example:
