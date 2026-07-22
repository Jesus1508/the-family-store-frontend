import { Link } from "react-router-dom";
import { ImageOff, ArrowUpRight, Sparkles, Clock, Star } from "lucide-react";
import { cloudinaryResize } from "../utils/cloudinaryImage";

const currency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const ProductCard = ({ product, mostrarResenas = true }) => {
  const image = cloudinaryResize(product.imagenes?.[0]?.url, { width: 500, height: 500 });
  const tieneResenas = mostrarResenas && product.totalResenas > 0;
  const enPromocion = product.precioOriginal > product.precio;
  const descuento = enPromocion
    ? Math.round(((product.precioOriginal - product.precio) / product.precioOriginal) * 100)
    : 0;

  return (
    <Link
      to={`/producto/${product._id}`}
      className="group h-full flex flex-col bg-white rounded-xl overflow-hidden border border-cream-dark hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1 hover:border-gold/60 transition-all duration-300"
    >
      <div className="relative aspect-square bg-cream flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.nombre}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gold/40">
            <Sparkles size={28} />
            <ImageOff size={20} />
          </div>
        )}

        {product.proximamente ? (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-brand-dark text-cream text-xs font-semibold px-2.5 py-1 rounded-full">
            <Clock size={11} /> Próximamente
          </span>
        ) : (
          enPromocion && (
            <span className="absolute top-3 left-3 bg-gold text-brand-dark text-xs font-bold px-2.5 py-1 rounded-full">
              -{descuento}%
            </span>
          )
        )}

        <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-brand opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <div className="flex-1 flex flex-col p-4">
        <h3 className="min-h-[2.5rem] text-sm font-medium text-neutral-800 line-clamp-2 group-hover:text-brand transition-colors">
          {product.nombre}
        </h3>
        {mostrarResenas && (
          <div className="mt-1 h-4 flex items-center gap-1">
            {tieneResenas && (
              <>
                <div className="flex text-gold">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < Math.round(product.promedioCalificacion) ? "fill-gold" : "text-neutral-300"}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-400">({product.totalResenas})</span>
              </>
            )}
          </div>
        )}
        <div className="mt-auto pt-1.5">
          {product.proximamente ? (
            <p className="font-serif font-semibold text-brand-dark/70 text-sm">Muy pronto</p>
          ) : (
            <p className="flex items-baseline gap-2">
              <span className="font-serif font-semibold text-brand text-lg">{currency(product.precio)}</span>
              {enPromocion && (
                <span className="text-sm text-neutral-400 line-through">{currency(product.precioOriginal)}</span>
              )}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
