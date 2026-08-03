import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import AddToQuoteButton from "../../../components/quote-cart/AddToQuoteButton";
import {
  DEFAULT_DELIVERY_INFO,
  getProducts,
  sanitizePhoneNumber,
} from "../../../lib/products";
import styles from "./ProductDetail.module.css";

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

  if (producto.compatibilidad?.length) {
    parts.push(`Compatible con: ${producto.compatibilidad.join(", ")}`);
  }

  if (producto.descripcion) parts.push(producto.descripcion);
  return parts.join(". ");
}


function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z" />
      <path d="M9 8.5c.2 2 2 3.8 4 4.4l1-1c.2-.2.5-.3.8-.1l1.8.8c.3.1.4.4.4.7 0 1.1-.9 2-2 2-4.3 0-7.8-3.5-7.8-7.8 0-1.1.9-2 2-2 .3 0 .6.2.7.5l.8 1.8c.1.3.1.6-.1.8l-1 .9Z" />
    </svg>
  );
}

function CompatibilityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 16V9l2-4h12l2 4v7" />
      <path d="M4 12h16M7 16v2M17 16v2M7.5 9h9" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
      <path d="M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const producto = products.find(
    (item) => item.slug === slug && item.mostrarInfoPublica !== false
  );

  if (!producto) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no está disponible.",
    };
  }

  const description = buildDescription(producto);

  return {
    title: producto.nombre,
    description,
    openGraph: {
      title: producto.nombre,
      description,
      url: `https://repuestosgarces.com/producto/${producto.slug}`,
      images: [{ url: producto.imagen, width: 800, height: 600 }],
    },
    twitter: {
      card: "summary_large_image",
      title: producto.nombre,
      description,
      images: [producto.imagen],
    },
    alternates: { canonical: `/producto/${producto.slug}` },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const products = await getProducts();
  const producto = products.find(
    (item) => item.slug === slug && item.mostrarInfoPublica !== false
  );

  if (!producto) {
    return (
      <main className={styles.page}>
        <section className={styles.notFound}>
          <h1>Producto no encontrado</h1>
          <p>El repuesto que buscas no existe o todavía no está publicado.</p>
          <Link href="/">Volver al catálogo</Link>
        </section>
      </main>
    );
  }

  const compatibilidad = producto.compatibilidad ?? [];
  const compatibilidadTexto = compatibilidad.join(", ");
  const deliveryInfo = {
    retiroLocal: producto.envios?.retiroLocal ?? DEFAULT_DELIVERY_INFO.retiroLocal,
    deliveryLocal:
      producto.envios?.deliveryLocal ?? DEFAULT_DELIVERY_INFO.deliveryLocal,
    enviosNacionales:
      producto.envios?.enviosNacionales ??
      DEFAULT_DELIVERY_INFO.enviosNacionales,
  };

  const mensaje = [
    "Hola, quiero cotizar este repuesto:",
    `Producto: ${producto.nombre}`,
    `Marca: ${producto.marcaVehiculo}`,
    `Categoría: ${producto.categoria}`,
    producto.codigoOEM ? `Código OEM: ${producto.codigoOEM}` : undefined,
    compatibilidadTexto ? `Aplica para: ${compatibilidadTexto}` : undefined,
    "¿Me pueden confirmar disponibilidad y precio?",
  ].filter(Boolean) as string[];

  const whatsappURL = `https://wa.me/${sanitizePhoneNumber(
    producto.telefonoWhatsApp
  )}?text=${encodeURIComponent(mensaje.join("\n"))}`;

  const quoteItem = {
    id: String(producto.id),
    slug: producto.slug,
    nombre: producto.nombre,
    marcaVehiculo: producto.marcaVehiculo,
    categoria: producto.categoria,
    imagen: producto.imagen,
    compatibilidad: producto.compatibilidad,
    telefonoWhatsApp: producto.telefonoWhatsApp,
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label="Navegación">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href={`/marca/${encodeURIComponent(producto.marcaVehiculo)}`}>
            {producto.marcaVehiculo}
          </Link>
          <span>/</span>
          <span>{producto.nombre}</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.galleryCard}>
            <div className={styles.galleryTopbar}>
              <div className={styles.galleryBrand}>
                <span aria-hidden="true" />
                <span>Repuestos Garcés · {producto.marcaVehiculo}</span>
              </div>
              <span className={styles.galleryHint}>Imagen referencial</span>
            </div>

            <div className={styles.imageStage}>
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                fill
                sizes="(max-width: 1050px) 100vw, 55vw"
                priority
              />
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.eyebrowRow}>
              <p className={styles.eyebrow}>
                {producto.categoria} · {producto.marcaVehiculo}
              </p>

              {typeof producto.stockDisponible === "boolean" ? (
                <span
                  className={
                    producto.stockDisponible
                      ? styles.stock
                      : styles.stockUnavailable
                  }
                >
                  {producto.stockDisponible ? "Disponible" : "Consultar stock"}
                </span>
              ) : (
                <span className={styles.stockNeutral}>Consultar</span>
              )}
            </div>

            <h1 className={styles.title}>{producto.nombre}</h1>
            {compatibilidad.length > 0 ? (
              <div className={styles.compatibilityPreview}>
                {compatibilidad.slice(0, 4).map((item) => (
                  <span key={item} className={styles.compatibilityChip}>
                    {item}
                  </span>
                ))}
                {compatibilidad.length > 4 ? (
                  <span className={styles.compatibilityChip}>
                    +{compatibilidad.length - 4} más
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className={styles.facts}>
              <div className={styles.fact}>
                <span>Marca</span>
                <strong>{producto.marcaVehiculo}</strong>
              </div>
              <div className={styles.fact}>
                <span>Sistema</span>
                <strong>{producto.categoria}</strong>
              </div>
              {producto.codigoOEM ? (
                <div className={styles.fact}>
                  <span>Código OEM</span>
                  <strong>{producto.codigoOEM}</strong>
                </div>
              ) : null}
              {producto.medidas ? (
                <div className={styles.fact}>
                  <span>Medidas</span>
                  <strong>{producto.medidas}</strong>
                </div>
              ) : null}
            </div>

            {producto.descripcion ? (
              <div className={styles.description}>
                <h2>Descripción</h2>
                <p>{producto.descripcion}</p>
              </div>
            ) : null}

            <div className={styles.actions}>
              <AddToQuoteButton item={quoteItem} variant="full" />

              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappButton}
              >
                <WhatsAppIcon />
                <span>Cotizar este repuesto</span>
              </a>
            </div>

            <p className={styles.helperText}>
              Guarda varios repuestos y envía una sola consulta desde el botón
              flotante «Cotización».
            </p>
          </div>
        </section>

        <section className={styles.detailsGrid}>
          <article className={styles.detailCard}>
            <div className={styles.detailHeader}>
              <span className={styles.detailIcon}>
                <CompatibilityIcon />
              </span>
              <div>
                <h2>Compatibilidad</h2>
                <p>Vehículos y modelos registrados para este repuesto.</p>
              </div>
            </div>

            <div className={styles.compatibilityList}>
              {compatibilidad.length > 0 ? (
                compatibilidad.map((item) => (
                  <span key={item} className={styles.compatibilityItem}>
                    {item}
                  </span>
                ))
              ) : (
                <span className={styles.compatibilityItem}>
                  Confirma modelo y año por WhatsApp
                </span>
              )}
            </div>
          </article>

          <article className={styles.detailCard}>
            <div className={styles.detailHeader}>
              <span className={styles.detailIcon}>
                <DeliveryIcon />
              </span>
              <div>
                <h2>Envíos y entregas</h2>
                <p>Opciones disponibles para recibir tu pedido.</p>
              </div>
            </div>

            <div className={styles.deliveryList}>
              {deliveryInfo.retiroLocal ? (
                <div className={styles.deliveryItem}>
                  <strong>Retiro en local</strong>
                  <p>{deliveryInfo.retiroLocal}</p>
                </div>
              ) : null}
              {deliveryInfo.deliveryLocal ? (
                <div className={styles.deliveryItem}>
                  <strong>Entrega local</strong>
                  <p>{deliveryInfo.deliveryLocal}</p>
                </div>
              ) : null}
              {deliveryInfo.enviosNacionales ? (
                <div className={styles.deliveryItem}>
                  <strong>Envíos nacionales</strong>
                  <p>{deliveryInfo.enviosNacionales}</p>
                </div>
              ) : null}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
