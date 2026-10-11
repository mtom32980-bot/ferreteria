import { useState } from "react";

const vacio = { nombre: "", marca: "", categoria: "", ubicacion: "", precio: "", stock: "", imagen: "" };

export default function AdminPanel({ productos, categorias, onAgregar, onActualizar, onEliminar, onStock }) {
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const subirImagen = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => setForm((f) => ({ ...f, imagen: lector.result }));
    lector.readAsDataURL(archivo);
  };

  const editar = (p) => {
    setForm({ ...p, precio: String(p.precio), stock: String(p.stock) });
    setEditandoId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelar = () => {
    setForm(vacio);
    setEditandoId(null);
  };

  const guardar = (e) => {
    e.preventDefault();
    const datos = {
      ...form,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock, 10),
    };
    if (editandoId) onActualizar({ ...datos, id: editandoId });
    else onAgregar({ ...datos, id: Date.now() });
    cancelar();
  };

  const input =
    "w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 outline-none focus:border-orange-500";

  return (
    <div className="space-y-6">
      <form onSubmit={guardar} className="bg-[#0b1426] border border-white/10 rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-bold text-white">
          {editandoId ? "✏️ Editar producto" : "➕ Agregar producto"}
        </h2>

        <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-300">
          <label>Nombre
            <input required value={form.nombre} onChange={cambiar("nombre")} className={input} />
          </label>
          <label>Marca
            <input value={form.marca} onChange={cambiar("marca")} className={input} />
          </label>
          <label>Categoría
            <select required value={form.categoria} onChange={cambiar("categoria")} className={input}>
              <option value="">Selecciona...</option>
              {categorias.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Ubicación
            <input value={form.ubicacion} onChange={cambiar("ubicacion")} placeholder="Pasillo 1 - Estante A" className={input} />
          </label>
          <label>Precio (S/)
            <input required type="number" step="0.01" min="0" value={form.precio} onChange={cambiar("precio")} className={input} />
          </label>
          <label>Stock
            <input required type="number" min="0" value={form.stock} onChange={cambiar("stock")} className={input} />
          </label>
          <label className="sm:col-span-2">Foto (link o archivo)
            <input value={form.imagen.startsWith("data:") ? "" : form.imagen} onChange={cambiar("imagen")} placeholder="https://..." className={input} />
            <input type="file" accept="image/*" onChange={subirImagen} className="mt-2 text-xs" />
          </label>
        </div>

        {form.imagen && <img src={form.imagen} alt="vista previa" className="h-24 rounded-lg object-cover" />}

        <div className="flex gap-2">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg">
            {editandoId ? "Guardar cambios" : "Guardar producto"}
          </button>
          {editandoId && (
            <button type="button" onClick={cancelar} className="px-5 py-2 rounded-lg border border-white/20 text-slate-300 hover:bg-white/5">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="bg-[#0b1426] border border-white/10 rounded-2xl p-5 overflow-x-auto">
        <h2 className="text-lg font-bold text-white mb-3">Inventario ({productos.length})</h2>
        <table className="w-full text-sm text-slate-300">
          <thead className="text-left text-slate-500">
            <tr><th className="py-2">Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className={`border-t border-white/10 ${editandoId === p.id ? "bg-orange-500/10" : ""}`}>
                <td className="py-2 text-white">{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>S/ {Number(p.precio).toFixed(2)}</td>
                <td>
                  <input
                    type="number" min="0" value={p.stock}
                    onChange={(e) => onStock(p.id, parseInt(e.target.value, 10) || 0)}
                    className="w-20 bg-black/30 border border-white/10 rounded px-2 py-1"
                  />
                </td>
                <td className="text-right space-x-3">
                  <button onClick={() => editar(p)} className="text-blue-400 hover:text-blue-300">Editar</button>
                  <button onClick={() => confirm("¿Eliminar?") && onEliminar(p.id)} className="text-red-400 hover:text-red-300">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}