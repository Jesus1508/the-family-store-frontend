import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getProduct, createProduct, updateProduct } from "../../services/APIservice";
import categories from "../../data/categories";

const ProductFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!isEditing) return;
    getProduct(id)
      .then((res) => {
        const p = res.data;
        reset({
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          categoria: p.categoria,
          stock: p.stock,
          sku: p.sku,
        });
        setExistingImages(p.imagenes || []);
      })
      .catch(() => toast.error("No se pudo cargar el producto"))
      .finally(() => setLoading(false));
  }, [id, isEditing, reset]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "imagenes") return;
      formData.append(key, value);
    });

    const files = values.imagenes;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => formData.append("imagenes", file));
    }

    try {
      if (isEditing) {
        await updateProduct(id, formData);
        toast.success("Producto actualizado");
      } else {
        await createProduct(formData);
        toast.success("Producto creado");
      }
      navigate("/admin/productos");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al guardar el producto");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-sm text-neutral-500">Cargando…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold font-serif text-brand mb-6">
        {isEditing ? "Editar producto" : "Nuevo producto"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white border border-cream-dark rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
          <input
            {...register("nombre", { required: "El nombre es requerido" })}
            className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold"
          />
          {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Descripción</label>
          <textarea
            rows={4}
            {...register("descripcion")}
            className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Precio (MXN)</label>
            <input
              type="number"
              step="0.01"
              {...register("precio", { required: "El precio es requerido", min: 0 })}
              className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold"
            />
            {errors.precio && <p className="text-xs text-red-600 mt-1">{errors.precio.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Stock</label>
            <input
              type="number"
              {...register("stock", { required: true, min: 0 })}
              className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Categoría</label>
            <select
              {...register("categoria", { required: true })}
              className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold"
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">SKU</label>
            <input
              {...register("sku", { required: "El SKU es requerido" })}
              className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold"
            />
            {errors.sku && <p className="text-xs text-red-600 mt-1">{errors.sku.message}</p>}
          </div>
        </div>

        {existingImages.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Imágenes actuales</label>
            <div className="flex gap-2">
              {existingImages.map((img) => (
                <img key={img.publicId} src={img.url} alt="" className="w-16 h-16 object-cover rounded border border-cream-dark" />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            {existingImages.length > 0 ? "Reemplazar imágenes (opcional)" : "Imágenes"}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            {...register("imagenes")}
            className="w-full text-sm text-neutral-600"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-3 rounded transition"
        >
          {submitting ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear producto"}
        </button>
      </form>
    </div>
  );
};

export default ProductFormPage;
