import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ImageOff, Sparkles, ArrowLeft, Clock } from "lucide-react";
import { getProduct } from "../../services/APIservice";
import { useCategories } from "../../hooks/useCategories";

const currency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { categories } = useCategories();

  useEffect(() => {
    setLoading(true);
    setError(false);
    getProduct(id)
      .then((res) => {
        setProduct(res.data);
        setActiveImage(0);
        setTallaSeleccionada(null);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-7xl mx-auto px-4 py-10 text-neutral-500 text-sm">Cargando…</p>;
  if (error || !product)
    return <p className="max-w-7xl mx-auto px-4 py-10 text-neutral-500 text-sm">Producto no encontrado.</p>;

  const category = categories.find((c) => c.slug === product.categoria);
  const image = product.imagenes?.[activeImage]?.url;
  const enPromocion = product.precioOriginal > product.precio;
  const tieneTallas = product.tallas && product.tallas.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-4 py-10"
    >
      <Link
        to={category ? `/categoria/${category.slug}` : "/"}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-brand mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> {category ? category.nombre : "Volver"}
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="relative aspect-square bg-cream rounded-xl flex items-center justify-center overflow-hidden border border-cream-dark">
            {image ? (
              <img src={image} alt={product.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gold/40">
                <Sparkles size={36} />
                <ImageOff size={24} />
              </div>
            )}
            {product.proximamente && (
              <span className="absolute top-4 left-4 flex items-center gap-1 bg-brand-dark text-cream text-xs font-semibold px-3 py-1 rounded-full">
                <Clock size={12} /> Próximamente
              </span>
            )}
          </div>
          {product.imagenes?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.imagenes.map((img, i) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                    i === activeImage ? "border-gold" : "border-transparent hover:border-cream-dark"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {category && (
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-gold bg-brand/5 px-3 py-1 rounded-full">
              {category.nombre}
            </span>
          )}
          <h1 className="text-3xl font-serif font-semibold text-neutral-900 mt-4">{product.nombre}</h1>

          {product.proximamente ? (
            <p className="text-lg font-serif font-semibold text-brand-dark/70 mt-3">Disponible muy pronto</p>
          ) : (
            <p className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl font-serif font-semibold text-brand">{currency(product.precio)}</span>
              {enPromocion && (
                <span className="text-lg text-neutral-400 line-through">{currency(product.precioOriginal)}</span>
              )}
            </p>
          )}

          <p className="text-neutral-600 mt-5 whitespace-pre-line leading-relaxed">{product.descripcion}</p>

          {tieneTallas && (
            <div className="mt-6">
              <p className="text-sm font-medium text-neutral-700 mb-2">Talla</p>
              <div className="flex flex-wrap gap-2">
                {product.tallas.map((t) => {
                  const agotada = t.stock <= 0;
                  const seleccionada = tallaSeleccionada === t.talla;
                  return (
                    <button
                      key={t.talla}
                      disabled={agotada}
                      onClick={() => setTallaSeleccionada(t.talla)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        agotada
                          ? "border-cream-dark text-neutral-300 line-through cursor-not-allowed"
                          : seleccionada
                          ? "border-brand bg-brand text-white"
                          : "border-cream-dark text-neutral-700 hover:border-brand"
                      }`}
                    >
                      {t.talla}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-sm text-neutral-400 mt-6 border-t border-cream-dark pt-4">
            {product.proximamente
              ? "Aún no disponible para compra."
              : product.stock > 0
              ? `${product.stock} disponibles`
              : "Sin stock por el momento"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
