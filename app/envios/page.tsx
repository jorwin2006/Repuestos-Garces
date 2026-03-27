import Link from "next/link";

export default function EnviosPage() {
  return (
    <main className="premium-page">
      <div className="premium-content">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
          <div className="premium-hero premium-shipping-shell p-5 sm:p-7 md:p-10">
            <div className="premium-shipping-header">
              <p className="premium-shipping-eyebrow">Envíos y entregas</p>
              <h1 className="premium-section-title premium-shipping-title">
                Recibe tu repuesto de la forma que más te convenga
              </h1>
              <p className="premium-shipping-lead">
                Te ofrecemos opciones rápidas y claras para retiro, delivery local
                y envíos nacionales. Elige la modalidad que mejor se adapte a tu
                necesidad.
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
                        Dirección: Av. Esmeraldas Lote 6 y Río Yuturi (frente a
                        ERCO TIRE).
                      </li>
                      <li>
                        Horario: Lunes a viernes 8:00–18:00, sábados 8:00–12:30.
                      </li>
                      <li>
                        <strong>Ventaja:</strong> Entrega inmediata y sin costo.
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
          El costo depende de la zona y se coordina directamente por
          WhatsApp.
        </li>
        <li>
          Generalmente se entrega el mismo día si el pedido se confirma
          antes de las 15:00.
        </li>
        <li>
          <strong>Importante:</strong> El pago debe estar confirmado
          antes del envío.
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
            El cliente debe retirar el paquete en el terminal terrestre
            de su ciudad
          </strong>{" "}
          (ej: Terminal de Guayaquil, Terminal de Quito, etc.).
        </li>
        <li>
          El tiempo de tránsito es de 24 a 48 horas, dependiendo de la
          ruta.
        </li>
        <li>
          Te proporcionamos el número de guía para que realices el
          seguimiento.
        </li>
        <li>
          El costo del envío es asumido por el cliente y se paga al
          recibir (o se puede incluir en la factura si se coordina).
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
    </main>
  );
}