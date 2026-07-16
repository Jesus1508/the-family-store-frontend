import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getProducts, deleteProduct } from "../../services/APIservice";
import categories from "../../data/categories";

const currency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

const ProductsListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getProducts({ limit: 100 })
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Error al cargar productos"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`¿Eliminar "${product.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProduct(product._id);
      toast.success("Producto eliminado");
      load();
    } catch {
      toast.error("Error al eliminar el producto");
    }
  };

  const categoryLabel = (slug) => categories.find((c) => c.slug === slug)?.label || slug;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-neutral-900">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-4 py-2 rounded transition"
        >
          <Plus size={16} /> Nuevo producto
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500">Cargando…</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-neutral-500">No hay productos todavía. Crea el primero.</p>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 font-medium text-neutral-800">{p.nombre}</td>
                  <td className="px-4 py-3 text-neutral-500">{categoryLabel(p.categoria)}</td>
                  <td className="px-4 py-3 text-right">{currency(p.precio)}</td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/productos/${p._id}/editar`}
                        className="text-neutral-500 hover:text-rose-600"
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-neutral-500 hover:text-red-600"
                        aria-label="Eliminar"
                      >
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

export default ProductsListPage;
