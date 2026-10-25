import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="announce" role="region" aria-label="Aviso promocional">
      <div className="wrap announce-wrap">
        <p className="announce-text">
          🔥 COLECCIÓN 2026 — Envío sin costo a todo Colombia en pedidos desde $399.900 · Garantía de 1 año incluida
        </p>
        <button
          type="button"
          className="announce-close"
          onClick={() => setOpen(false)}
          aria-label="Cerrar anuncio"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
