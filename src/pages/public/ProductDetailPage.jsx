import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ImageOff } from "lucide-react";
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
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt={product.nombre} className="w-full h-full object-cover" />
          ) : (
            <ImageOff className="text-neutral-300" size={48} />
          )}
        </div>
        {product.imagenes?.length > 1 && (
          <div className="flex gap-2 mt-3">
            {product.imagenes.map((img, i) => (
              <button
                key={img.publicId}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                  i === activeImage ? "border-rose-500" : "border-transparent"
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
          <Link
            to={`/categoria/${category.slug}`}
            className="text-xs font-semibold uppercase tracking-wide text-rose-600"
          >
            {category.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold text-neutral-900 mt-2">{product.nombre}</h1>
        <p className="text-2xl font-semibold text-rose-600 mt-3">{currency(product.precio)}</p>
        <p className="text-neutral-600 mt-4 whitespace-pre-line">{product.descripcion}</p>
        <p className="text-sm text-neutral-400 mt-6">
          {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock por el momento"}
        </p>
      </div>
    </div>
  );
};

export default ProductDetailPage;
