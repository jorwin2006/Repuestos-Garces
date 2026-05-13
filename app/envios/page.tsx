import Link from "next/link";

export default function EnviosPage() {
  return (
    <main className="premium-page envios-page-fix">
      <div className="premium-content">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
          <div className="premium-hero premium-shipping-shell p-5 sm:p-7 md:p-10">
            <div className="premium-shipping-header">
              <p className="premium-shipping-eyebrow">Envíos y entregas</p>

              <h1 className="premium-section-title premium-shipping-title">
                Recibe tu repuesto de la forma que más te convenga
              </h1>

              <p className="premium-shipping-lead">
                Te ofrecemos opciones rápidas y claras para retiro, delivery
                local y envíos nacionales. Elige la modalidad que mejor se
                adapte a tu necesidad.
              </p>
            </div>

            <div className="premium-shipping-pills">
              <span className="premium-shipping-pill">Retiro en local</span>
              <span className="premium-shipping-pill">Delivery local</span>
              <span className="premium-shipping-pill">Envíos nacionales</span>
            </div>

            <div className="premium-shipping-grid">
              <article className="premium-card premium-shipping-card premium-shipping-card-image">
                <div className="premium-shipping-card-bg">
                  <div className="premium-shipping-card-overlay" />

                  <div className="premium-shipping-card-content">
                    <h2 className="premium-shipping-subtitle">
                      <span className="premium-shipping-icon">🚐</span>
                      Retiro en local
                    </h2>

                    <ul className="premium-shipping-list">
                      <li>
                        Disponible una vez confirmada la disponibilidad del
                        producto.
                      </li>
                      <li>
                        Dirección: Av. Esmeraldas Lote 6 y Río Yuturi frente a
                        ERCO TIRE.
                      </li>
                      <li>
                        Horario: lunes a viernes 8:00–18:00, sábados
                        8:00–13:30.
                      </li>
                      <li>
                        <strong>Ventaja:</strong> Entrega inmediata y sin
                        costo.
                      </li>
                    </ul>
                  </div>
                </div>
              </article>

              <article className="premium-card premium-shipping-card premium-shipping-card-image premium-shipping-card-image-delivery">
                <div className="premium-shipping-card-bg premium-shipping-card-bg-delivery">
                  <div className="premium-shipping-card-overlay premium-shipping-card-overlay-delivery" />

                  <div className="premium-shipping-card-content">
                    <h2 className="premium-shipping-subtitle">
                      <span className="premium-shipping-icon">🛵</span>
                      Delivery local
                    </h2>

                    <ul className="premium-shipping-list">
                      <li>
                        Realizamos entregas dentro de Santo Domingo a través de
                        mensajería.
                      </li>
                      <li>
                        El costo depende de la zona y se coordina directamente
                        por WhatsApp.
                      </li>
                      <li>
                        Generalmente se entrega el mismo día si el pedido se
                        confirma antes de las 15:00.
                      </li>
                      <li>
                        <strong>Importante:</strong> El pago debe estar
                        confirmado antes del envío.
                      </li>
                    </ul>
                  </div>
                </div>
              </article>

              <article className="premium-card premium-shipping-card premium-shipping-card-full premium-shipping-card-image premium-shipping-card-image-national">
                <div className="premium-shipping-card-bg premium-shipping-card-bg-national">
                  <div className="premium-shipping-card-overlay premium-shipping-card-overlay-national" />

                  <div className="premium-shipping-card-content">
                    <h2 className="premium-shipping-subtitle">
                      <span className="premium-shipping-icon">🚌</span>
                      Envíos nacionales por encomienda
                    </h2>

                    <ul className="premium-shipping-list">
                      <li>
                        Despachamos tu pedido a cualquier provincia del Ecuador
                        mediante encomienda en buses interprovinciales.
                      </li>
                      <li>
                        <strong>
                          El cliente debe retirar el paquete en el terminal
                          terrestre de su ciudad
                        </strong>{" "}
                        como Terminal de Guayaquil, Terminal de Quito, entre
                        otros.
                      </li>
                      <li>
                        El tiempo de tránsito es de 24 a 48 horas, dependiendo
                        de la ruta.
                      </li>
                      <li>
                        Te proporcionamos el número de guía para que realices el
                        seguimiento.
                      </li>
                      <li>
                        El costo del envío es asumido por el cliente y se paga
                        al recibir, o se puede incluir en la factura si se
                        coordina.
                      </li>
                    </ul>
                  </div>
                </div>
              </article>

              <article className="premium-card premium-shipping-card premium-shipping-card-full">
                <h2 className="premium-shipping-subtitle">
                  <span className="premium-shipping-icon">📌</span>
                  Recomendaciones importantes
                </h2>

                <ul className="premium-shipping-list">
                  <li>
                    Antes de comprar, verifica con nosotros el{" "}
                    <strong>código OEM y la compatibilidad</strong> con tu
                    vehículo.
                  </li>
                  <li>
                    Para envíos nacionales, asegúrate de contar con alguien que
                    pueda retirar en el terminal.
                  </li>
                  <li>
                    Una vez despachado, te enviaremos una foto del paquete y la
                    guía por WhatsApp.
                  </li>
                </ul>
              </article>
            </div>

            <div className="premium-shipping-cta">
              <div>
                <p className="premium-shipping-cta-title">
                  ¿Tienes dudas sobre el tipo de envío?
                </p>

                <p className="premium-muted">
                  Escríbenos y te ayudamos a elegir la mejor opción para recibir
                  tu repuesto.
                </p>
              </div>

              <a
                href="https://wa.me/593991657178?text=Hola%2C%20quiero%20consultar%20sobre%20env%C3%ADos%20de%20un%20repuesto"
                className="whatsapp-btn premium-shipping-whatsapp-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar por WhatsApp
              </a>
            </div>

            <div className="premium-shipping-footer-link">
              <Link
                href="/contacto"
                className="premium-button-blue premium-shipping-contact-link"
              >
                Ir a Contacto
              </Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        /* =========================================================
           CORRECCIÓN LOCAL PARA /ENVIOS
           MODO CLARO Y MODO OSCURO
           ========================================================= */

        .envios-page-fix {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 32rem),
            linear-gradient(180deg, #f8fafc 0%, #eef4fb 100%) !important;
          color: #0f172a !important;
        }

        .envios-page-fix::before,
        .envios-page-fix::after {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        .envios-page-fix .premium-content {
          position: relative;
          z-index: 1;
        }

        .envios-page-fix .premium-hero,
        .envios-page-fix .premium-card:not(.premium-shipping-card-image) {
          background: rgba(255, 255, 255, 0.96) !important;
          color: #0f172a !important;
          border: 1px solid rgba(15, 23, 42, 0.08) !important;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.10) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        .envios-page-fix .premium-shipping-eyebrow {
          color: #2563eb !important;
          text-shadow: none !important;
        }

        .envios-page-fix .premium-section-title,
        .envios-page-fix .premium-shipping-title,
        .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-subtitle {
          color: #0f172a !important;
          text-shadow: none !important;
        }

        .envios-page-fix .premium-shipping-lead,
        .envios-page-fix .premium-muted,
        .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-list {
          color: #475569 !important;
          text-shadow: none !important;
        }

        .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-list strong {
          color: #0f172a !important;
        }

        .envios-page-fix .premium-shipping-pill {
          background: #eff6ff !important;
          color: #1d4ed8 !important;
          border: 1px solid rgba(37, 99, 235, 0.20) !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        .envios-page-fix .premium-shipping-cta {
          border-top: 1px solid rgba(15, 23, 42, 0.08) !important;
        }

        .envios-page-fix .premium-shipping-cta-title {
          color: #0f172a !important;
          text-shadow: none !important;
        }

        .envios-page-fix .premium-shipping-contact-link,
        .envios-page-fix .premium-shipping-whatsapp-btn {
          color: #ffffff !important;
          border: none !important;
          box-shadow: 0 14px 28px rgba(37, 99, 235, 0.25) !important;
        }

        /* Tarjetas con imagen: siempre texto blanco y overlay oscuro */
        .envios-page-fix .premium-shipping-card-image {
          background: transparent !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.10) !important;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.22) !important;
          overflow: hidden !important;
        }

        .envios-page-fix .premium-shipping-card-image .premium-shipping-subtitle,
        .envios-page-fix .premium-shipping-card-image .premium-shipping-list,
        .envios-page-fix .premium-shipping-card-image .premium-shipping-list strong {
          color: #ffffff !important;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.48) !important;
        }

        .envios-page-fix .premium-shipping-card-image .premium-shipping-list {
          color: rgba(248, 250, 252, 0.94) !important;
        }

        .envios-page-fix .premium-shipping-card-overlay,
        .envios-page-fix .premium-shipping-card-overlay-delivery,
        .envios-page-fix .premium-shipping-card-overlay-national {
          background:
            linear-gradient(135deg, rgba(2, 6, 23, 0.82), rgba(3, 17, 45, 0.68)),
            linear-gradient(180deg, rgba(15, 23, 42, 0.12), rgba(15, 23, 42, 0.72)) !important;
        }

        @media (prefers-color-scheme: dark) {
          html:not([data-theme="light"]) .envios-page-fix {
            background:
              radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 34rem),
              linear-gradient(180deg, #020617 0%, #0f172a 100%) !important;
            color: #f8fafc !important;
          }

          html:not([data-theme="light"]) .envios-page-fix .premium-hero,
          html:not([data-theme="light"]) .envios-page-fix .premium-card:not(.premium-shipping-card-image) {
            background: rgba(15, 23, 42, 0.86) !important;
            color: #f8fafc !important;
            border: 1px solid rgba(255, 255, 255, 0.10) !important;
            box-shadow: 0 22px 55px rgba(0, 0, 0, 0.35) !important;
            backdrop-filter: blur(18px) !important;
            -webkit-backdrop-filter: blur(18px) !important;
          }

          html:not([data-theme="light"]) .envios-page-fix .premium-section-title,
          html:not([data-theme="light"]) .envios-page-fix .premium-shipping-title,
          html:not([data-theme="light"]) .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-subtitle,
          html:not([data-theme="light"]) .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-list strong,
          html:not([data-theme="light"]) .envios-page-fix .premium-shipping-cta-title {
            color: #ffffff !important;
          }

          html:not([data-theme="light"]) .envios-page-fix .premium-shipping-lead,
          html:not([data-theme="light"]) .envios-page-fix .premium-muted,
          html:not([data-theme="light"]) .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-list {
            color: rgba(226, 232, 240, 0.88) !important;
          }

          html:not([data-theme="light"]) .envios-page-fix .premium-shipping-pill {
            background: rgba(255, 255, 255, 0.08) !important;
            color: rgba(241, 245, 249, 0.95) !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
          }

          html:not([data-theme="light"]) .envios-page-fix .premium-shipping-cta {
            border-top: 1px solid rgba(255, 255, 255, 0.10) !important;
          }
        }

        html[data-theme="dark"] .envios-page-fix {
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 34rem),
            linear-gradient(180deg, #020617 0%, #0f172a 100%) !important;
          color: #f8fafc !important;
        }

        html[data-theme="dark"] .envios-page-fix .premium-hero,
        html[data-theme="dark"] .envios-page-fix .premium-card:not(.premium-shipping-card-image) {
          background: rgba(15, 23, 42, 0.86) !important;
          color: #f8fafc !important;
          border: 1px solid rgba(255, 255, 255, 0.10) !important;
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.35) !important;
          backdrop-filter: blur(18px) !important;
          -webkit-backdrop-filter: blur(18px) !important;
        }

        html[data-theme="dark"] .envios-page-fix .premium-section-title,
        html[data-theme="dark"] .envios-page-fix .premium-shipping-title,
        html[data-theme="dark"] .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-subtitle,
        html[data-theme="dark"] .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-list strong,
        html[data-theme="dark"] .envios-page-fix .premium-shipping-cta-title {
          color: #ffffff !important;
        }

        html[data-theme="dark"] .envios-page-fix .premium-shipping-lead,
        html[data-theme="dark"] .envios-page-fix .premium-muted,
        html[data-theme="dark"] .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-list {
          color: rgba(226, 232, 240, 0.88) !important;
        }

        html[data-theme="dark"] .envios-page-fix .premium-shipping-pill {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(241, 245, 249, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
        }

        html[data-theme="dark"] .envios-page-fix .premium-shipping-cta {
          border-top: 1px solid rgba(255, 255, 255, 0.10) !important;
        }

        html[data-theme="light"] .envios-page-fix {
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 32rem),
            linear-gradient(180deg, #f8fafc 0%, #eef4fb 100%) !important;
          color: #0f172a !important;
        }

        html[data-theme="light"] .envios-page-fix .premium-hero,
        html[data-theme="light"] .envios-page-fix .premium-card:not(.premium-shipping-card-image) {
          background: rgba(255, 255, 255, 0.96) !important;
          color: #0f172a !important;
          border: 1px solid rgba(15, 23, 42, 0.08) !important;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.10) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        html[data-theme="light"] .envios-page-fix .premium-section-title,
        html[data-theme="light"] .envios-page-fix .premium-shipping-title,
        html[data-theme="light"] .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-subtitle,
        html[data-theme="light"] .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-list strong,
        html[data-theme="light"] .envios-page-fix .premium-shipping-cta-title {
          color: #0f172a !important;
        }

        html[data-theme="light"] .envios-page-fix .premium-shipping-lead,
        html[data-theme="light"] .envios-page-fix .premium-muted,
        html[data-theme="light"] .envios-page-fix .premium-shipping-card:not(.premium-shipping-card-image) .premium-shipping-list {
          color: #475569 !important;
        }

        @media (max-width: 900px) {
          .envios-page-fix .premium-shipping-grid {
            grid-template-columns: 1fr !important;
          }

          .envios-page-fix .premium-shipping-card-full {
            grid-column: auto !important;
          }
        }

        @media (max-width: 768px) {
          .envios-page-fix .premium-shipping-title {
            font-size: clamp(2rem, 10vw, 3rem) !important;
          }

          .envios-page-fix .premium-shipping-card {
            padding: 1.15rem !important;
          }

          .envios-page-fix .premium-shipping-card-image {
            padding: 0 !important;
          }

          .envios-page-fix .premium-shipping-card-content {
            padding: 1.15rem !important;
          }

          .envios-page-fix .premium-shipping-whatsapp-btn,
          .envios-page-fix .premium-shipping-contact-link {
            width: 100% !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}