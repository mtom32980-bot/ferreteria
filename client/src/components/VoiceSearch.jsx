export default function VoiceSearch({ onResultado }) {
  const escuchar = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Tu navegador no soporta búsqueda por voz");
    const rec = new SR();
    rec.lang = "es-PE";
    rec.onresult = (e) => onResultado(e.results[0][0].transcript.replace(/\.$/, ""));
    rec.start();
  };

  return (
    <button
      type="button"
      onClick={escuchar}
      title="Buscar por voz"
      className="w-14 rounded-xl bg-orange-500/10 border border-orange-500/40 text-orange-400 hover:bg-orange-500/20 text-xl"
    >
      🎤
    </button>
  );
}