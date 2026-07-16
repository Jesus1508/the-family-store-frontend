import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ImageOff, Sparkles, ArrowLeft } from "lucide-react";
import { getProduct } from "../../services/APIservice";
import categories from "../../data/categories";

const currency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getProduct(id)
      .then((res) => {
        setProduct(res.data);
        setActiveImage(0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-7xl mx-auto px-4 py-10 text-neutral-500 text-sm">Cargando…</p>;
  if (error || !product)
    return <p className="max-w-7xl mx-auto px-4 py-10 text-neutral-500 text-sm">Producto no encontrado.</p>;

  const category = categories.find((c) => c.slug === product.categoria);
  const image = product.imagenes?.[activeImage]?.url;

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
        <ArrowLeft size={14} /> {category ? category.label : "Volver"}
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-cream rounded-xl flex items-center justify-center overflow-hidden border border-cream-dark">
            {image ? (
              <img src={image} alt={product.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gold/40">
                <Sparkles size={36} />
                <ImageOff size={24} />
              </div>
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
              {category.label}
            </span>
          )}
          <h1 className="text-3xl font-serif font-semibold text-neutral-900 mt-4">{product.nombre}</h1>
          <p className="text-3xl font-serif font-semibold text-brand mt-3">{currency(product.precio)}</p>
          <p className="text-neutral-600 mt-5 whitespace-pre-line leading-relaxed">{product.descripcion}</p>
          <p className="text-sm text-neutral-400 mt-6 border-t border-cream-dark pt-4">
            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock por el momento"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
