import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OwnerBanners from "./pages/owner/OwnerBanners";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerOrders from "./pages/owner/OwnerOrders";
import OwnerProducts from "./pages/owner/OwnerProducts";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// Define routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});

const ownerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner",
  component: OwnerDashboard,
});

const ownerProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner/products",
  component: OwnerProducts,
});

const ownerBannersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner/banners",
  component: OwnerBanners,
});

const ownerOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner/orders",
  component: OwnerOrders,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  ordersRoute,
  ownerRoute,
  ownerProductsRoute,
  ownerBannersRoute,
  ownerOrdersRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}
