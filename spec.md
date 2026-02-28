# JuteIt

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- **Authentication**: Two roles — Owner and Buyer. Login/signup page with role selection.
- **Owner Dashboard**: 
  - Upload products (name, description, category, images, price, discounted price, sizes, colors, availability, delivery estimate, returnable)
  - Post headline/offer banners with discount info
  - View all orders
- **Buyer-facing storefront**:
  - 3D interactive homepage with product showcase
  - Product listing page with offer banners
  - Product detail page: images, size selector, color selector, price (original crossed out + discounted), category, availability, delivery estimate, returnable info, add to cart
  - Shopping cart with item list, quantities, totals
  - Checkout / Payment page: Net Banking option only (no Cash on Delivery)
- **Data models**: Product, Order, Cart, OfferBanner

### Modify
- None (new project)

### Remove
- None

## Implementation Plan
1. Backend: Define Product, Order, Cart, OfferBanner data types and CRUD APIs. Role-based access (owner vs buyer). Authorization component for login.
2. Frontend:
   - Login/Signup page with role selection
   - 3D interactive homepage (Three.js / React Three Fiber) with floating product cards
   - Storefront product grid with offer banners
   - Product detail page with all fields, size/color selector
   - Shopping cart page
   - Payment/checkout page (Net Banking)
   - Owner dashboard (product upload form, headline/offer creation, order management)
