import Link from "next/link";

export default function NosotrosPage() {
  return (
    <div className="container">
      <h1 className="title">Sobre Nosotros</h1>
      <p className="subtitle">
        Más de 15 años ofreciendo repuestos de calidad para el transporte pesado.
      </p>

      <div className="about-section">
        <h2>Nuestra historia</h2>
        <p>
          <strong>Repuestos Garcés</strong> nació en 2008 en Santo Domingo de los Tsáchilas con un objetivo claro:
          ofrecer repuestos originales y alternativos de alta calidad para camiones y buses. Lo que comenzó como un
          pequeño negocio familiar hoy es un referente en la zona, gracias a la confianza de cientos de transportistas
          que avalan nuestra experiencia.
        </p>
        <p>
          Sabemos que en el transporte cada minuto cuenta, por eso nos especializamos en <strong>compatibilidad precisa</strong>.
          No solo vendemos un repuesto; te asesoramos para que lleves la pieza correcta, evitando devoluciones y
          tiempos muertos.
        </p>
      </div>

      <div className="about-section">
        <h2>Nuestra filosofía</h2>
        <p>
          Creemos en el comercio honesto y en el acompañamiento al cliente. Por eso, antes de cada compra te
          recomendamos verificar el código OEM y las especificaciones técnicas. Si no estamos seguros de la
          compatibilidad, lo decimos abiertamente y te sugerimos alternativas.
        </p>
        <p>
          Esta forma de trabajar nos ha permitido construir relaciones duraderas con talleres mecánicos, flotas y
          propietarios independientes en todo Ecuador.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">+15</div>
          <div className="stat-label">años de experiencia</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">+500</div>
          <div className="stat-label">clientes satisfechos</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">consultas por WhatsApp</div>
        </div>
      </div>

      <div className="about-section">
        <h2>Compromiso con la calidad</h2>
        <p>
          Trabajamos con proveedores que cumplen normas internacionales. Cada repuesto que ofrecemos pasa por un
          filtro de calidad, y en caso de productos alternativos, indicamos claramente su origen para que tomes la
          mejor decisión.
        </p>
        <p>
          <Link href="/contacto" style={{ color: "var(--azul-principal)", fontWeight: "bold" }}>
            ¿Tienes dudas sobre un repuesto? Contáctanos →
          </Link>
        </p>
      </div>
    </div>
  );
}