// Header de marca reutilizable. Variante "compact" para pantallas internas.
export default function BrandHeader({ user, compact = false }) {
  if (compact) {
    return (
      <header className="brand-header compact">
        <h1>Invictory_AI</h1>
      </header>
    );
  }
  return (
    <header className="brand-header">
      <span className="badge">Colsubsidio x 30X</span>
      <h1>Invictory_AI</h1>
      <p className="subtitle">Captura inteligente de inventario hotelero</p>
      <p className="greeting">Hola, {user?.first_name || "Operario"} 👋</p>
    </header>
  );
}
