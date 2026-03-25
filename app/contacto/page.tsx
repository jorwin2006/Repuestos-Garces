import Link from "next/link";

const WHATSAPP_URL =
  "https://wa.me/593991657178?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20un%20repuesto";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5642.40463805264!2d-79.17119474056771!3d-0.24251020944873566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sec!4v1774457658513!5m2!1ses-419!2sec";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=-0.2421993368006812,-79.17093369892167";

export default function ContactoPage() {
  return (
    <div className="container contact-page">
      <section className="contact-hero">
        <div className="contact-hero-copy">
          <span className="contact-eyebrow">CONTACTO</span>

          <h1 className="title contact-title">Estamos listos para ayudarte</h1>

          <p className="subtitle contact-subtitle">
            Te asesoramos en compatibilidad, stock, precios y envíos para que
            encuentres el repuesto correcto sin perder tiempo.
          </p>

          <div className="contact-hero-actions">
            <a
              href={WHATSAPP_URL}
              className="whatsapp-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Escribir por WhatsApp
            </a>

            <a href="#ubicacion" className="contact-secondary-btn contact-secondary-btn--dark">
              Ver ubicación
            </a>
          </div>
        </div>

        <div className="contact-highlight">
          <span className="contact-badge">Atención rápida</span>
          <h2>Asesoría antes de comprar</h2>
          <p>
            Validamos contigo el código OEM, la compatibilidad y la mejor forma
            de entrega antes de confirmar el pedido.
          </p>

          <div className="contact-pill-list">
            <span>Compatibilidad</span>
            <span>Código OEM</span>
            <span>Stock</span>
            <span>Envíos</span>
          </div>
        </div>
      </section>

      <section className="contact-grid contact-grid--enhanced">
        <article className="contact-card contact-card--accent">
          <h2>WhatsApp</h2>

          <ul className="contact-detail-list">
            <li>
              <span className="contact-icon">📱</span>
              <div>
                <strong>+593 99 165 7178</strong>
                <p>Respuesta rápida dentro del horario de atención.</p>
              </div>
            </li>

            <li>
              <span className="contact-icon">💬</span>
              <div>
                <strong>Consulta directa</strong>
                <p>
                  Envíanos foto, referencia o código OEM y revisamos
                  disponibilidad.
                </p>
              </div>
            </li>
          </ul>

          <a
            href={WHATSAPP_URL}
            className="whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Enviar mensaje ahora
          </a>
        </article>

<article className="contact-card contact-card--schedule-video">
  <video
    className="contact-card-video"
    autoPlay
    muted
    loop
    playsInline
  >
    <source src="/videos/reloj.mp4" type="video/mp4" />
  </video>

  <div className="contact-card-video-overlay"></div>

  <div className="contact-card-content">
    <h2>Horario de atención</h2>

    <ul className="contact-detail-list">
      <li>
        <span className="contact-icon">🕒</span>
        <div>
          <strong>Lunes a viernes</strong>
          <p>8:00 – 18:00</p>
        </div>
      </li>

      <li>
        <span className="contact-icon">🛠️</span>
        <div>
          <strong>Sábados</strong>
          <p>8:00 – 12:30</p>
        </div>
      </li>

      <li>
        <span className="contact-icon">🌙</span>
        <div>
            <strong>Fuera de horario</strong>
          <p>
            Puedes escribirnos por WhatsApp y te responderemos al
            siguiente día hábil.
          </p>
        </div>
      </li>
    </ul>
  </div>
</article>
      </section>

      <section id="ubicacion" className="contact-location-card">
        <div className="contact-location-copy">
          <span className="contact-section-label">UBICACIÓN</span>

          <h2>Visítanos en Santo Domingo</h2>

          <p>
            Nuestro local está ubicado en un punto fácil de identificar para que
            retires tu repuesto con rapidez.
          </p>

          <ul className="contact-detail-list">
            <li>
              <span className="contact-icon">📍</span>
              <div>
                <strong>Dirección</strong>
                <p>Av. Esmeraldas Lote 6 y Río Yuturi</p>
              </div>
            </li>

            <li>
              <span className="contact-icon">🏙️</span>
              <div>
                <strong>Ciudad</strong>
                <p>Santo Domingo de los Tsáchilas</p>
              </div>
            </li>

            <li>
              <span className="contact-icon">🚛</span>
              <div>
                <strong>Referencia</strong>
                <p>Frente a ERCO TIRE (frente a la llanta gigante)</p>
              </div>
            </li>
          </ul>

          <div className="contact-location-actions">
            <a
              href={MAPS_URL}
              className="contact-secondary-btn contact-secondary-btn--light"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir en Google Maps
            </a>

            <Link href="/envios" className="contact-text-link">
              Ver opciones de envío →
            </Link>
          </div>
        </div>

   <div className="contact-map-wrap">
     <iframe
       title="Ubicación de Repuestos Garcés"
       src={MAP_EMBED_URL}
       className="contact-map"
       loading="lazy"
       referrerPolicy="no-referrer-when-downgrade"
       allowFullScreen
     />
     <div className="contact-map-pin" aria-hidden="true">
     <span className="contact-map-pin-dot"></span>
    </div>
</div>
      </section>

      <section className="contact-bottom-cta">
        <h2>¿Ya tienes la referencia del repuesto?</h2>
        <p>
          Envíanos el código OEM o una foto por WhatsApp y te ayudamos a
          confirmar la pieza correcta.
        </p>

        <a
          href={WHATSAPP_URL}
          className="whatsapp-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cotizar ahora
        </a>
      </section>
    </div>
  );
}