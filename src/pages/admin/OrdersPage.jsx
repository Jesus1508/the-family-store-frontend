import { useEffect, useState, Fragment } from "react";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Check, X, Truck, Store } from "lucide-react";
import { getOrders, confirmarOrder, cancelarOrder } from "../../services/APIservice";

const currency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const ESTADO_LABELS = {
  pendiente_pago: { label: "Pendiente de pago", className: "bg-amber-100 text-amber-700" },
  confirmado: { label: "Confirmado", className: "bg-green-100 text-green-700" },
  cancelado: { label: "Cancelado", className: "bg-neutral-100 text-neutral-500" },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("");

  const load = () => {
    setLoading(true);
    getOrders(filtroEstado ? { estado: filtroEstado } : {})
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Error al cargar pedidos"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filtroEstado]);

  const handleConfirmar = async (id) => {
    if (!window.confirm("¿Confirmar que el pago fue recibido? Esto descontará el stock.")) return;
    try {
      await confirmarOrder(id);
      toast.success("Pedido confirmado");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al confirmar el pedido");
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Cancelar este pedido? Se liberará la reserva de stock.")) return;
    try {
      await cancelarOrder(id);
      toast.success("Pedido cancelado");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al cancelar el pedido");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-semibold text-brand">Ventas</h1>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="p-2 border border-neutral-300 rounded text-sm focus:outline-gold"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente_pago">Pendiente de pago</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Cargando…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-neutral-500">No hay pedidos todavía.</p>
      ) : (
        <div className="bg-white border border-cream-dark rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-cream text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Pago</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isExpanded = expandedId === order._id;
                const estado = ESTADO_LABELS[order.estado];
                return (
                  <Fragment key={order._id}>
                    <tr className="border-t border-neutral-100">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : order._id)}
                          className="flex items-center gap-1.5 font-medium text-neutral-800 hover:text-brand"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          #{order._id.slice(-6)}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-neutral-600">
                        {order.cliente.nombre}
                        <span className="block text-xs text-neutral-400">{order.cliente.telefono}</span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 capitalize">{order.metodoPago}</td>
                      <td className="px-4 py-3 text-right font-medium">{currency(order.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${estado.className}`}>
                          {estado.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {order.estado === "pendiente_pago" && (
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleConfirmar(order._id)}
                              className="flex items-center gap-1 text-green-600 hover:text-green-800 text-xs font-semibold"
                            >
                              <Check size={14} /> Confirmar
                            </button>
                            <button
                              onClick={() => handleCancelar(order._id)}
                              className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold"
                            >
                              <X size={14} /> Cancelar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-t border-neutral-100 bg-cream/40">
                        <td colSpan={6} className="px-4 py-4">
                          <p className="text-xs text-neutral-500 mb-2">
                            {order.cliente.email && `Email: ${order.cliente.email} · `}
                            Fecha: {new Date(order.createdAt).toLocaleString("es-MX")}
                          </p>

                          <div className="flex items-start gap-1.5 text-sm text-neutral-700 mb-3">
                            {order.envio?.solicitado ? (
                              <>
                                <Truck size={14} className="mt-0.5 flex-shrink-0" />
                                <span>
                                  Envío a domicilio ({currency(order.envio.costo)}):{" "}
                                  {order.envio.direccion?.calle} {order.envio.direccion?.numero},{" "}
                                  {order.envio.direccion?.colonia}, {order.envio.direccion?.ciudad}, CP{" "}
                                  {order.envio.direccion?.codigoPostal}
                                  {order.envio.direccion?.referencias && ` — ${order.envio.direccion.referencias}`}
                                </span>
                              </>
                            ) : (
                              <>
                                <Store size={14} className="mt-0.5 flex-shrink-0" /> Recoger en tienda
                              </>
                            )}
                          </div>

                          <ul className="space-y-1">
                            {order.items.map((item, i) => (
                              <li key={i} className="text-sm text-neutral-700 flex justify-between">
                                <span>
                                  {item.cantidad}x {item.nombre}
                                  {item.talla && ` (talla ${item.talla})`}
                                </span>
                                <span>{currency(item.precio * item.cantidad)}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
