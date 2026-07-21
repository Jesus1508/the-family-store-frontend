import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shirt, Footprints, ShoppingBag, Sparkles, Droplet, Tag, Clock } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import { useSettings } from "../../hooks/useSettings";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/APIservice";

const categoryIcons = {
  "ropa-dama": Shirt,
  "ropa-caballero": Shirt,
  calzado: Footprints,
  bolsos: ShoppingBag,
  "belleza-cosmeticos": Sparkles,
  "cuidado-personal": Droplet,
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const ProductGrid = ({ products, emptyText, mostrarResenas }) =>
  products.length === 0 ? (
    <p className="text-neutral-500 text-sm text-center">{emptyText}</p>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p, i) => (
        <motion.div
          key={p._id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
        >
          <ProductCard product={p} mostrarResenas={mostrarResenas} />
        </motion.div>
      ))}
    </div>
  );

const HomePage = () => {
  const { categories } = useCategories();
  const { settings } = useSettings();
  const mostrarResenas = settings?.mostrarResenasEnTarjetas ?? true;
  const [novedades, setNovedades] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [proximos, setProximos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ limit: 8 }),
      getProducts({ promocion: true, limit: 4 }),
      getProducts({ proximamente: true, limit: 4 }),
    ])
      .then(([n, p, x]) => {
        setNovedades(n.data);
        setPromociones(p.data);
        setProximos(x.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative w-full overflow-hidden bg-brand">
        <img
          src="/img_main.jpg"
          alt="The Family Store — moda, calzado, bolsos, belleza y cuidado personal para toda la familia"
          className="w-full h-auto block"
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute left-1/2 -translate-x-1/2 top-[68%] sm:top-[70%] w-full px-4"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <Link
              to="/categoria/ropa-dama"
              className="bg-gold hover:bg-gold-light text-brand-dark font-semibold text-xs sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg transition-colors"
            >
              Ver catálogo
            </Link>
            <a
              href="#novedades"
              className="bg-brand-dark/90 hover:bg-brand-dark border border-gold/40 hover:border-gold text-cream font-medium text-xs sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg transition-colors"
            >
              Ver novedades
            </a>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2 {...fadeUp} className="text-2xl font-serif font-semibold text-neutral-900 mb-8 text-center">
          Categorías
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const Icon = categoryIcons[cat.slug] || ShoppingBag;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={`/categoria/${cat.slug}`}
                  className="group h-full flex flex-col items-center justify-center gap-3 bg-white border border-cream-dark rounded-xl p-5 text-center hover:border-gold hover:shadow-md transition-all"
                >
                  <span className="w-11 h-11 flex items-center justify-center rounded-full bg-cream text-brand group-hover:bg-brand group-hover:text-gold transition-colors">
                    <Icon size={20} />
                  </span>
                  <div className="min-h-[2.5rem] flex items-center justify-center">
                    <span className="text-sm font-medium text-neutral-700 group-hover:text-brand line-clamp-2">
                      {cat.nombre}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {promociones.length > 0 && (
        <section className="bg-brand/5 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div {...fadeUp} className="flex items-center justify-center gap-2 mb-8">
              <Tag size={20} className="text-gold" />
              <h2 className="text-2xl font-serif font-semibold text-neutral-900 text-center">Promociones y oportunidades</h2>
            </motion.div>
            <ProductGrid products={promociones} emptyText="" mostrarResenas={mostrarResenas} />
          </div>
        </section>
      )}

      <section id="novedades" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24">
        <motion.h2 {...fadeUp} className="text-2xl font-serif font-semibold text-neutral-900 mb-8 text-center">
          Novedades
        </motion.h2>
        {loading ? (
          <p className="text-neutral-500 text-sm text-center">Cargando productos…</p>
        ) : (
          <ProductGrid
            products={novedades}
            emptyText="Aún no hay productos cargados. Agrega el primero desde el panel de administración."
            mostrarResenas={mostrarResenas}
          />
        )}
      </section>

      {proximos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <motion.div {...fadeUp} className="flex items-center justify-center gap-2 mb-8">
            <Clock size={20} className="text-gold" />
            <h2 className="text-2xl font-serif font-semibold text-neutral-900 text-center">Próximos productos</h2>
          </motion.div>
          <ProductGrid products={proximos} emptyText="" mostrarResenas={mostrarResenas} />
        </section>
      )}
    </div>
  );
};

export default HomePage;
