# JUTEIT API Reference

**Developer:** Shaan Khan  
**Version:** 1.0.0  

> **Base URL:** `http://localhost:5000/api`  
> **Auth Header:** `Authorization: Bearer <token>`  
> **Content-Type:** `application/json`

---

## 📑 Index

1. [🔐 Authentication](#-authentication--apiauth)
2. [👑 Admin API Reference](#-admin-api-reference)
   - [🔑 Owner Management](#-owner-management--apiauth)
   - [📦 Product Management](#-product-management--apiproducts)
   - [🛒 Order Management](#-order-management--apiorders)
   - [🎨 Banner Management](#-banner-management--apibanners)
   - [⚙️ Store Settings](#-store-settings--apisettings)
   - [💬 Inquiry Management](#-inquiry-management--apiinquiries)
3. [🛍️ Buyer API Reference](#-buyer-api-reference)
   - [🛍️ Shopping](#-shopping--apiproducts)
   - [📝 Ordering](#-ordering--apiorders)
   - [🎨 Banners](#-banners--apibanners)
   - [💬 Inquiries](#-inquiries--apiinquiries)
4. [🗄️ Data Storage (MongoDB)](#-data-storage-mongodb)
5. [🧪 Postman Quick-Start Flow](#-postman-quick-start-flow)

---

## 🔐 Authentication — `/api/auth`

### POST `/api/auth/register`
Register a new user. **All users default to the "buyer" role.** 

**Body:**
```json
{
  "name": "Shaan Khan",
  "email": "buyer@example.com",
  "password": "password123"
}
```
**Response `201`:**
```json
{
  "_id": "665abc...",
  "name": "Shaan Khan",
  "email": "buyer@example.com",
  "role": "buyer",
  "token": "eyJhbGciOi..."
}
```

---

### POST `/api/auth/login`
Login with email and password.

**Body:**
```json
{
  "email": "admin@juteit.com",
  "password": "password123"
}
```
**Response `200`:**
```json
{
  "_id": "665abc...",
  "name": "Shaan Khan",
  "email": "admin@juteit.com",
  "role": "owner",
  "token": "eyJhbGciOi..."
}
```

---

## 👑 Admin API Reference

### 🔑 Owner Management — `/api/auth`

> **Security Note:** These endpoints require the `x-master-key` header defined in `.env`.

#### POST `/api/auth/setup-owner`
Assign the `owner` role.
**Headers:** `x-master-key: <MASTER_KEY>`
**Body:** `{"name": "Shaan", "email": "admin@juteit.com", "password": "..."}`

#### POST `/api/auth/delete-owner`
Delete any user.
**Headers:** `x-master-key: <MASTER_KEY>`
**Body:** `{"email": "user@example.com"}`

---

### 📦 Product Management — `/api/products`

#### POST `/api/products`
Create a product. **🔒 Admin only.**
**Headers:** `Authorization: Bearer <admin_token>`

#### PUT `/api/products/:id`
Update a product. **🔒 Admin only.**
**Headers:** `Authorization: Bearer <admin_token>`

#### DELETE `/api/products/:id`
Delete a product. **🔒 Admin only.**
**Headers:** `Authorization: Bearer <admin_token>`

---

### 🛒 Order Management — `/api/orders`

#### GET `/api/orders`
Get ALL orders. **🔒 Admin only.**
**Headers:** `Authorization: Bearer <admin_token>`

#### PUT `/api/orders/:id/status`
Update order status (`pending`, `shipped`, etc). **🔒 Admin only.**
**Headers:** `Authorization: Bearer <admin_token>`

---

### 🎨 Banner Management — `/api/banners`

#### GET `/api/banners/all`
Get ALL banners. **🔒 Admin only.**

#### POST `/api/banners`
Create a banner. **🔒 Admin only.**

#### PUT `/api/banners/:id`
Update a banner. **🔒 Admin only.**

#### DELETE `/api/banners/:id`
Delete a banner. **🔒 Admin only.**

---

### ⚙️ Store Settings — `/api/settings`

#### PUT `/api/settings`
Update store settings (Email, Bank, Taxes, etc). **🔒 Admin only.**
**Headers:** `Authorization: Bearer <admin_token>`

---

### 💬 Inquiry Management — `/api/inquiries`

#### GET `/api/inquiries`
Get all customer inquiries. **🔒 Admin only.**

#### PUT `/api/inquiries/:id`
Update inquiry status. **🔒 Admin only.**

#### DELETE `/api/inquiries/:id`
Delete an inquiry. **🔒 Admin only.**

---

## 🛍️ Buyer API Reference

### 🛍️ Shopping — `/api/products`

#### GET `/api/products`
Get all products. Supports `keyword`, `category`, `sort`. **Public.**

#### GET `/api/products/:id`
Get a single product details. **Public.**

---

### 📝 Ordering — `/api/orders`

#### POST `/api/orders`
Create a new order. **🔒 Requires login.**
**Headers:** `Authorization: Bearer <buyer_token>`

#### GET `/api/orders/myorders`
Get the logged-in user's orders. **🔒 Requires login.**

#### PUT `/api/orders/:id/cancel`
Cancel an order (20-hour window). **🔒 Requires login.**

---

### 🎨 Banners — `/api/banners`

#### GET `/api/banners`
Get active homepage banners. **Public.**

---

### 💬 Inquiries — `/api/inquiries`

#### POST `/api/inquiries`
Submit a product inquiry. **Public.**

---

## 🗄️ Data Storage (MongoDB)

| Collection | Key Fields |
|---|---|
| `users` | `name`, `email`, `password`, `role` |
| `products` | `name`, `category`, `prices`, `stock`, `images` |
| `orders` | `buyer`, `items`, `address`, `status` |
| `banners` | `title`, `discount`, `imageUrl`, `active` |
| `settings` | `ownerEmail`, `bankDetails`, `taxRate` |
| `inquiries` | `name`, `email`, `message`, `status` |

---

## 🧪 Postman Quick-Start Flow

1. **Setup Admin**: `POST /api/auth/setup-owner` with `x-master-key`.
2. **Login**: `POST /api/auth/login` as Admin → Copy `token`.
3. **Manage**: Use Admin Token for `/api/products` (POST/PUT/DELETE).
4. **Buyer Flow**: `POST /api/auth/register` → `POST /api/auth/login` → Copy `token`.
5. **Purchase**: Use Buyer Token to `POST /api/orders`.
6. **Track**: `GET /api/orders/myorders` (Buyer) or `GET /api/orders` (Admin).
