import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { getReviews, createReview } from "../services/APIservice";

const StarRating = ({ value, onChange, size = 18 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange?.(n)}
        className={onChange ? "cursor-pointer" : "cursor-default"}
        aria-label={`${n} estrellas`}
      >
        <Star
          size={size}
          className={n <= value ? "fill-gold text-gold" : "text-neutral-300"}
        />
      </button>
    ))}
  </div>
);

const ReviewsSection = ({ productoId, promedio = 0, total = 0, onReviewSubmitted }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calificacion, setCalificacion] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const load = () => {
    setLoading(true);
    getReviews({ producto: productoId })
      .then((res) => setReviews(res.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [productoId]);

  const onSubmit = async (values) => {
    if (calificacion === 0) {
      toast.error("Selecciona una calificación");
      return;
    }
    try {
      await createReview({ producto: productoId, ...values, calificacion });
      toast.success("¡Gracias! Tu reseña quedará visible una vez revisada.");
      reset({ nombreCliente: "", comentario: "" });
      setCalificacion(0);
      onReviewSubmitted?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "No se pudo enviar tu reseña");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-serif font-semibold text-brand">Reseñas</h2>
        {total > 0 && (
          <span className="flex items-center gap-1.5 text-sm text-neutral-500">
            <StarRating value={Math.round(promedio)} size={14} />
            {promedio.toFixed(1)} ({total})
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-neutral-500">Cargando reseñas…</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-neutral-500">Aún no hay reseñas. Sé el primero en dejar una.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="bg-white border border-cream-dark rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-neutral-800">{r.nombreCliente}</p>
                  <StarRating value={r.calificacion} size={14} />
                </div>
                {r.comentario && <p className="text-sm text-neutral-600">{r.comentario}</p>}
                <p className="text-xs text-neutral-400 mt-2">
                  {new Date(r.createdAt).toLocaleDateString("es-MX")}
                </p>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-cream-dark rounded-lg p-5 space-y-3 h-fit"
        >
          <p className="text-sm font-semibold text-neutral-700">Deja tu reseña</p>
          <StarRating value={calificacion} onChange={setCalificacion} size={22} />
          <input
            placeholder="Tu nombre"
            {...register("nombreCliente", { required: true })}
            className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold text-sm"
          />
          {errors.nombreCliente && <p className="text-xs text-red-600">Tu nombre es requerido</p>}
          <textarea
            placeholder="Cuéntanos tu experiencia (opcional)"
            rows={3}
            {...register("comentario")}
            className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold text-sm"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-2.5 rounded transition text-sm"
          >
            {isSubmitting ? "Enviando…" : "Enviar reseña"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewsSection;
