import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

const TEXTO_POR_DEFECTO =
  "En The Family Store creemos que cada integrante de la familia merece encontrar su estilo en un solo lugar. Nacimos para reunir moda, calzado, belleza y cuidado personal —piezas cuidadosamente seleccionadas, nacionales e importadas— bajo un mismo estándar: calidad ante todo. Hoy llegamos a todo el país con envíos locales y nacionales, pensando siempre en que comprar para la familia sea simple, confiable y con buen gusto.";

const AboutPage = () => {
  const { settings, loading } = useSettings();
  const texto = settings?.quienesSomos || TEXTO_POR_DEFECTO;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 py-16"
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <Heart size={20} className="text-gold" />
        <h1 className="text-3xl font-serif font-semibold text-brand text-center">¿Quiénes somos?</h1>
      </div>
      {loading ? (
        <p className="text-neutral-500 text-sm text-center">Cargando…</p>
      ) : (
        <p className="text-neutral-600 leading-relaxed text-lg text-center whitespace-pre-line">{texto}</p>
      )}
    </motion.div>
  );
};

export default AboutPage;
