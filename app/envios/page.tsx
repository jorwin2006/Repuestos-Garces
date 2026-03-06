export default function EnviosPage() {
  return (
    <div className="container">
      <h1 className="title">Envíos y entregas</h1>
      <p className="subtitle">
        Te ofrecemos distintas formas de recibir tu repuesto. Elige la que más te convenga.
      </p>

      <div className="info-section">
        <h2>🚐 1. Retiro en local (Santo Domingo)</h2>
        <ul>
          <li>Disponible una vez confirmada la disponibilidad del producto.</li>
          <li>Dirección: Av. Esmeraldas Lote 6 y Río Yuturi (frente a ERCO TIRE).</li>
          <li>Horario: Lunes a viernes 8:00–18:00, sábados 8:00–12:30.</li>
          <li><strong>Ventaja:</strong> Entrega inmediata y sin costo.</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>🛵 2. Delivery local (Santo Domingo)</h2>
        <ul>
          <li>Realizamos entregas dentro de la ciudad a través de mensajería.</li>
          <li>El costo depende de la zona y se coordina directamente por WhatsApp.</li>
          <li>Generalmente se entrega el mismo día si el pedido se confirma antes de las 15:00.</li>
          <li><strong>Importante:</strong> El pago debe estar confirmado antes del envío.</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>🚌 3. Envíos nacionales por encomienda</h2>
        <ul>
          <li>Despachamos tu pedido a cualquier provincia del Ecuador mediante encomienda en buses interprovinciales.</li>
          <li><strong>El cliente debe retirar el paquete en el terminal terrestre de su ciudad</strong> (ej: Terminal de Guayaquil, Terminal de Quito, etc.).</li>
          <li>El tiempo de tránsito es de 24 a 48 horas, dependiendo de la ruta.</li>
          <li>Te proporcionamos el número de guía para que realices el seguimiento.</li>
          <li>El costo del envío es asumido por el cliente y se paga al recibir (o se puede incluir en la factura si se coordina).</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>📌 Recomendaciones importantes</h2>
        <ul>
          <li>Antes de comprar, verifica con nosotros el <strong>código OEM y la compatibilidad</strong> con tu vehículo.</li>
          <li>Para envíos nacionales, asegúrate de contar con alguien que pueda retirar en el terminal.</li>
          <li>Una vez despachado, te enviaremos una foto del paquete y la guía por WhatsApp.</li>
        </ul>
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <a
          href="https://wa.me/593991657178?text=Hola%2C%20quiero%20consultar%20sobre%20env%C3%ADos%20de%20un%20repuesto"
          className="whatsapp-btn"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block" }}
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}