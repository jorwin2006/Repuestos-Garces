import Link from "next/link";

export default function NosotrosPage() {
  return (
    <main className="premium-page">
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
                  especializamos en <strong>compatibilidad precisa</strong>. No
                  solo vendemos un repuesto; te asesoramos para que lleves la
                  pieza correcta, evitando devoluciones y tiempos muertos.
                </p>
              </article>

              <article className="premium-card premium-about-card">
                <h2 className="premium-about-subtitle">Nuestra filosofía</h2>
                <p className="premium-muted">
                  Creemos en el comercio honesto y en el acompañamiento al
                  cliente. Por eso, antes de cada compra te recomendamos
                  verificar el código OEM y las especificaciones técnicas. Si no
                  estamos seguros de la compatibilidad, lo decimos abiertamente
                  y te sugerimos alternativas.
                </p>
                <p className="premium-muted">
                  Esta forma de trabajar nos ha permitido construir relaciones
                  duraderas con talleres mecánicos, flotas y propietarios
                  independientes en todo Ecuador.
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
                <div className="premium-about-stat-number">+500</div>
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
              <h2 className="premium-about-subtitle">Compromiso con la calidad</h2>
              <p className="premium-muted">
                Trabajamos con proveedores que cumplen normas internacionales.
                Cada repuesto que ofrecemos pasa por un filtro de calidad, y en
                caso de productos alternativos, indicamos claramente su origen
                para que tomes la mejor decisión.
              </p>

              <div className="premium-about-cta">
                <p className="premium-about-cta-text">
                  ¿Necesitas ayuda para identificar un repuesto?
                </p>
                <Link href="/contacto" className="premium-button-blue premium-about-link">
                  Contáctanos
                </Link>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}