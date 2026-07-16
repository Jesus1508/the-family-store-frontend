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
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-56 bg-neutral-900 text-neutral-300 flex flex-col">
        <div className="p-5 text-white font-bold text-lg border-b border-neutral-800">
          The Family Store
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <Link
            to="/admin/productos"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-800 hover:text-white text-sm"
          >
            <Package size={16} /> Productos
          </Link>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-800 hover:text-white text-sm"
          >
            <Store size={16} /> Ver tienda
          </Link>
        </nav>
        <div className="p-3 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 px-3 mb-2">{admin?.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-800 hover:text-white text-sm w-full"
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
