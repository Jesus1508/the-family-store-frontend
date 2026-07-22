import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ImageOff, Sparkles, ArrowLeft, Clock, ShoppingCart, Minus, Plus } from "lucide-react";
import { getProduct } from "../../services/APIservice";
import { useCategories } from "../../hooks/useCategories";
import { useCart } from "../../context/CartContext";
import ReviewsSection from "../../components/ReviewsSection";
import { cloudinaryResize } from "../../utils/cloudinaryImage";

const currency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { categories } = useCategories();
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    setError(false);
    getProduct(id)
      .then((res) => {
        setProduct(res.data);
        setActiveImage(0);
        setTallaSeleccionada(null);
        setCantidad(1);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-7xl mx-auto px-4 py-10 text-neutral-500 text-sm">Cargando…</p>;
  if (error || !product)
    return <p className="max-w-7xl mx-auto px-4 py-10 text-neutral-500 text-sm">Producto no encontrado.</p>;

  const category = categories.find((c) => c.slug === product.categoria);
  const image = cloudinaryResize(product.imagenes?.[activeImage]?.url, { width: 900, height: 900 });
  const enPromocion = product.precioOriginal > product.precio;
  const tieneTallas = product.tallas && product.tallas.length > 0;

  const tallaActual = tieneTallas ? product.tallas.find((t) => t.talla === tallaSeleccionada) : null;
  const disponible = tieneTallas ? tallaActual?.disponible ?? 0 : product.disponible ?? 0;
  const puedeComprar = !product.proximamente && (!tieneTallas || tallaSeleccionada) && disponible > 0;

  const handleAddToCart = () => {
    addItem({
      productoId: product._id,
      nombre: product.nombre,
      precio: product.precio,
      talla: tallaSeleccionada || undefined,
      cantidad,
      imagen: product.imagenes?.[0]?.url,
    });
    toast.success("Agregado al carrito");
    navigate("/carrito");
  };

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
              <img src={image} alt={product.nombre} className="w-full h-full object-contain" />
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
                  <img
                    src={cloudinaryResize(img.url, { width: 150, height: 150 })}
                    alt=""
                    className="w-full h-full object-cover"
                  />
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
          {product.totalResenas > 0 && (
            <p className="text-sm text-neutral-500 mt-1">
              ★ {product.promedioCalificacion.toFixed(1)} · {product.totalResenas}{" "}
              {product.totalResenas === 1 ? "reseña" : "reseñas"}
            </p>
          )}

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
                  const agotada = (t.disponible ?? 0) <= 0;
                  const seleccionada = tallaSeleccionada === t.talla;
                  return (
                    <button
                      key={t.talla}
                      disabled={agotada}
                      onClick={() => {
                        setTallaSeleccionada(t.talla);
                        setCantidad(1);
                      }}
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

          {!product.proximamente && (!tieneTallas || tallaSeleccionada) && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border border-cream-dark rounded-lg">
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="p-2 text-neutral-500 hover:text-brand"
                  aria-label="Restar"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{cantidad}</span>
                <button
                  onClick={() => setCantidad((c) => Math.min(disponible, c + 1))}
                  className="p-2 text-neutral-500 hover:text-brand"
                  aria-label="Sumar"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!puedeComprar}
                className="flex-1 flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
              >
                <ShoppingCart size={16} /> Agregar al carrito
              </button>
            </div>
          )}

          <p className="text-sm text-neutral-400 mt-6 border-t border-cream-dark pt-4">
            {product.proximamente
              ? "Aún no disponible para compra."
              : tieneTallas && !tallaSeleccionada
              ? "Selecciona una talla para ver disponibilidad."
              : disponible > 0
              ? `${disponible} disponibles`
              : "Sin stock por el momento"}
          </p>
        </div>
      </div>

      <div className="mt-16">
        <ReviewsSection
          productoId={product._id}
          promedio={product.promedioCalificacion || 0}
          total={product.totalResenas || 0}
        />
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
