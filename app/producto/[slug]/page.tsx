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

function buildHook(producto: {
  categoria: string;
  compatibilidad?: string[];
  codigoOEM?: string;
}) {
  if (producto.compatibilidad && producto.compatibilidad.length > 0) {
    return `Compatible con ${producto.compatibilidad.slice(0, 2).join(" y ")}.`;
  }

  if (producto.codigoOEM) {
    return `Consulta OEM ${producto.codigoOEM} y compatibilidad antes de cotizar.`;
  }

  return `Repuesto de categoría ${producto.categoria} con atención rápida por WhatsApp.`;
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
      <main className="premium-page">
        <div className="premium-content">
          <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:px-8">
            <div className="premium-hero premium-product-shell p-6 md:p-10">
              <h1 className="premium-section-title text-4xl font-bold">
                Producto no encontrado
              </h1>
              <p className="premium-muted mt-4 text-lg">
                El producto que buscas no existe o todavía no ha sido cargado.
              </p>
              <div className="mt-8">
                <Link href="/" className="premium-button-blue inline-flex rounded-full px-5 py-3 font-semibold">
                  Volver al inicio
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
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
    <main className="premium-page">
      <div className="premium-content">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
          <div className="premium-hero premium-product-shell p-5 sm:p-7 md:p-10">
            <p className="mb-6">
              <Link
                href={`/marca/${encodeURIComponent(producto.marcaVehiculo)}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-300 transition hover:text-blue-200"
              >
                <span>←</span>
                <span>Volver a {producto.marcaVehiculo}</span>
              </Link>
            </p>

            <div className="product-premium-layout">
              <div className="premium-card product-premium-image-card">
                <div className="premium-image-frame product-premium-image-frame">
                  <div className="product-premium-image-inner">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      width={900}
                      height={900}
                      className="product-premium-image"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="premium-card-strong product-premium-info-card">
                <p className="product-premium-eyebrow">
                  Repuesto para {producto.marcaVehiculo}
                </p>

                <h1 className="premium-section-title product-premium-title">
                  {producto.nombre}
                </h1>

                <p className="product-premium-hook">
                  {buildHook(producto)}
                </p>

                <div className="product-premium-trust">
                  <span className="product-premium-trust-pill">Atención rápida</span>
                  <span className="product-premium-trust-pill">Consulta por WhatsApp</span>
                  <span className="product-premium-trust-pill">Envíos nacionales</span>
                </div>

                <div className="product-premium-facts">
                  <div className="product-premium-fact">
                    <span className="product-premium-fact-label">Marca</span>
                    <span className="product-premium-fact-value">{producto.marcaVehiculo}</span>
                  </div>

                  <div className="product-premium-fact">
                    <span className="product-premium-fact-label">Categoría</span>
                    <span className="product-premium-fact-value">{producto.categoria}</span>
                  </div>

                  {producto.codigoOEM ? (
                    <div className="product-premium-fact">
                      <span className="product-premium-fact-label">Código OEM</span>
                      <span className="product-premium-fact-value">{producto.codigoOEM}</span>
                    </div>
                  ) : null}

                  {typeof producto.stockDisponible === "boolean" ? (
                    <div className="product-premium-fact">
                      <span className="product-premium-fact-label">Stock</span>
                      <span
                        className={`product-premium-stock ${
                          producto.stockDisponible ? "is-ok" : "is-no"
                        }`}
                      >
                        {producto.stockDisponible ? "Disponible" : "No disponible"}
                      </span>
                    </div>
                  ) : null}

                  {producto.medidas ? (
                    <div className="product-premium-fact">
                      <span className="product-premium-fact-label">Medidas</span>
                      <span className="product-premium-fact-value">{producto.medidas}</span>
                    </div>
                  ) : null}

                  {producto.telefonoAlterno ? (
                    <div className="product-premium-fact">
                      <span className="product-premium-fact-label">Teléfono</span>
                      <span className="product-premium-fact-value">{producto.telefonoAlterno}</span>
                    </div>
                  ) : null}
                </div>

                {producto.descripcion ? (
                  <div className="product-premium-copy">
                    <h2 className="product-premium-subtitle">Descripción</h2>
                    <p className="premium-muted">{producto.descripcion}</p>
                  </div>
                ) : null}

                <div className="product-premium-cta-wrap">
                  <p className="product-premium-cta-title">
                    Consulta precio y compatibilidad por WhatsApp
                  </p>
                  <a
                    href={whatsappURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-btn product-premium-whatsapp-btn"
                  >
                    Cotizar por WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {compatibilidad.length > 0 ? (
              <div className="premium-card product-premium-section">
                <h2 className="product-premium-subtitle">Compatibilidad</h2>
                <ul className="product-premium-list">
                  {compatibilidad.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {deliveryInfo.retiroLocal ||
            deliveryInfo.deliveryLocal ||
            deliveryInfo.enviosNacionales ? (
              <div className="premium-card product-premium-section">
                <h2 className="product-premium-subtitle">Envíos y entregas</h2>
                <ul className="product-premium-list">
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
                      <strong>Envíos nacionales:</strong> {deliveryInfo.enviosNacionales}
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}