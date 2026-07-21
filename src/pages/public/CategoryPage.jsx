import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import { useCategories } from "../../hooks/useCategories";
import { useSettings } from "../../hooks/useSettings";
import { getProducts } from "../../services/APIservice";

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categories } = useCategories();
  const { settings } = useSettings();
  const mostrarResenas = settings?.mostrarResenasEnTarjetas ?? true;

  const category = categories.find((c) => c.slug === slug);

  useEffect(() => {
    setLoading(true);
    getProducts({ categoria: slug })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-serif font-semibold text-brand mb-8 text-center"
      >
        {category ? category.nombre : "Categoría"}
      </motion.h1>

      {loading ? (
        <p className="text-neutral-500 text-sm text-center">Cargando productos…</p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-neutral-400 py-16">
          <PackageSearch size={40} className="text-gold/50" />
          <p className="text-sm">No hay productos en esta categoría todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
            >
              <ProductCard product={p} mostrarResenas={mostrarResenas} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
