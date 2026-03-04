export default function ContactoPage() {
  return (
    <div className="container">
      <h1 className="title">Contacto</h1>
      <p className="subtitle">Escríbenos y te ayudamos a confirmar compatibilidad.</p>

      <div className="info-section">
        <h2>WhatsApp</h2>
        <p>
          <a className="whatsapp-btn" href="https://wa.me/593991657178" target="_blank" rel="noreferrer">
            Escribir por WhatsApp
          </a>
        </p>
        <p style={{ color: "#555" }}>

        </p>
      </div>

      <div className="info-section">
        <h2>Horario</h2>
        <ul>
          <li>Lunes a Sábado: Sabado hasta medio dia</li>
          <li>Domingo: CERRADO</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Ubicación</h2>
        <ul>
          <li>Ciudad: (Santo Domingo de los Tsáchilas)</li>
          <li>Dirección: (Santo Domingo, Av Esmeraldas Lote 6 y Rio Yuturi,frente a ERCO TIRE)</li>
        </ul>
      </div>
    </div>
  );
}