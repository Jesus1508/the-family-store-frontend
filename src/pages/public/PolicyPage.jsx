import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

const TEXTO_POR_DEFECTO =
  "Una vez que se confirme la compra no se aceptan devoluciones ni cancelaciones. Te recomendamos revisar bien la descripción, talla e imágenes del producto antes de confirmar tu pedido. Si tienes dudas, contáctanos antes de comprar.";

const PolicyPage = () => {
  const { settings, loading } = useSettings();
  const texto = settings?.politicaCompra || TEXTO_POR_DEFECTO;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto px-4 py-16"
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <ShieldAlert size={20} className="text-gold" />
        <h1 className="text-3xl font-serif font-semibold text-brand text-center">Política de Compra</h1>
      </div>
      {loading ? (
        <p className="text-neutral-500 text-sm text-center">Cargando…</p>
      ) : (
        <div className="bg-white border border-cream-dark rounded-xl p-8">
          <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{texto}</p>
        </div>
      )}
    </motion.div>
  );
};

export default PolicyPage;
