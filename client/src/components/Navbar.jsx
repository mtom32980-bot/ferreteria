export default function Navbar({ modo, setModo }) {
  const tab = (id, texto) => (
    <button
      onClick={() => setModo(id)}
      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
        modo === id ? "bg-orange-500 text-white" : "text-slate-300 hover:text-white"
      }`}
    >
      {texto}
    </button>
  );

  return (
    <header className="bg-[#050b1a] border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-lg">🏪</div>
          <div className="leading-tight">
            <p className="font-bold text-white">FerreStock</p>
            <p className="text-xs text-orange-400">Ferretería EDDIAM</p>
          </div>
        </div>
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          {tab("cliente", "📱 Modo Cliente")}
          {tab("admin", "⚙️ Administración")}
        </div>
      </div>
    </header>
  );
}