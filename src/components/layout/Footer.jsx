import { Link } from "react-router-dom";
import { ShoppingBag, MessageCircle, Phone, Mail } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import { useSettings } from "../../hooks/useSettings";

const Footer = () => {
  const { categories } = useCategories();
  const { settings } = useSettings();

  const whatsappHref = settings?.whatsapp
    ? `https://wa.me/52${settings.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <footer className="bg-brand-dark text-cream/70 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
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
                  {cat.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-cream font-medium mb-3">Contacto</p>
          <ul className="space-y-2 text-cream/60">
            {whatsappHref && (
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </li>
            )}
            {settings?.telefono && (
              <li>
                <a href={`tel:${settings.telefono}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                  <Phone size={14} /> {settings.telefono}
                </a>
              </li>
            )}
            {settings?.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                  <Mail size={14} /> {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="text-cream font-medium mb-3">La tienda</p>
          <ul className="space-y-2 text-cream/60">
            <li>
              <Link to="/quienes-somos" className="hover:text-gold transition-colors">
                ¿Quiénes somos?
              </Link>
            </li>
            <li>
              <Link to="/politica-de-compra" className="hover:text-gold transition-colors">
                Política de compra
              </Link>
            </li>
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
};

export default Footer;
