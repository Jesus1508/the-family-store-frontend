import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import categories from "../../data/categories";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-neutral-900">
          <ShoppingBag className="text-rose-600" size={22} />
          The Family Store
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-neutral-600">
          {categories.map((cat) => (
            <Link key={cat.slug} to={`/categoria/${cat.slug}`} className="hover:text-rose-600 transition-colors">
              {cat.label}
            </Link>
          ))}
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-4 pb-4 text-sm font-medium text-neutral-600">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
              onClick={() => setOpen(false)}
              className="py-2 border-b border-neutral-100 hover:text-rose-600"
            >
              {cat.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
