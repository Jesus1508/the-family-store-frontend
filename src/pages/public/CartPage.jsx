import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Trash2, Minus, Plus, ShoppingBag, CheckCircle2, MessageCircle, Mail } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/APIservice";

const currency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const CartPage = () => {
  const { items, removeItem, updateQuantity, total, clear } = useCart();
  const [cliente, setCliente] = useState({ nombre: "", telefono: "", email: "" });
  const [metodoPago, setMetodoPago] = useState("transferencia");
  const [submitting, setSubmitting] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createOrder({
        items: items.map((i) => ({ productoId: i.productoId, talla: i.talla, cantidad: i.cantidad })),
        cliente,
        metodoPago,
      });
      setConfirmacion(res.data);
      clear();
    } catch (err) {
      toast.error(err.response?.data?.message || "No se pudo crear el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmacion) {
    const { order, settings } = confirmacion;
    const whatsappHref = settings?.whatsapp
      ? `https://wa.me/52${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
          `Hola, ya hice mi pedido #${order._id.slice(-6)} por ${currency(order.total)}, adjunto mi comprobante de pago.`
        )}`
      : null;
    const mailtoHref = settings?.email
      ? `mailto:${settings.email}?subject=${encodeURIComponent(`Comprobante de pago - Pedido #${order._id.slice(-6)}`)}`
      : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto px-4 py-16 text-center"
      >
        <CheckCircle2 size={44} className="text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-serif font-semibold text-brand mb-2">¡Pedido recibido!</h1>
        <p className="text-neutral-500 text-sm mb-8">
          Pedido #{order._id.slice(-6)} · Total {currency(order.total)}
        </p>

        <div className="bg-white border border-cream-dark rounded-xl p-6 text-left space-y-2 mb-6">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
            Datos para tu {metodoPago === "transferencia" ? "transferencia" : "depósito"}
          </h2>
          <p className="text-sm text-neutral-700">
            <strong>Banco:</strong> {settings?.banco || "—"}
          </p>
          <p className="text-sm text-neutral-700">
            <strong>Titular:</strong> {settings?.titular || "—"}
          </p>
          <p className="text-sm text-neutral-700">
            <strong>Cuenta:</strong> {settings?.numeroCuenta || "—"}
          </p>
          <p className="text-sm text-neutral-700">
            <strong>CLABE:</strong> {settings?.clabe || "—"}
          </p>
          {settings?.notasPago && <p className="text-sm text-neutral-500 pt-2 border-t border-cream-dark mt-3">{settings.notasPago}</p>}
        </div>

        <p className="text-sm text-neutral-600 mb-4">Envíanos tu comprobante de pago:</p>
        <div className="flex justify-center gap-3 flex-wrap">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-3 rounded-full transition"
            >
              <MessageCircle size={16} /> Enviar por WhatsApp
            </a>
          )}
          {mailtoHref && (
            <a
              href={mailtoHref}
              className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-3 rounded-full transition"
            >
              <Mail size={16} /> Enviar por email
            </a>
          )}
        </div>

        <Link to="/" className="inline-block mt-8 text-sm text-neutral-500 hover:text-brand">
          Volver a la tienda
        </Link>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={40} className="text-gold/50 mx-auto mb-4" />
        <h1 className="text-2xl font-serif font-semibold text-brand mb-2">Tu carrito está vacío</h1>
        <Link to="/" className="text-sm text-brand hover:underline">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <h1 className="text-3xl font-serif font-semibold text-brand mb-8 text-center">Tu carrito</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={`${item.productoId}-${item.talla || "sin-talla"}`}
              className="flex items-center gap-4 bg-white border border-cream-dark rounded-lg p-3"
            >
              <div className="w-16 h-16 bg-cream rounded-md overflow-hidden flex-shrink-0">
                {item.imagen && <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800 truncate">{item.nombre}</p>
                {item.talla && <p className="text-xs text-neutral-400">Talla: {item.talla}</p>}
                <p className="text-sm font-serif font-semibold text-brand">{currency(item.precio)}</p>
              </div>
              <div className="flex items-center border border-cream-dark rounded-lg">
                <button
                  onClick={() => updateQuantity(item.productoId, item.talla, Math.max(1, item.cantidad - 1))}
                  className="p-1.5 text-neutral-500 hover:text-brand"
                  aria-label="Restar"
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center text-sm">{item.cantidad}</span>
                <button
                  onClick={() => updateQuantity(item.productoId, item.talla, item.cantidad + 1)}
                  className="p-1.5 text-neutral-500 hover:text-brand"
                  aria-label="Sumar"
                >
                  <Plus size={12} />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.productoId, item.talla)}
                className="text-neutral-400 hover:text-red-600"
                aria-label="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-cream-dark rounded-lg p-5 space-y-4 h-fit">
          <div className="flex justify-between text-lg font-serif font-semibold text-brand pb-3 border-b border-cream-dark">
            <span>Total</span>
            <span>{currency(total)}</span>
          </div>

          <input
            required
            placeholder="Nombre completo"
            value={cliente.nombre}
            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
            className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold text-sm"
          />
          <input
            required
            placeholder="Teléfono / WhatsApp"
            value={cliente.telefono}
            onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
            className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold text-sm"
          />
          <input
            type="email"
            placeholder="Email (opcional)"
            value={cliente.email}
            onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
            className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold text-sm"
          />

          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">Forma de pago</p>
            <div className="space-y-2">
              {[
                { value: "transferencia", label: "Transferencia bancaria" },
                { value: "deposito", label: "Depósito bancario" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="radio"
                    name="metodoPago"
                    value={opt.value}
                    checked={metodoPago === opt.value}
                    onChange={() => setMetodoPago(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <p className="text-xs text-neutral-400">
            Al confirmar tu pedido aceptas nuestra{" "}
            <Link to="/politica-de-compra" className="text-brand hover:underline">
              política de compra
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-3 rounded transition"
          >
            {submitting ? "Enviando…" : "Confirmar pedido"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CartPage;
