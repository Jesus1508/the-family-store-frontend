import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UserPlus, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAdmins, createAdminUser, deleteAdminUser } from "../../services/APIservice";

const fecha = (d) => new Date(d).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });

const UsersPage = () => {
  const { admin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { nombre: "", email: "", password: "" } });

  const load = () => {
    setLoading(true);
    getAdmins()
      .then((res) => setAdmins(res.data))
      .catch(() => toast.error("Error al cargar administradores"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onSubmit = async (values) => {
    try {
      await createAdminUser(values);
      toast.success("Administrador creado");
      reset({ nombre: "", email: "", password: "" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al crear el administrador");
    }
  };

  const handleDelete = async (a) => {
    if (!window.confirm(`¿Eliminar al administrador "${a.nombre}"?`)) return;
    try {
      await deleteAdminUser(a._id);
      toast.success("Administrador eliminado");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar el administrador");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-semibold text-brand mb-6">Usuarios administradores</h1>

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
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-neutral-500 mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full p-2 border border-neutral-300 rounded focus:outline-gold text-sm"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-neutral-500 mb-1">Contraseña</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="w-full p-2 border border-neutral-300 rounded focus:outline-gold text-sm"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded transition"
        >
          <UserPlus size={15} /> Crear
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-neutral-500">Cargando…</p>
      ) : (
        <div className="bg-white border border-cream-dark rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-cream text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Creado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a._id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {a.nombre}
                    {a._id === admin?.id && (
                      <span className="ml-2 text-xs font-medium text-gold bg-gold/10 px-2 py-0.5 rounded-full">Tú</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{a.email}</td>
                  <td className="px-4 py-3 text-neutral-500">{fecha(a.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {a._id !== admin?.id && (
                        <button
                          onClick={() => handleDelete(a)}
                          className="text-neutral-500 hover:text-red-600"
                          aria-label="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
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

export default UsersPage;
