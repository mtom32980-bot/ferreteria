import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import VoiceSearch from "./components/VoiceSearch";
import AdminPanel from "./components/AdminPanel";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const TIENDA = {
  nombre: "Ferretería El Maestro",
  direccion: "Av. Perú 1420, San Martín de Porres",
  telefono: "(01) 987-6543",
  whatsapp: "51", // <-- cambia por tu número, con código de país
};

const CATEGORIAS = [
  "Construcción", "Herramientas Eléctricas", "Gasfitería",
  "Electricidad", "Pinturas", "Herramientas Manuales",
];

const SUGERENCIAS_VOZ = ["Taladro inalámbrico", "Cemento Sol", "Tubo PVC agua", "Cinta aislante 3M", "Pintura látex blanco"];

export default function App() {
  const [modo, setModo] = useState("cliente");
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  // Lee los productos de Firestore en tiempo real
  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("creado", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        setProductos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setCargando(false);
      },
      (err) => {
        console.error("Error leyendo productos:", err);
        setCargando(false);
      }
    );
  }, []);

  // Operaciones del administrador
  const agregar = ({ id, ...datos }) =>
    addDoc(collection(db, "productos"), { ...datos, creado: serverTimestamp() });

  const actualizar = ({ id, creado, ...datos }) =>
    updateDoc(doc(db, "productos", id), datos);

  const eliminar = (id) => deleteDoc(doc(db, "productos", id));

  const cambiarStock = (id, stock) =>
    updateDoc(doc(db, "productos", id), { stock });

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return productos.filter(
      (p) =>
        (categoria === "Todas" || p.categoria === categoria) &&
        `${p.nombre} ${p.marca} ${p.categoria}`.toLowerCase().includes(q)
    );
  }, [productos, busqueda, categoria]);

  const pedir = (p) => {
    const msg = `Hola, quiero pedir: ${p.nombre} (S/ ${Number(p.precio).toFixed(2)})`;
    window.open(`https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const pill = (activa) =>
    `px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
      activa ? "bg-orange-500 text-white font-semibold" : "bg-white/5 text-slate-300 hover:bg-white/10"
    }`;

  return (
    <div className="min-h-screen bg-[#050b1a] text-white">
      <Navbar modo={modo} setModo={setModo} />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {modo === "admin" ? (
          <AdminPanel
            productos={productos}
            categorias={CATEGORIAS}
            onAgregar={agregar}
            onActualizar={actualizar}
            onEliminar={eliminar}
            onStock={cambiarStock}
          />
        ) : (
          <div className="space-y-5">
            <div className="bg-[#0b1426] border border-white/10 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">
                  {TIENDA.nombre}{" "}
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded align-middle">Abierto Hoy</span>
                </h2>
                <p className="text-sm text-slate-400">📍 {TIENDA.direccion} • Tel: {TIENDA.telefono}</p>
              </div>
              <div className="text-sm bg-black/30 border border-white/10 rounded-lg px-3 py-2">
                Catálogo Activo: <b>{productos.length} productos</b>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, marca o palabra clave..."
                className="flex-1 bg-[#0b1426] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 placeholder-slate-500"
              />
              <VoiceSearch onResultado={setBusqueda} />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500">Probar Voz:</span>
              {SUGERENCIAS_VOZ.map((s) => (
                <button key={s} onClick={() => setBusqueda(s)} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10">
                  "{s}"
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {["Todas", ...CATEGORIAS].map((c) => (
                <button key={c} onClick={() => setCategoria(c)} className={pill(categoria === c)}>{c}</button>
              ))}
            </div>

            {cargando && <p className="text-center text-slate-500 py-10">Cargando productos...</p>}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtrados.map((p) => <ProductCard key={p.id} producto={p} onPedir={pedir} />)}
            </div>

            {!cargando && filtrados.length === 0 && (
              <p className="text-center text-slate-500 py-10">No se encontraron productos.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}