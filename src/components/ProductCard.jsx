import { Link } from "react-router-dom";
import { ImageOff, ArrowUpRight, Sparkles } from "lucide-react";

const currency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const ProductCard = ({ product }) => {
  const image = product.imagenes?.[0]?.url;

  return (
    <Link
      to={`/producto/${product._id}`}
      className="group block bg-white rounded-xl overflow-hidden border border-cream-dark hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1 hover:border-gold/60 transition-all duration-300"
    >
      <div className="relative aspect-square bg-cream flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gold/40">
            <Sparkles size={28} />
            <ImageOff size={20} />
          </div>
        )}
        <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-brand opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-neutral-800 line-clamp-2 group-hover:text-brand transition-colors">
          {product.nombre}
        </h3>
        <p className="mt-1.5 font-serif font-semibold text-brand text-lg">{currency(product.precio)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
