import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import BecomeSeller from "./pages/BecomeSeller";
import NotFound from "./pages/NotFound";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCategoryForm from "./pages/admin/AdminCategoryForm";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminSiteSettings from "./pages/admin/AdminSiteSettings";
import AdminOrders from "./pages/admin/AdminOrders";

// Vendor imports
import VendorLayout from "./components/vendor/VendorLayout";
import VendorGuard from "./components/vendor/VendorGuard";
import VendorLogin from "./pages/vendor/VendorLogin";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProducts from "./pages/vendor/VendorProducts";
import VendorProductForm from "./pages/vendor/VendorProductForm";
import VendorOrders from "./pages/vendor/VendorOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/become-seller" element={<BecomeSeller />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="categories/new" element={<AdminCategoryForm />} />
            <Route path="categories/edit/:id" element={<AdminCategoryForm />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="settings" element={<AdminSiteSettings />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* Vendor Routes */}
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route
            path="/vendor"
            element={
              <VendorGuard>
                <VendorLayout />
              </VendorGuard>
            }
          >
            <Route index element={<VendorDashboard />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="products/new" element={<VendorProductForm />} />
            <Route path="orders" element={<VendorOrders />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
