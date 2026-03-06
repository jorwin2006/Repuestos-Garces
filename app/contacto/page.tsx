import Link from "next/link";

export default function ContactoPage() {
  return (
    <div className="container">
      <h1 className="title">Contacto</h1>
      <p className="subtitle">
        Estamos aquí para ayudarte. Resolvemos tus dudas sobre compatibilidad, precios y envíos.
      </p>

      <div className="contact-grid">
        {/* Tarjeta de WhatsApp */}
        <div className="contact-card">
          <h2>📱 WhatsApp</h2>
          <ul>
            <li>📞 +593 99 165 7178</li>
            <li>⏱️ Respuesta rápida (generalmente en menos de 30 min)</li>
          </ul>
          <a
            href="https://wa.me/593991657178?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20un%20repuesto"
            className="whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Enviar mensaje ahora
          </a>
        </div>

        {/* Tarjeta de Horarios */}
        <div className="contact-card">
          <h2>🕒 Horario de atención</h2>
          <ul>
            <li>Lunes a viernes: 8:00 – 18:00</li>
            <li>Sábados: 8:00 – 12:30</li>
            <li>Domingos: Cerrado</li>
          </ul>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "12px" }}>
            * Fuera de horario puedes escribirnos por WhatsApp, te responderemos al siguiente día hábil.
          </p>
        </div>

        {/* Tarjeta de Ubicación */}
        <div className="contact-card">
          <h2>📍 Dirección</h2>
          <ul>
            <li>Santo Domingo de los Tsáchilas</li>
            <li>Av. Esmeraldas Lote 6 y Río Yuturi</li>
            <li>Frente a ERCO TIRE (frente a la llanta gigante)</li>
          </ul>
          <div className="map-placeholder">
            <span>📍</span>
            <p>Ver en Google Maps (próximamente mapa interactivo)</p>
          </div>
        </div>

        {/* Tarjeta de llamada a la acción */}
        <div className="contact-card">
          <h2>📦 ¿Listo para comprar?</h2>
          <p style={{ marginBottom: "20px" }}>
            Si ya tienes el código OEM o la referencia, envíanoslo por WhatsApp y te confirmaremos disponibilidad y
            precio.
          </p>
          <Link href="/envios" style={{ color: "var(--azul-principal)", fontWeight: "bold" }}>
            Ver opciones de envío →
          </Link>
        </div>
      </div>
    </div>
  );
}