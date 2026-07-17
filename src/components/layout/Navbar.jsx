import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCategories } from "../../hooks/useCategories";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { categories } = useCategories();

  return (
    <header className="bg-brand/95 backdrop-blur-sm text-cream border-b border-gold/20 sticky top-0 z-40 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold font-serif tracking-wide">
          <ShoppingBag className="text-gold" size={22} />
          The Family Store
        </Link>

        <nav className="hidden md:flex gap-1 text-sm font-medium">
          {categories.map((cat) => (
            <NavLink
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
              className={({ isActive }) =>
                `px-3 py-2 rounded-full transition-colors ${
                  isActive ? "text-gold bg-white/5" : "text-cream/85 hover:text-gold hover:bg-white/5"
                }`
              }
            >
              {cat.nombre}
            </NavLink>
          ))}
        </nav>

        <button className="md:hidden text-cream" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="md:hidden flex flex-col gap-1 px-4 pb-4 text-sm font-medium text-cream/90 overflow-hidden"
        >
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
              onClick={() => setOpen(false)}
              className="py-2 border-b border-gold/20 hover:text-gold"
            >
              {cat.nombre}
            </Link>
          ))}
        </motion.nav>
      )}
    </header>
  );
};

export default Navbar;
