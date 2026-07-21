import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Package, Store, Tags, Settings, Receipt, Star, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrderNotifications } from "../../hooks/useOrderNotifications";

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { unseenCount, markAllSeen } = useOrderNotifications();

  useEffect(() => {
    if (location.pathname.startsWith("/admin/pedidos")) {
      markAllSeen();
    }
  }, [location.pathname, markAllSeen]);

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
            to="/admin/pedidos"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-black/20 hover:text-gold text-sm"
          >
            <Receipt size={16} /> Ventas
            {unseenCount > 0 && (
              <span className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {unseenCount}
              </span>
            )}
          </Link>
          <Link
            to="/admin/resenas"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-black/20 hover:text-gold text-sm"
          >
            <Star size={16} /> Reseñas
          </Link>
          <Link
            to="/admin/categorias"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-black/20 hover:text-gold text-sm"
          >
            <Tags size={16} /> Categorías
          </Link>
          <Link
            to="/admin/configuracion"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-black/20 hover:text-gold text-sm"
          >
            <Settings size={16} /> Configuración
          </Link>
          <Link
            to="/admin/usuarios"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-black/20 hover:text-gold text-sm"
          >
            <Users size={16} /> Usuarios
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
