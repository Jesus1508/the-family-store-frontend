import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, Trash2 } from "lucide-react";
import { getAllReviews, aprobarReview, deleteReview } from "../../services/APIservice";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  const load = () => {
    setLoading(true);
    getAllReviews(filtro ? { aprobada: filtro } : {})
      .then((res) => setReviews(res.data))
      .catch(() => toast.error("Error al cargar reseñas"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filtro]);

  const handleAprobar = async (id) => {
    try {
      await aprobarReview(id);
      toast.success("Reseña aprobada");
      load();
    } catch {
      toast.error("Error al aprobar la reseña");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta reseña?")) return;
    try {
      await deleteReview(id);
      toast.success("Reseña eliminada");
      load();
    } catch {
      toast.error("Error al eliminar la reseña");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-semibold text-brand">Reseñas</h1>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="p-2 border border-neutral-300 rounded text-sm focus:outline-gold"
        >
          <option value="">Todas</option>
          <option value="false">Pendientes</option>
          <option value="true">Aprobadas</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Cargando…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-neutral-500">No hay reseñas.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white border border-cream-dark rounded-lg p-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-neutral-800">{r.nombreCliente}</p>
                  <span className="flex items-center text-gold text-xs">
                    {"★".repeat(r.calificacion)}
                    <span className="text-neutral-300">{"★".repeat(5 - r.calificacion)}</span>
                  </span>
                  {!r.aprobada && (
                    <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Pendiente
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mb-1">Producto: {r.producto?.nombre || "—"}</p>
                {r.comentario && <p className="text-sm text-neutral-600">{r.comentario}</p>}
              </div>
              <div className="flex gap-3 flex-shrink-0">
                {!r.aprobada && (
                  <button
                    onClick={() => handleAprobar(r._id)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-800 text-xs font-semibold"
                  >
                    <Check size={14} /> Aprobar
                  </button>
                )}
                <button
                  onClick={() => handleEliminar(r._id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-semibold"
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
