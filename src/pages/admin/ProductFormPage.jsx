import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { getProduct, createProduct, updateProduct } from "../../services/APIservice";
import { useCategories } from "../../hooks/useCategories";

const CATEGORIAS_CON_TALLAS = ["ropa-dama", "ropa-caballero", "calzado"];

const ProductFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const { categories } = useCategories({ all: true });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({ defaultValues: { tallas: [] } });

  const { fields, append, remove } = useFieldArray({ control, name: "tallas" });
  const categoriaSeleccionada = watch("categoria");
  const mostrarTallas = CATEGORIAS_CON_TALLAS.includes(categoriaSeleccionada);

  useEffect(() => {
    if (!isEditing) return;
    getProduct(id)
      .then((res) => {
        const p = res.data;
        reset({
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: p.precio,
          precioOriginal: p.precioOriginal || "",
          categoria: p.categoria,
          stock: p.stock,
          sku: p.sku,
          proximamente: p.proximamente || false,
          tallas: p.tallas || [],
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
      if (key === "imagenes" || key === "tallas") return;
      formData.append(key, value);
    });

    formData.append("tallas", JSON.stringify(mostrarTallas ? values.tallas : []));

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
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Precio antes de promoción <span className="text-neutral-400">(opcional)</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register("precioOriginal", { min: 0 })}
              className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Stock</label>
            <input
              type="number"
              {...register("stock", { required: true, min: 0 })}
              className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold"
            />
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

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Categoría</label>
          <select
            {...register("categoria", { required: true })}
            className="w-full p-2.5 border border-neutral-300 rounded focus:outline-gold"
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {mostrarTallas && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Tallas y stock por talla</label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <input
                    placeholder="Talla (ej. S, M, 26)"
                    {...register(`tallas.${index}.talla`, { required: true })}
                    className="flex-1 p-2 border border-neutral-300 rounded focus:outline-gold text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    min={0}
                    {...register(`tallas.${index}.stock`, { required: true, min: 0 })}
                    className="w-24 p-2 border border-neutral-300 rounded focus:outline-gold text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-neutral-400 hover:text-red-600"
                    aria-label="Eliminar talla"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => append({ talla: "", stock: 0 })}
              className="mt-2 flex items-center gap-1.5 text-sm text-brand hover:text-brand-dark font-medium"
            >
              <Plus size={14} /> Agregar talla
            </button>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input type="checkbox" {...register("proximamente")} className="rounded border-neutral-300" />
          Marcar como "Próximamente" (no visible para compra todavía)
        </label>

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
