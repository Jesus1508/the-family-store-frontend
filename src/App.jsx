import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/public/HomePage";
import CategoryPage from "./pages/public/CategoryPage";
import ProductDetailPage from "./pages/public/ProductDetailPage";
import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./components/admin/AdminLayout";
import ProductsListPage from "./pages/admin/ProductsListPage";
import ProductFormPage from "./pages/admin/ProductFormPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const StorefrontLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<StorefrontLayout><HomePage /></StorefrontLayout>} />
      <Route path="/categoria/:slug" element={<StorefrontLayout><CategoryPage /></StorefrontLayout>} />
      <Route path="/producto/:id" element={<StorefrontLayout><ProductDetailPage /></StorefrontLayout>} />

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
      </Route>
    </Routes>
  );
}

export default App;
