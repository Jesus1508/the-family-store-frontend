import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/public/HomePage";
import CategoryPage from "./pages/public/CategoryPage";
import ProductDetailPage from "./pages/public/ProductDetailPage";
import AboutPage from "./pages/public/AboutPage";
import PolicyPage from "./pages/public/PolicyPage";
import CartPage from "./pages/public/CartPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const ProductsListPage = lazy(() => import("./pages/admin/ProductsListPage"));
const ProductFormPage = lazy(() => import("./pages/admin/ProductFormPage"));
const CategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const OrdersPage = lazy(() => import("./pages/admin/OrdersPage"));

const StorefrontLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream text-neutral-500 text-sm">
    Cargando…
  </div>
);

function App() {
  return (
    <Suspense fallback={<AdminFallback />}>
      <Routes>
        <Route path="/" element={<StorefrontLayout><HomePage /></StorefrontLayout>} />
        <Route path="/categoria/:slug" element={<StorefrontLayout><CategoryPage /></StorefrontLayout>} />
        <Route path="/producto/:id" element={<StorefrontLayout><ProductDetailPage /></StorefrontLayout>} />
        <Route path="/quienes-somos" element={<StorefrontLayout><AboutPage /></StorefrontLayout>} />
        <Route path="/politica-de-compra" element={<StorefrontLayout><PolicyPage /></StorefrontLayout>} />
        <Route path="/carrito" element={<StorefrontLayout><CartPage /></StorefrontLayout>} />

        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="productos" element={<ProductsListPage />} />
          <Route path="productos/nuevo" element={<ProductFormPage />} />
          <Route path="productos/:id/editar" element={<ProductFormPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="configuracion" element={<SettingsPage />} />
          <Route path="pedidos" element={<OrdersPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
