import React, { useState } from 'react';
import { 
  Search, 
  Mic, 
  Plus, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  Layers, 
  Wrench 
} from 'lucide-react';

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isListening, setIsListening] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Lista de productos de demostración
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Cemento Sol 42.5kg", categoria: "Construcción", stock: 25, precio: 28.50, pasillo: "Pasillo A - Estante 1" },
    { id: 2, nombre: "Tubo PVC Agualuz 1/2''", categoria: "Gasfitería", stock: 4, precio: 14.20, pasillo: "Pasillo C - Estante 3" },
    { id: 3, nombre: "Taladro Percutor 650W DeWalt", categoria: "Herramientas", stock: 0, precio: 249.00, pasillo: "Exhibición Principal" },
    { id: 4, nombre: "Cable Indeco NMT 14 AWG x 100m", categoria: "Electricidad", stock: 12, precio: 135.00, pasillo: "Pasillo B - Estante 2" },
    { id: 5, nombre: "Pintura Látex Blanco CPP 4L", categoria: "Pinturas", stock: 3, precio: 48.00, pasillo: "Pasillo D - Estante 1" },
  ]);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "", categoria: "Construcción", stock: "", precio: "", pasillo: ""
  });

  const categorias = ["Todos", "Construcción", "Gasfitería", "Electricidad", "Herramientas", "Pinturas"];

  // Búsqueda por Voz usando Web Speech API
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz. Te recomendamos usar Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-PE';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  // Agregar nuevo producto
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;

    const item = {
      id: Date.now(),
      nombre: nuevoProducto.nombre,
      categoria: nuevoProducto.categoria,
      stock: parseInt(nuevoProducto.stock) || 0,
      precio: parseFloat(nuevoProducto.precio) || 0,
      pasillo: nuevoProducto.pasillo || "Almacén General"
    };

    setProductos([item, ...productos]);
    setNuevoProducto({ nombre: "", categoria: "Construcción", stock: "", precio: "", pasillo: "" });
    setShowAddModal(false);
  };

  // Filtrado de productos
  const productosFiltrados = productos.filter((prod) => {
    const coincideBusqueda = prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              prod.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const coincideCategoria = selectedCategory === "Todos" || prod.categoria === selectedCategory;
    return coincideBusqueda && coincideCategoria;
  });

  // Envío por WhatsApp
  const handleWhatsAppQuote = (prod) => {
    const mensaje = encodeURIComponent(`Hola, estoy interesado en cotizar el producto: ${prod.nombre} (S/ ${prod.precio.toFixed(2)}). ¿Tienen disponibilidad?`);
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">FerreStock</h1>
              <p className="text-xs text-slate-400">Control de Inventario & Ventas</p>
            </div>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-md active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Banner de estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Productos</p>
              <h2 className="text-2xl font-bold text-slate-800">{productos.length}</h2>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Alertas de Stock Bajo</p>
              <h2 className="text-2xl font-bold text-amber-600">
                {productos.filter(p => p.stock > 0 && p.stock <= 5).length}
              </h2>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Agotados</p>
              <h2 className="text-2xl font-bold text-rose-600">
                {productos.filter(p => p.stock === 0).length}
              </h2>
            </div>
            <XCircle className="w-8 h-8 text-rose-500" />
          </div>
        </div>

        {/* Buscador + Micrófono */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o herramienta..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            onClick={handleVoiceSearch}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-sm transition-all ${
              isListening 
                ? 'bg-rose-500 text-white border-rose-500 animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isListening ? "Escuchando..." : "Buscar por Voz"}</span>
          </button>
        </div>

        {/* Filtro de Categorías */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white hover:bg-slate-200 border border-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Catálogo de Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {productosFiltrados.map((prod) => (
            <div key={prod.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                    {prod.categoria}
                  </span>

                  {/* Estado de Stock */}
                  {prod.stock > 5 && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" /> Stock: {prod.stock}
                    </span>
                  )}
                  {prod.stock > 0 && prod.stock <= 5 && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5" /> Poco: {prod.stock}
                    </span>
                  )}
                  {prod.stock === 0 && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3.5 h-3.5" /> Agotado
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-800 text-base mb-1">{prod.nombre}</h3>
                <p className="text-xs text-slate-400 mb-4">{prod.pasillo}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Precio Unitario</span>
                  <span className="text-lg font-bold text-blue-600">S/ {prod.precio.toFixed(2)}</span>
                </div>

                <button 
                  onClick={() => handleWhatsAppQuote(prod)}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Cotizar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Modal para Agregar Producto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Agregar Producto al Inventario</h2>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600">Nombre del Producto</label>
                <input 
                  type="text" 
                  required 
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                  className="w-full p-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">Categoría</label>
                  <select 
                    value={nuevoProducto.categoria}
                    onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
                    className="w-full p-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {categorias.filter(c => c !== "Todos").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Ubicación / Pasillo</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Pasillo B"
                    value={nuevoProducto.pasillo}
                    onChange={(e) => setNuevoProducto({...nuevoProducto, pasillo: e.target.value})}
                    className="w-full p-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">Cantidad en Stock</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={nuevoProducto.stock}
                    onChange={(e) => setNuevoProducto({...nuevoProducto, stock: e.target.value})}
                    className="w-full p-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Precio (S/)</label>
                  <input 
                    type="number" 
                    step="0.10" 
                    required 
                    min="0"
                    value={nuevoProducto.precio}
                    onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
                    className="w-full p-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 border rounded-lg text-sm text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}