import Link from "next/link";
import { products } from "../../../data/products";
import Image from "next/image";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;

  const producto = products.find((p) => p.slug === slug);

  if (!producto) {
    return (
      <div className="container">
        <h1 className="title">Producto no encontrado</h1>
        <p className="subtitle">
          El producto que buscas no existe o todavía no ha sido cargado.
        </p>
        <Link href="/" className="card" style={{ display: "inline-block" }}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  const precioFinal = producto.precioOferta ?? producto.precio;

  const mensaje = `Hola, quiero cotizar este repuesto:
Producto: ${producto.nombre}
Marca: ${producto.marcaVehiculo}
Categoría: ${producto.categoria}
Código OEM: ${producto.codigoOEM}
Precio oferta: $${precioFinal.toFixed(2)}
Compatibilidad: ${producto.compatibilidad.join(", ")}

¿Sigue disponible?`;

  const whatsappURL = `https://wa.me/593991657178?text=${encodeURIComponent(
    mensaje
  )}`;

  return (
    <div className="container">
      <p style={{ marginBottom: "20px" }}>
        <Link href={`/marca/${encodeURIComponent(producto.marcaVehiculo)}`}>
          ← Volver a {producto.marcaVehiculo}
        </Link>
      </p>

      <div className="product-layout">
        <div className="product-image-box">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            width={500}
            height={500}    
            className="product-image"
          />
        </div>

        <div className="product-info-box">
          <h1 className="title" style={{ marginTop: 0 }}>
            {producto.nombre}
          </h1>

          <p>
            <strong>Marca del vehículo:</strong> {producto.marcaVehiculo}
          </p>
          <p>
            <strong>Categoría:</strong> {producto.categoria}
          </p>
          <p>
            <strong>Código OEM:</strong> {producto.codigoOEM}
          </p>
          <p>
            <strong>Stock:</strong> {producto.stock}
          </p>

          <div style={{ margin: "18px 0" }}>
            <p style={{ margin: 0 }}>
              <strong>Precio normal:</strong>{" "}
              <span style={{ textDecoration: "line-through", color: "#777" }}>
                ${producto.precio.toFixed(2)}
              </span>
            </p>
            <p className="offer-price">
              Precio oferta: ${precioFinal.toFixed(2)}
            </p>
          </div>

          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            Cotizar por WhatsApp
          </a>
        </div>
      </div>

      <div className="info-section">
        <h2>Compatibilidad</h2>
        <ul>
          {producto.compatibilidad.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="info-section">
        <h2>Envíos y entregas</h2>
        <ul>
          <li><strong>Retiro en local:</strong> Repuestos Garces - Santo Domingo, Av Esmeraldas Lote 6 y Río Yuturi,frente a Erco TIRE</li>
          <li><strong>Delivery local:</strong> Coordinado por WhatsApp.</li>
          <li>
            <strong>Envíos nacionales:</strong> Por encomienda en buses
            interprovinciales, el cliente debe retirar en el terminal designado
            de su ciudad.
          </li>
        </ul>
      </div>
    </div>
  );
}