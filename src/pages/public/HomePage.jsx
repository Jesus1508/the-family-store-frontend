import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shirt, Footprints, ShoppingBag, Sparkles, Droplet, Truck, ShieldCheck, Gem } from "lucide-react";
import categories from "../../data/categories";
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
      <section className="relative overflow-hidden bg-brand text-cream">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,39,0.15),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(201,162,39,0.12),transparent_45%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto text-center px-4 py-24"
        >
          <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Moda &middot; Belleza &middot; Estilo de vida
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-semibold leading-tight text-cream">
            The Family Store
          </h1>
          <p className="mt-5 text-cream/80 max-w-xl mx-auto text-lg">
            Moda, calzado, bolsos, belleza y cuidado personal para toda la familia.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/categoria/ropa-dama"
              className="bg-gold hover:bg-gold-light text-brand-dark font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Ver catálogo
            </Link>
            <a
              href="#destacados"
              className="border border-cream/30 hover:border-gold hover:text-gold text-cream font-medium px-6 py-3 rounded-full transition-colors"
            >
              Productos destacados
            </a>
          </div>
        </motion.div>

        <div className="relative border-t border-gold/15 bg-black/10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gold/15">
            {[
              { icon: Truck, text: "Envío a todo el país" },
              { icon: ShieldCheck, text: "Productos originales" },
              { icon: Gem, text: "Selección premium" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center justify-center gap-2 py-4 text-sm text-cream/85">
                <Icon size={16} className="text-gold" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2 {...fadeUp} className="text-2xl font-serif font-semibold text-neutral-900 mb-8 text-center">
          Categorías
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const Icon = categoryIcons[cat.slug];
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
                  className="group flex flex-col items-center gap-3 bg-white border border-cream-dark rounded-xl p-5 text-center hover:border-gold hover:shadow-md transition-all"
                >
                  <span className="w-11 h-11 flex items-center justify-center rounded-full bg-cream text-brand group-hover:bg-brand group-hover:text-gold transition-colors">
                    <Icon size={20} />
                  </span>
                  <span className="text-sm font-medium text-neutral-700 group-hover:text-brand">{cat.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="destacados" className="max-w-7xl mx-auto px-4 pb-20 scroll-mt-24">
        <motion.h2 {...fadeUp} className="text-2xl font-serif font-semibold text-neutral-900 mb-8 text-center">
          Productos destacados
        </motion.h2>
        {loading ? (
          <p className="text-neutral-500 text-sm text-center">Cargando productos…</p>
        ) : products.length === 0 ? (
          <p className="text-neutral-500 text-sm text-center">
            Aún no hay productos cargados. Agrega el primero desde el panel de administración.
          </p>
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
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
