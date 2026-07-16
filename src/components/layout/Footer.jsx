import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import categories from "../../data/categories";

const Footer = () => (
  <footer className="bg-brand-dark text-cream/70 text-sm mt-20">
    <div className="max-w-7xl mx-auto px-4 py-12 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div>
        <p className="flex items-center gap-2 text-gold font-serif font-semibold text-lg mb-2">
          <ShoppingBag size={18} /> The Family Store
        </p>
        <p className="text-cream/60 max-w-xs">
          Moda, calzado, bolsos, belleza y cuidado personal para toda la familia.
        </p>
      </div>

      <div>
        <p className="text-cream font-medium mb-3">Categorías</p>
        <ul className="space-y-2 text-cream/60">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link to={`/categoria/${cat.slug}`} className="hover:text-gold transition-colors">
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-cream font-medium mb-3">Acceso</p>
        <ul className="space-y-2 text-cream/60">
          <li>
            <Link to="/admin/login" className="hover:text-gold transition-colors">
              Panel administrativo
            </Link>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-gold/10 py-4 text-center text-cream/40 text-xs">
      &copy; {new Date().getFullYear()} The Family Store
    </div>
  </footer>
);

export default Footer;
