export default function EnviosPage() {
  return (
    <div className="container">
      <h1 className="title">Envíos y Entregas</h1>
      <p className="subtitle">
        Información clara para que tu pedido llegue rápido y sin confusiones.
      </p>

      <div className="info-section">
        <h2>1) Retiro en local</h2>
        <ul>
          <li>Entrega inmediata según disponibilidad.</li>
          <li>Recomendado para clientes de la ciudad.</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>2) Delivery local</h2>
        <ul>
          <li>Coordinamos costo y horario por WhatsApp.</li>
          <li>Aplica según zona y disponibilidad.</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>3) Envíos nacionales (encomienda)</h2>
        <ul>
          <li>
            Enviamos por <strong>encomienda</strong> en buses interprovinciales.
          </li>
          <li>
            El cliente debe <strong>retirar en el terminal designado</strong> de
            su ciudad (ej: Guayaquil → terminal).
          </li>
          <li>Tiempo referencial: 24–48 horas (depende de la ruta).</li>
          <li>Confirmación de pago y datos antes del envío.</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Recomendación</h2>
        <ul>
          <li>
            Antes de comprar, confirma por WhatsApp el <strong>código OEM</strong>{" "}
            y la <strong>compatibilidad</strong> con tu vehículo.
          </li>
        </ul>
      </div>
    </div>
  );
}