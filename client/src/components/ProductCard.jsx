export default function ProductCard({ producto, onPedir }) {
  const { nombre, marca, categoria, ubicacion, precio, stock, imagen } = producto;

  let estado = { texto: `✔ Stock: ${stock} u.`, clase: "text-emerald-400" };
  if (stock <= 0) estado = { texto: "✖ Agotado", clase: "text-red-400" };
  else if (stock <= 10) estado = { texto: `⚠ Últimas ${stock} u.`, clase: "text-yellow-400" };

  return (
    <div className="bg-[#0b1426] border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
      <div className="relative h-40 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
        {imagen ? (
          <img src={imagen} alt={nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">📦</span>
        )}
        <span className="absolute top-2 left-2 text-xs bg-black/70 text-orange-400 px-2 py-1 rounded">
          {categoria}
        </span>
      </div>

      <h3 className="font-bold text-white leading-snug">{nombre}</h3>
      <p className="text-sm text-slate-400">Marca: {marca || "—"}</p>

      <div className="flex justify-between text-xs bg-black/30 border border-white/10 rounded-lg px-3 py-2">
        <span className="text-slate-400">Ubicación:</span>
        <span className="text-slate-200 font-mono">{ubicacion || "—"}</span>
      </div>

      <div className="border-t border-white/10 pt-3 mt-1 flex items-end justify-between">
        <div>
          <p className="text-sm text-slate-400">Precio:</p>
          <p className="text-xl font-bold text-orange-400">S/ {Number(precio).toFixed(2)}</p>
        </div>
        <div className="text-right space-y-1">
          <p className={`text-xs ${estado.clase}`}>{estado.texto}</p>
          <button
            disabled={stock <= 0}
            onClick={() => onPedir(producto)}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-1.5 rounded-lg"
          >
            🛒 Pedir
          </button>
        </div>
      </div>
    </div>
  );
}