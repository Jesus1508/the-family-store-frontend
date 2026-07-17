import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../services/APIservice";

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: { nombre: "", slug: "", activa: true },
  });

  const load = () => {
    setLoading(true);
    getCategories({ all: true })
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Error al cargar categorías"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const nombre = watch("nombre");
  useEffect(() => {
    if (!editing) setValue("slug", slugify(nombre || ""));
  }, [nombre, editing, setValue]);

  const startEdit = (cat) => {
    setEditing(cat);
    reset({ nombre: cat.nombre, slug: cat.slug, activa: cat.activa });
  };

  const cancelEdit = () => {
    setEditing(null);
    reset({ nombre: "", slug: "", activa: true });
  };

  const onSubmit = async (values) => {
    try {
      if (editing) {
        await updateCategory(editing._id, values);
        toast.success("Categoría actualizada");
      } else {
        await createCategory(values);
        toast.success("Categoría creada");
      }
      cancelEdit();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al guardar la categoría");
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return;
    try {
      await deleteCategory(cat._id);
      toast.success("Categoría eliminada");
      load();
    } catch {
      toast.error("Error al eliminar la categoría");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-semibold text-brand mb-6">Categorías</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-cream-dark rounded-lg p-5 mb-6 flex flex-wrap gap-3 items-end"
      >
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-neutral-500 mb-1">Nombre</label>
          <input
            {...register("nombre", { required: true })}
            className="w-full p-2 border border-neutral-300 rounded focus:outline-gold text-sm"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-neutral-500 mb-1">Slug</label>
          <input
            {...register("slug", { required: true })}
            className="w-full p-2 border border-neutral-300 rounded focus:outline-gold text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-700 mb-2">
          <input type="checkbox" {...register("activa")} className="rounded border-neutral-300" />
          Activa
        </label>
        <button
          type="submit"
          className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded transition"
        >
          <Plus size={15} /> {editing ? "Guardar" : "Agregar"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={cancelEdit}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 text-sm px-3 py-2"
          >
            <X size={15} /> Cancelar
          </button>
        )}
      </form>

      {loading ? (
        <p className="text-sm text-neutral-500">Cargando…</p>
      ) : (
        <div className="bg-white border border-cream-dark rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-cream text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 font-medium text-neutral-800">{cat.nombre}</td>
                  <td className="px-4 py-3 text-neutral-500">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        cat.activa ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {cat.activa ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => startEdit(cat)} className="text-neutral-500 hover:text-brand" aria-label="Editar">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(cat)} className="text-neutral-500 hover:text-red-600" aria-label="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
