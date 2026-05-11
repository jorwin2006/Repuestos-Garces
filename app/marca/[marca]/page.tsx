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
    <div className="premium-page brand-collection-page">
      <main className="brand-collection-shell">
        <nav className="brand-breadcrumb">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <strong>{marcaDecodificada}</strong>
        </nav>

        <header className="brand-collection-header">
          <div>
            <p className="brand-eyebrow">Catálogo por marca</p>

            <h1>{marcaDecodificada}</h1>

            <p>
              Consulta repuestos disponibles por sistema. Filtra por categoría
              para encontrar más rápido lo que necesitas.
            </p>
          </div>

          <div className="brand-header-pills">
            <span>Atención rápida</span>
            <span>Envíos nacionales</span>
            <span>Retiro en local</span>
          </div>
        </header>

        <div className="brand-collection-layout">
          <aside className="brand-sidebar">
            <section className="brand-sidebar-card">
              <div className="brand-sidebar-title">
                <h2>Categorías</h2>
                <span>{categorias.length}</span>
              </div>

              <div className="brand-category-list">
                <Link
                  href={buildMarcaHref(marcaDecodificada, null, 1)}
                  className={`brand-category-link ${
                    !sistemaActivo ? "active" : ""
                  }`}
                >
                  <span>Todos los sistemas</span>
                </Link>

                {categorias.map((cat) => (
                  <Link
                    key={cat}
                    href={buildMarcaHref(marcaDecodificada, cat, 1)}
                    className={`brand-category-link ${
                      sistemaActivo === cat ? "active" : ""
                    }`}
                  >
                    <span>{cat}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="brand-sidebar-card brand-help-card">
              <h3>¿No encuentras el repuesto?</h3>
              <p>
                Escríbenos con el modelo, año y código OEM para ayudarte a
                validar compatibilidad.
              </p>
            </section>
          </aside>

          <section className="brand-products-panel">
            <div className="brand-products-toolbar">
              <div>
                <h2>
                  {sistemaActivo
                    ? `${sistemaActivo} ${marcaDecodificada}`
                    : `Repuestos ${marcaDecodificada}`}
                </h2>

                <p>
                  Hay {resultado.total}{" "}
                  {resultado.total === 1 ? "producto" : "productos"}
                  {sistemaActivo ? ` en ${sistemaActivo}` : ""}
                </p>
              </div>

              {sistemaActivo && (
                <Link
                  href={buildMarcaHref(marcaDecodificada, null, 1)}
                  className="brand-clear-filter"
                >
                  Limpiar filtro
                </Link>
              )}
            </div>

            {resultado.items.length === 0 ? (
              <div className="brand-empty-state">
                <h3>No hay productos disponibles</h3>
                <p>
                  No se encontraron repuestos
                  {sistemaActivo ? ` en ${sistemaActivo}` : ""} para esta marca.
                </p>
              </div>
            ) : (
              <div className="brand-products-grid">
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
                      <h3 className="premium-product-card-title">
                        {producto.nombre}
                      </h3>

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
                            className={
                              producto.stockDisponible ? "in-stock" : "out-stock"
                            }
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
                  className={`premium-button-blue ${
                    resultado.page === 1 ? "disabled" : ""
                  }`}
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
          </section>
        </div>
      </main>
    </div>
  );
}