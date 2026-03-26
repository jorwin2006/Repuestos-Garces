import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getBrandCategories,
  getPublicProductsByBrand,
} from "../../../lib/products";

type Props = {
  params: Promise<{
    marca: string;
  }>;
  searchParams: Promise<{
    sistema?: string;
    page?: string;
  }>;
};

function buildMarcaHref(marca: string, sistema?: string | null, page = 1) {
  const params = new URLSearchParams();

  if (sistema) {
    params.set("sistema", sistema);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return `/marca/${encodeURIComponent(marca)}${query ? `?${query}` : ""}`;
}

function getProductHook(producto: {
  codigoOEM?: string | null;
  stockDisponible?: boolean | null;
}) {
  if (producto.codigoOEM) {
    return `Consulta OEM ${producto.codigoOEM} y compatibilidad.`;
  }

  if (producto.stockDisponible === true) {
    return "Disponible para consulta inmediata.";
  }

  return "Ver compatibilidad y detalles antes de cotizar.";
}

export default async function MarcaPage({ params, searchParams }: Props) {
  const { marca } = await params;
  const { sistema, page } = await searchParams;

  const marcaDecodificada = decodeURIComponent(marca);
  const categorias = await getBrandCategories(marcaDecodificada);

  if (categorias.length === 0) {
    notFound();
  }

  const sistemaActivo = sistema && categorias.includes(sistema) ? sistema : null;
  const paginaActual = Math.max(1, Number(page) || 1);

  const resultado = await getPublicProductsByBrand({
    marcaVehiculo: marcaDecodificada,
    categoria: sistemaActivo,
    page: paginaActual,
    pageSize: 12,
  });

  return (
    <div className="premium-page">
      <div
        className="premium-content"
        style={{ width: "100%", maxWidth: "none", padding: "0 1.5rem" }}
      >
        <div className="premium-hero premium-hero--expanded">
          <div style={{ marginBottom: "1.5rem" }}>
            <Link
              href="/"
              style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}
            >
              ← Volver al inicio
            </Link>
          </div>

          <h1
            className="premium-section-title"
            style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}
          >
            Marca: {marcaDecodificada}
          </h1>

          <p className="brand-page-lead">
            Repuestos {marcaDecodificada} seleccionados para sistemas clave.
            Consulta compatibilidad y disponibilidad antes de cotizar.
          </p>

          <div className="premium-filters">
            <Link
              href={buildMarcaHref(marcaDecodificada, null, 1)}
              className={`premium-chip ${!sistemaActivo ? "active" : ""}`}
            >
              Todos
            </Link>

            {categorias.map((cat) => (
              <Link
                key={cat}
                href={buildMarcaHref(marcaDecodificada, cat, 1)}
                className={`premium-chip ${sistemaActivo === cat ? "active" : ""}`}
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="brand-trust-strip">
            <span className="brand-trust-pill">Atención rápida</span>
            <span className="brand-trust-pill">Envíos nacionales</span>
            <span className="brand-trust-pill">Retiro en local</span>
          </div>

          <p
            className="premium-muted"
            style={{ margin: "1.2rem 0 1.1rem 0", fontSize: "0.9rem" }}
          >
            Mostrando {resultado.items.length} de {resultado.total} repuestos
          </p>

          {resultado.items.length === 0 ? (
            <p className="premium-muted">
              No hay productos
              {sistemaActivo ? ` en la categoría "${sistemaActivo}"` : ""} para
              esta marca.
            </p>
          ) : (
            <div className="premium-grid">
              {resultado.items.map((producto) => (
                <Link
                  key={producto.id}
                  href={`/producto/${producto.slug}`}
                  className="premium-card premium-product-card"
                >
                  <div className="premium-image-frame">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      width={300}
                      height={220}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>

                  <div className="premium-product-card-content">
                    <h3 className="premium-product-card-title">{producto.nombre}</h3>

                    <p className="premium-product-card-hook">
                      {getProductHook(producto)}
                    </p>

                    {producto.codigoOEM && (
                      <p className="premium-product-card-meta">
                        <strong>Código OEM:</strong> {producto.codigoOEM}
                      </p>
                    )}

                    {producto.mostrarMensajeWhatsApp !== false && (
                      <p className="premium-product-card-whatsapp">
                        Ver compatibilidad y cotizar
                      </p>
                    )}

                    {typeof producto.stockDisponible === "boolean" && (
                      <div className="premium-stock-badge">
                        <span
                          className={producto.stockDisponible ? "in-stock" : "out-stock"}
                        >
                          {producto.stockDisponible
                            ? "Stock disponible"
                            : "Sin stock"}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {resultado.totalPages > 1 && (
            <div className="premium-pagination">
              <Link
                href={buildMarcaHref(
                  marcaDecodificada,
                  sistemaActivo,
                  Math.max(1, resultado.page - 1)
                )}
                className={`premium-button-blue ${resultado.page === 1 ? "disabled" : ""}`}
                aria-disabled={resultado.page === 1}
              >
                ← Anterior
              </Link>

              <span className="premium-muted">
                Página {resultado.page} de {resultado.totalPages}
              </span>

              <Link
                href={buildMarcaHref(
                  marcaDecodificada,
                  sistemaActivo,
                  Math.min(resultado.totalPages, resultado.page + 1)
                )}
                className={`premium-button-blue ${
                  resultado.page === resultado.totalPages ? "disabled" : ""
                }`}
                aria-disabled={resultado.page === resultado.totalPages}
              >
                Siguiente →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}