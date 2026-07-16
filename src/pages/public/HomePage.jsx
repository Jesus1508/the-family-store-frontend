import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import categories from "../../data/categories";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/APIservice";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 8 })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-b from-rose-50 to-neutral-50 py-16 text-center px-4">
        <h1 className="text-4xl font-bold text-neutral-900">The Family Store</h1>
        <p className="mt-3 text-neutral-600 max-w-xl mx-auto">
          Moda, calzado, bolsos, belleza y cuidado personal para toda la familia.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
              className="bg-white border border-neutral-200 rounded-lg p-4 text-center text-sm font-medium text-neutral-700 hover:border-rose-400 hover:text-rose-600 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Productos destacados</h2>
        {loading ? (
          <p className="text-neutral-500 text-sm">Cargando productos…</p>
        ) : products.length === 0 ? (
          <p className="text-neutral-500 text-sm">
            Aún no hay productos cargados. Agrega el primero desde el panel de administración.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
