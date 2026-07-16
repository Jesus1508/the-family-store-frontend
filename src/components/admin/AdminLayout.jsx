import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Package, Store } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-56 bg-brand-dark text-cream/80 flex flex-col">
        <div className="p-5 text-gold font-serif font-bold text-lg border-b border-gold/20">
          The Family Store
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link
            to="/admin/productos"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-black/20 hover:text-gold text-sm"
          >
            <Package size={16} /> Productos
          </Link>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-black/20 hover:text-gold text-sm"
          >
            <Store size={16} /> Ver tienda
          </Link>
        </nav>
        <div className="p-3 border-t border-gold/20">
          <p className="text-xs text-cream/50 px-3 mb-2">{admin?.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-black/20 hover:text-gold text-sm w-full"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
