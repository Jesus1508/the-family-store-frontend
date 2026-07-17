import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getSettings, updateSettings } from "../../services/APIservice";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
    {children}
  </div>
);

const inputClass = "w-full p-2.5 border border-neutral-300 rounded focus:outline-gold text-sm";

const SettingsPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    getSettings()
      .then((res) => reset(res.data))
      .catch(() => toast.error("No se pudo cargar la configuración"));
  }, [reset]);

  const onSubmit = async (values) => {
    try {
      await updateSettings(values);
      toast.success("Configuración guardada");
    } catch {
      toast.error("Error al guardar la configuración");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-serif font-semibold text-brand mb-6">Configuración</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white border border-cream-dark rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
            Datos bancarios (transferencia / depósito)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Banco">
              <input {...register("banco")} className={inputClass} placeholder="BBVA Bancomer" />
            </Field>
            <Field label="Titular de la cuenta">
              <input {...register("titular")} className={inputClass} />
            </Field>
            <Field label="Número de cuenta">
              <input {...register("numeroCuenta")} className={inputClass} />
            </Field>
            <Field label="CLABE interbancaria">
              <input {...register("clabe")} className={inputClass} />
            </Field>
          </div>
          <Field label="Notas para el cliente sobre el pago">
            <textarea
              rows={3}
              {...register("notasPago")}
              className={inputClass}
              placeholder="Ej. Envía tu comprobante por WhatsApp o correo para confirmar tu pedido."
            />
          </Field>
        </div>

        <div className="bg-white border border-cream-dark rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Contacto</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="WhatsApp">
              <input {...register("whatsapp")} className={inputClass} placeholder="9671676287" />
            </Field>
            <Field label="Teléfono">
              <input {...register("telefono")} className={inputClass} placeholder="9671380166" />
            </Field>
            <Field label="Email">
              <input {...register("email")} type="email" className={inputClass} />
            </Field>
          </div>
        </div>

        <div className="bg-white border border-cream-dark rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Textos de la tienda</h2>
          <Field label="¿Quiénes somos?">
            <textarea rows={5} {...register("quienesSomos")} className={inputClass} />
          </Field>
          <Field label="Política de compra">
            <textarea rows={4} {...register("politicaCompra")} className={inputClass} />
          </Field>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold py-3 rounded transition"
        >
          {isSubmitting ? "Guardando…" : "Guardar configuración"}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
