# JUTEIT API Reference

> **Base URL:** `http://localhost:5000/api`  
> **Auth Header:** `Authorization: Bearer <token>`  
> **Content-Type:** `application/json`

---

## 🔐 Authentication — `/api/auth`

### POST `/api/auth/register`
Register a new user. **First user registered becomes the admin (owner).**

**Body:**
```json
{
  "name": "Shaan Khan",
  "email": "admin@juteit.com",
  "password": "password123"
}
```
**Response `201`:**
```json
{
  "_id": "665abc...",
  "name": "Shaan Khan",
  "email": "admin@juteit.com",
  "role": "owner",
  "token": "eyJhbGciOi..."
}
```
> ℹ️ `role` will be `"owner"` for first user, `"buyer"` for all subsequent users.

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

## 📦 Products — `/api/products`

### GET `/api/products`
Get all products. **Public.**

**Response `200`:**
```json
[
  {
    "_id": "665def...",
    "name": "Jute Tote Bag",
    "description": "Handcrafted natural jute bag",
    "category": "Bags",
    "originalPrice": 499,
    "discountedPrice": 349,
    "sizes": ["Small", "Medium", "Large"],
    "colors": ["Natural Brown", "Olive Green"],
    "stock": 50,
    "images": ["https://..."],
    "isHeadline": false,
    "inStock": true,
    "deliveryEstimate": "3-5 business days",
    "returnable": true
  }
]
```

---

### GET `/api/products/:id`
Get a single product. **Public.**

**Response `200`:** _(single product object as above)_

---

### POST `/api/products`
Create a product. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Jute Wall Hanging",
  "description": "Decorative natural jute wall art",
  "category": "Home Decor",
  "originalPrice": 799,
  "discountedPrice": 599,
  "sizes": ["Standard"],
  "colors": ["Natural"],
  "stock": 20,
  "images": ["https://example.com/image.jpg"],
  "deliveryEstimate": "5-7 business days",
  "returnable": false,
  "isHeadline": false
}
```
**Response `201`:** _(created product object)_

---

### PUT `/api/products/:id`
Update a product. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Body:** _(any product fields you want to update)_
```json
{
  "discountedPrice": 499,
  "stock": 35,
  "isHeadline": true
}
```
**Response `200`:** _(updated product object)_

---

### DELETE `/api/products/:id`
Delete a product. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{ "message": "Product removed" }
```

---

## 🛒 Orders — `/api/orders`

### POST `/api/orders`
Create a new order. **🔒 Requires login.**

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "orderItems": [
    {
      "product": "665def...",
      "quantity": 2,
      "selectedSize": "Medium",
      "selectedColor": "Natural Brown",
      "priceAtPurchase": 349
    }
  ],
  "shippingAddress": {
    "street": "123 MG Road",
    "city": "Bengaluru",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India"
  },
  "totalProductsPrice": 698,
  "tax": 69.8,
  "shippingCharge": 49,
  "totalAmount": 816.8
}
```
**Response `201`:** _(created order object)_

> ℹ️ Admin receives an email notification on new orders.

---

### GET `/api/orders/myorders`
Get the logged-in user's orders. **🔒 Requires login.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`:** _(array of order objects)_

---

### PUT `/api/orders/:id/cancel`
Cancel an order within the 20-hour window. **🔒 Requires login.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{ "message": "Order cancelled successfully" }
```

---

### GET `/api/orders`
Get ALL orders. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`:** _(array of all orders with buyer name/email populated)_

---

### PUT `/api/orders/:id/status`
Update order status. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "status": "shipped"
}
```
> Valid status values: `"pending"` → `"paid"` → `"shipped"` → `"delivered"` → `"cancelled"`

**Response `200`:** _(updated order object)_

---

## 🎨 Banners — `/api/banners`

### GET `/api/banners`
Get active banners (shown on homepage). **Public.**

**Response `200`:** _(array of active banner objects)_

---

### GET `/api/banners/all`
Get ALL banners. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`:** _(array of all banners)_

---

### POST `/api/banners`
Create a banner. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "title": "🌿 Summer Eco Sale",
  "description": "Get 25% off on all jute bags this summer!",
  "discountPercent": 25,
  "imageUrl": "https://example.com/banner.jpg",
  "active": true
}
```
**Response `201`:** _(created banner object)_

---

### PUT `/api/banners/:id`
Update a banner. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Body:** _(any banner fields)_
```json
{
  "active": false,
  "discountPercent": 30
}
```
**Response `200`:** _(updated banner object)_

---

### DELETE `/api/banners/:id`
Delete a banner. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{ "message": "Banner removed" }
```

---

## ⚙️ Settings — `/api/settings`

### GET `/api/settings`
Get store settings. **Public.**

**Response `200`:**
```json
{
  "ownerEmail": "admin@juteit.com",
  "bankDetails": {
    "accountName": "Shaan Khan",
    "accountNumber": "123456789",
    "ifscCode": "SBIN0001234",
    "upiId": "juteit@okaxis"
  },
  "taxRate": 10,
  "shippingCharge": 49,
  "freeShippingThreshold": 500
}
```

---

### PUT `/api/settings`
Update store settings. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "ownerEmail": "orders@juteit.com",
  "taxRate": 12,
  "shippingCharge": 59,
  "freeShippingThreshold": 700,
  "bankDetails": {
    "accountName": "JuteIt Store",
    "accountNumber": "987654321",
    "ifscCode": "HDFC0000123",
    "upiId": "juteit@ybl"
  }
}
```
**Response `200`:** _(updated settings object)_

---

## 💬 Inquiries — `/api/inquiries`

### POST `/api/inquiries`
Submit a product inquiry. **Public** — no login needed.

**Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "product": "665def...",
  "productName": "Jute Tote Bag",
  "message": "Is this available in custom sizes? Do you do bulk orders?"
}
```
> ℹ️ `product` and `productName` are optional.

**Response `201`:**
```json
{
  "_id": "665ghi...",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "productName": "Jute Tote Bag",
  "message": "Is this available in custom sizes?...",
  "status": "new",
  "createdAt": "2026-03-04T15:00:00.000Z"
}
```

---

### GET `/api/inquiries`
Get all inquiries. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`:** _(array of inquiries, product name/images populated)_

---

### PUT `/api/inquiries/:id`
Update inquiry status. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "status": "responded"
}
```
> Valid values: `"new"` → `"read"` → `"responded"`

**Response `200`:** _(updated inquiry object)_

---

### DELETE `/api/inquiries/:id`
Delete an inquiry. **🔒 Admin only.**

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{ "message": "Inquiry deleted" }
```

---

## 🗄️ Data Storage (MongoDB)

| Collection | Key Fields |
|---|---|
| `users` | `name`, `email`, `password` (bcrypt hashed), `role` (`owner`/`buyer`) |
| `products` | `name`, `category`, `originalPrice`, `discountedPrice`, `stock`, `images[]`, `isHeadline` |
| `orders` | `buyer` (ref User), `items[]`, `shippingAddress`, `totalAmount`, `status`, `paymentId` |
| `banners` | `title`, `description`, `discountPercent`, `imageUrl`, `active` |
| `settings` | `ownerEmail`, `bankDetails`, `taxRate`, `shippingCharge`, `freeShippingThreshold` |
| `inquiries` | `name`, `email`, `product` (ref), `productName`, `message`, `status` |

---

## 🧪 Postman Quick-Start Flow

```
1. POST /api/auth/register      → Register as admin (first user)
2. Copy token from response
3. POST /api/products           → Create a product with admin token
4. POST /api/auth/register      → Register a second user (buyer)
5. POST /api/auth/login         → Login as buyer, copy buyer token
6. POST /api/orders             → Place an order with buyer token
7. POST /api/inquiries          → Submit inquiry (no auth needed)
8. GET  /api/orders             → View ALL orders with admin token
9. PUT  /api/orders/:id/status  → Update order status with admin token
10. GET /api/inquiries          → View all inquiries with admin token
```
