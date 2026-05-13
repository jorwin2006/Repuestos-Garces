import Link from "next/link";

export default function NosotrosPage() {
  return (
    <main className="premium-page nosotros-page-fix">
      <div className="premium-content">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
          <div className="premium-hero premium-about-shell p-5 sm:p-7 md:p-10">
            <div className="premium-about-header">
              <p className="premium-about-eyebrow">Repuestos Garcés</p>

              <h1 className="premium-section-title premium-about-title">
                Más de 15 años ayudando al transporte pesado
              </h1>

              <p className="premium-about-lead">
                Repuestos de calidad, compatibilidad precisa y atención cercana
                para camiones y buses en Ecuador.
              </p>
            </div>

            <div className="premium-about-trust">
              <span className="premium-about-pill">Atención rápida</span>
              <span className="premium-about-pill">Consulta OEM</span>
              <span className="premium-about-pill">Envíos nacionales</span>
            </div>

            <div className="premium-about-grid">
              <article className="premium-card premium-about-card">
                <h2 className="premium-about-subtitle">Nuestra historia</h2>

                <p className="premium-muted">
                  <strong>Repuestos Garcés</strong> nació en 2008 en Santo
                  Domingo de los Tsáchilas con un objetivo claro: ofrecer
                  repuestos originales y alternativos de alta calidad para
                  camiones y buses. Lo que comenzó como un pequeño negocio
                  familiar hoy es un referente en la zona, gracias a la
                  confianza de cientos de transportistas que avalan nuestra
                  experiencia.
                </p>

                <p className="premium-muted">
                  Sabemos que en el transporte cada minuto cuenta, por eso nos
                  especializamos en <strong>soluciones precisas</strong>. No solo
                  vendemos un repuesto; te asesoramos para que lleves la solución
                  perfecta a tu necesidad.
                </p>
              </article>

              <article className="premium-card premium-about-card">
                <h2 className="premium-about-subtitle">Nuestra filosofía</h2>

                <p className="premium-muted">
                  Creemos en el comercio honesto y en el acompañamiento al
                  cliente. Por eso, antes de cada compra te recomendamos
                  verificar el código de la parte y las especificaciones
                  técnicas. Si no estamos seguros de la solución, lo decimos
                  abiertamente y te sugerimos alternativas.
                </p>

                <p className="premium-muted">
                  Esta forma de trabajar nos ha permitido construir relaciones
                  duraderas con talleres mecánicos, flotas y propietarios de
                  vehículos a nivel nacional.
                </p>
              </article>
            </div>

            <div className="premium-about-stats">
              <div className="premium-card premium-about-stat">
                <div className="premium-about-stat-number">+15</div>
                <div className="premium-about-stat-label">
                  años de experiencia
                </div>
              </div>

              <div className="premium-card premium-about-stat">
                <div className="premium-about-stat-number">+5000</div>
                <div className="premium-about-stat-label">
                  clientes satisfechos
                </div>
              </div>

              <div className="premium-card premium-about-stat">
                <div className="premium-about-stat-number">24/7</div>
                <div className="premium-about-stat-label">
                  consultas por WhatsApp
                </div>
              </div>
            </div>

            <article className="premium-card premium-about-card premium-about-cta-card">
              <h2 className="premium-about-subtitle">
                Compromiso con la calidad
              </h2>

              <p className="premium-muted">
                Trabajamos con proveedores serios y responsables a nivel
                nacional. Cada repuesto te lo ofrecemos con garantía y respaldo
                del fabricante y, en caso de productos alternativos, damos
                alternativas al mejor precio.
              </p>

              <div className="premium-about-cta">
                <p className="premium-about-cta-text">
                  ¿Necesitas ayuda para identificar un repuesto?
                </p>

                <Link
                  href="/contacto"
                  className="premium-button-blue premium-about-link"
                >
                  Contáctanos
                </Link>
              </div>
            </article>
          </div>
        </section>
      </div>

      <style>{`
        /* =========================================================
           CORRECCIÓN LOCAL PARA /NOSOTROS
           MODO CLARO Y MODO OSCURO
           ========================================================= */

        .nosotros-page-fix {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 32rem),
            linear-gradient(180deg, #f8fafc 0%, #eef4fb 100%) !important;
          color: #0f172a !important;
        }

        .nosotros-page-fix::before,
        .nosotros-page-fix::after {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        .nosotros-page-fix .premium-content {
          position: relative;
          z-index: 1;
        }

        .nosotros-page-fix .premium-hero,
        .nosotros-page-fix .premium-card {
          background: rgba(255, 255, 255, 0.96) !important;
          color: #0f172a !important;
          border: 1px solid rgba(15, 23, 42, 0.08) !important;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.10) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        .nosotros-page-fix .premium-about-eyebrow {
          color: #2563eb !important;
          text-shadow: none !important;
        }

        .nosotros-page-fix .premium-section-title,
        .nosotros-page-fix .premium-about-title,
        .nosotros-page-fix .premium-about-subtitle {
          color: #0f172a !important;
          text-shadow: none !important;
        }

        .nosotros-page-fix .premium-about-lead,
        .nosotros-page-fix .premium-muted,
        .nosotros-page-fix .premium-about-stat-label {
          color: #475569 !important;
          text-shadow: none !important;
        }

        .nosotros-page-fix .premium-muted strong {
          color: #0f172a !important;
        }

        .nosotros-page-fix .premium-about-pill {
          background: #eff6ff !important;
          color: #1d4ed8 !important;
          border: 1px solid rgba(37, 99, 235, 0.20) !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        .nosotros-page-fix .premium-about-stat-number {
          color: #3b82f6 !important;
          text-shadow: none !important;
        }

        .nosotros-page-fix .premium-about-cta {
          border-top: 1px solid rgba(15, 23, 42, 0.08) !important;
        }

        .nosotros-page-fix .premium-about-cta-text {
          color: #0f172a !important;
          text-shadow: none !important;
        }

        .nosotros-page-fix .premium-about-link {
          background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
          color: #ffffff !important;
          border: none !important;
          box-shadow: 0 14px 28px rgba(37, 99, 235, 0.25) !important;
        }

        @media (prefers-color-scheme: dark) {
          html:not([data-theme="light"]) .nosotros-page-fix {
            background:
              radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 34rem),
              linear-gradient(180deg, #020617 0%, #0f172a 100%) !important;
            color: #f8fafc !important;
          }

          html:not([data-theme="light"]) .nosotros-page-fix .premium-hero,
          html:not([data-theme="light"]) .nosotros-page-fix .premium-card {
            background: rgba(15, 23, 42, 0.86) !important;
            color: #f8fafc !important;
            border: 1px solid rgba(255, 255, 255, 0.10) !important;
            box-shadow: 0 22px 55px rgba(0, 0, 0, 0.35) !important;
            backdrop-filter: blur(18px) !important;
            -webkit-backdrop-filter: blur(18px) !important;
          }

          html:not([data-theme="light"]) .nosotros-page-fix .premium-section-title,
          html:not([data-theme="light"]) .nosotros-page-fix .premium-about-title,
          html:not([data-theme="light"]) .nosotros-page-fix .premium-about-subtitle,
          html:not([data-theme="light"]) .nosotros-page-fix .premium-muted strong,
          html:not([data-theme="light"]) .nosotros-page-fix .premium-about-cta-text {
            color: #ffffff !important;
          }

          html:not([data-theme="light"]) .nosotros-page-fix .premium-about-lead,
          html:not([data-theme="light"]) .nosotros-page-fix .premium-muted,
          html:not([data-theme="light"]) .nosotros-page-fix .premium-about-stat-label {
            color: rgba(226, 232, 240, 0.88) !important;
          }

          html:not([data-theme="light"]) .nosotros-page-fix .premium-about-pill {
            background: rgba(255, 255, 255, 0.08) !important;
            color: rgba(241, 245, 249, 0.95) !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
          }

          html:not([data-theme="light"]) .nosotros-page-fix .premium-about-cta {
            border-top: 1px solid rgba(255, 255, 255, 0.10) !important;
          }
        }

        html[data-theme="dark"] .nosotros-page-fix {
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 34rem),
            linear-gradient(180deg, #020617 0%, #0f172a 100%) !important;
          color: #f8fafc !important;
        }

        html[data-theme="dark"] .nosotros-page-fix .premium-hero,
        html[data-theme="dark"] .nosotros-page-fix .premium-card {
          background: rgba(15, 23, 42, 0.86) !important;
          color: #f8fafc !important;
          border: 1px solid rgba(255, 255, 255, 0.10) !important;
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.35) !important;
          backdrop-filter: blur(18px) !important;
          -webkit-backdrop-filter: blur(18px) !important;
        }

        html[data-theme="dark"] .nosotros-page-fix .premium-section-title,
        html[data-theme="dark"] .nosotros-page-fix .premium-about-title,
        html[data-theme="dark"] .nosotros-page-fix .premium-about-subtitle,
        html[data-theme="dark"] .nosotros-page-fix .premium-muted strong,
        html[data-theme="dark"] .nosotros-page-fix .premium-about-cta-text {
          color: #ffffff !important;
        }

        html[data-theme="dark"] .nosotros-page-fix .premium-about-lead,
        html[data-theme="dark"] .nosotros-page-fix .premium-muted,
        html[data-theme="dark"] .nosotros-page-fix .premium-about-stat-label {
          color: rgba(226, 232, 240, 0.88) !important;
        }

        html[data-theme="dark"] .nosotros-page-fix .premium-about-pill {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(241, 245, 249, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
        }

        html[data-theme="dark"] .nosotros-page-fix .premium-about-cta {
          border-top: 1px solid rgba(255, 255, 255, 0.10) !important;
        }

        html[data-theme="light"] .nosotros-page-fix {
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 32rem),
            linear-gradient(180deg, #f8fafc 0%, #eef4fb 100%) !important;
          color: #0f172a !important;
        }

        html[data-theme="light"] .nosotros-page-fix .premium-hero,
        html[data-theme="light"] .nosotros-page-fix .premium-card {
          background: rgba(255, 255, 255, 0.96) !important;
          color: #0f172a !important;
          border: 1px solid rgba(15, 23, 42, 0.08) !important;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.10) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        html[data-theme="light"] .nosotros-page-fix .premium-section-title,
        html[data-theme="light"] .nosotros-page-fix .premium-about-title,
        html[data-theme="light"] .nosotros-page-fix .premium-about-subtitle,
        html[data-theme="light"] .nosotros-page-fix .premium-muted strong,
        html[data-theme="light"] .nosotros-page-fix .premium-about-cta-text {
          color: #0f172a !important;
        }

        html[data-theme="light"] .nosotros-page-fix .premium-about-lead,
        html[data-theme="light"] .nosotros-page-fix .premium-muted,
        html[data-theme="light"] .nosotros-page-fix .premium-about-stat-label {
          color: #475569 !important;
        }

        @media (max-width: 768px) {
          .nosotros-page-fix .premium-about-grid,
          .nosotros-page-fix .premium-about-stats {
            grid-template-columns: 1fr !important;
          }

          .nosotros-page-fix .premium-about-title {
            font-size: clamp(2rem, 10vw, 3rem) !important;
          }

          .nosotros-page-fix .premium-about-card {
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </main>
  );
}