import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  DEFAULT_DELIVERY_INFO,
  getProducts,
  sanitizePhoneNumber,
} from "../../../lib/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

function buildDescription(producto: {
  nombre: string;
  marcaVehiculo: string;
  categoria: string;
  compatibilidad?: string[];
  descripcion?: string;
}) {
  const parts = [
    `Repuesto ${producto.nombre}`,
    `para ${producto.marcaVehiculo}`,
    `Categoría: ${producto.categoria}`,
  ];

  if (producto.compatibilidad && producto.compatibilidad.length > 0) {
    parts.push(`Compatible con: ${producto.compatibilidad.join(", ")}`);
  }

  if (producto.descripcion) {
    parts.push(producto.descripcion);
  }

  return parts.join(". ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();

  const producto = products.find(
    (p) => p.slug === slug && p.mostrarInfoPublica !== false
  );

  if (!producto) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no está disponible.",
    };
  }

  const descripcion = buildDescription(producto);

  return {
    title: producto.nombre,
    description: descripcion,
    openGraph: {
      title: producto.nombre,
      description: descripcion,
      url: `https://repuestosgarces.com/producto/${producto.slug}`,
      images: [
        {
          url: producto.imagen,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: producto.nombre,
      description: descripcion,
      images: [producto.imagen],
    },
    alternates: {
      canonical: `/producto/${producto.slug}`,
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const products = await getProducts();

  const producto = products.find(
    (p) => p.slug === slug && p.mostrarInfoPublica !== false
  );

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

  const compatibilidad = producto.compatibilidad ?? [];
  const compatibilidadTexto =
    compatibilidad.length > 0 ? compatibilidad.join(", ") : "";

  const mensajePartes = [
    "Hola, quiero cotizar este repuesto:",
    `Producto: ${producto.nombre}`,
    `Marca: ${producto.marcaVehiculo}`,
    `Categoría: ${producto.categoria}`,
    producto.codigoOEM ? `Código OEM: ${producto.codigoOEM}` : undefined,
    compatibilidadTexto ? `Compatibilidad: ${compatibilidadTexto}` : undefined,
    typeof producto.stockDisponible === "boolean"
      ? `Stock: ${producto.stockDisponible ? "Disponible" : "No disponible"}`
      : undefined,
    "¿Sigue disponible?",
  ].filter(Boolean) as string[];

  const whatsappURL = `https://wa.me/${sanitizePhoneNumber(
    producto.telefonoWhatsApp
  )}?text=${encodeURIComponent(mensajePartes.join("\n"))}`;

  const deliveryInfo = {
    retiroLocal:
      producto.envios?.retiroLocal ?? DEFAULT_DELIVERY_INFO.retiroLocal,
    deliveryLocal:
      producto.envios?.deliveryLocal ?? DEFAULT_DELIVERY_INFO.deliveryLocal,
    enviosNacionales:
      producto.envios?.enviosNacionales ??
      DEFAULT_DELIVERY_INFO.enviosNacionales,
  };

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

          <div className="product-details-list">
            <p>
              <strong>Marca del vehículo:</strong> {producto.marcaVehiculo}
            </p>
            <p>
              <strong>Categoría:</strong> {producto.categoria}
            </p>

            {producto.codigoOEM ? (
              <p>
                <strong>Código OEM:</strong> {producto.codigoOEM}
              </p>
            ) : null}

            {typeof producto.stockDisponible === "boolean" ? (
              <p>
                <strong>Stock:</strong>{" "}
                <span
                  className={
                    producto.stockDisponible ? "stock-text-ok" : "stock-text-no"
                  }
                >
                  {producto.stockDisponible ? "Disponible" : "No disponible"}
                </span>
              </p>
            ) : null}

            {producto.medidas ? (
              <p>
                <strong>Medidas:</strong> {producto.medidas}
              </p>
            ) : null}

            {producto.telefonoAlterno ? (
              <p>
                <strong>Teléfono de contacto:</strong>{" "}
                {producto.telefonoAlterno}
              </p>
            ) : null}
          </div>

          {producto.descripcion ? (
            <p className="product-description">{producto.descripcion}</p>
          ) : null}

          {producto.mostrarMensajeWhatsApp !== false ? (
            <div style={{ margin: "18px 0" }}>
              <p className="product-whatsapp-title">
                Consulta precio por WhatsApp
              </p>
            </div>
          ) : null}

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

      {compatibilidad.length > 0 ? (
        <div className="info-section">
          <h2>Compatibilidad</h2>
          <ul>
            {compatibilidad.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {deliveryInfo.retiroLocal ||
      deliveryInfo.deliveryLocal ||
      deliveryInfo.enviosNacionales ? (
        <div className="info-section">
          <h2>Envíos y entregas</h2>
          <ul>
            {deliveryInfo.retiroLocal ? (
              <li>
                <strong>Retiro en local:</strong> {deliveryInfo.retiroLocal}
              </li>
            ) : null}
            {deliveryInfo.deliveryLocal ? (
              <li>
                <strong>Delivery local:</strong> {deliveryInfo.deliveryLocal}
              </li>
            ) : null}
            {deliveryInfo.enviosNacionales ? (
              <li>
                <strong>Envíos nacionales:</strong>{" "}
                {deliveryInfo.enviosNacionales}
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}