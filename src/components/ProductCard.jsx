import { Link } from "react-router-dom";
import { ImageOff } from "lucide-react";

const currency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const ProductCard = ({ product }) => {
  const image = product.imagenes?.[0]?.url;

  return (
    <Link
      to={`/producto/${product._id}`}
      className="group block bg-white rounded-lg overflow-hidden border border-neutral-200 hover:shadow-md transition"
    >
      <div className="aspect-square bg-neutral-100 flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <ImageOff className="text-neutral-300" size={32} />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-neutral-800 line-clamp-2">{product.nombre}</h3>
        <p className="mt-1 font-semibold text-rose-600">{currency(product.precio)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
