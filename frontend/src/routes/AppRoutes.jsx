import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import FloatingWhatsAppButton from "../components/FloatingWhatsAppButton";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import AdminProductFormPage from "../pages/AdminProductFormPage";
import AdminProductsPage from "../pages/AdminProductsPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import ShopPage from "../pages/ShopPage";
import ProtectedRoute from "./ProtectedRoute";

const PublicLayout = () => (
  <div className="app-shell">
    <SiteHeader />
    <FloatingWhatsAppButton />
    <main className="site-main">
      <Outlet />
    </main>
    <SiteFooter />
  </div>
);

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return null;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/featured" element={<ShopPage variant="featured" />} />
            <Route path="/new-arrivals" element={<ShopPage variant="newArrivals" />} />
            <Route path="/product/:slug" element={<ProductDetailsPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<AdminProductFormPage />} />
              <Route path="products/:id/edit" element={<AdminProductFormPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default AppRoutes;
