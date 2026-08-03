import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AddToQuoteButton from "../../../components/quote-cart/AddToQuoteButton";
import {
  getBrandCategories,
  getPublicProductsByBrand,
} from "../../../lib/products";
import cardStyles from "./CatalogCards.module.css";

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

  if (sistema) params.set("sistema", sistema);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return `/marca/${encodeURIComponent(marca)}${query ? `?${query}` : ""}`;
}

export default async function MarcaPage({ params, searchParams }: Props) {
  const { marca } = await params;
  const { sistema, page } = await searchParams;
  const marcaDecodificada = decodeURIComponent(marca);
  const categorias = await getBrandCategories(marcaDecodificada);

  if (categorias.length === 0) notFound();

  const sistemaActivo =
    sistema && categorias.includes(sistema) ? sistema : null;
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

                {categorias.map((categoria) => (
                  <Link
                    key={categoria}
                    href={buildMarcaHref(marcaDecodificada, categoria, 1)}
                    className={`brand-category-link ${
                      sistemaActivo === categoria ? "active" : ""
                    }`}
                  >
                    <span>{categoria}</span>
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

              {sistemaActivo ? (
                <Link
                  href={buildMarcaHref(marcaDecodificada, null, 1)}
                  className="brand-clear-filter"
                >
                  Limpiar filtro
                </Link>
              ) : null}
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
                {resultado.items.map((producto) => {
                  const vehiculosCompatibles =
                    producto.compatibilidad?.filter(Boolean).join(" / ") ||
                    producto.marcaVehiculo ||
                    marcaDecodificada;

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
                    <article key={producto.id} className={cardStyles.card}>
                      <Link
                        href={`/producto/${producto.slug}`}
                        className={cardStyles.cardLink}
                        aria-label={`Ver información de ${producto.nombre}`}
                      >
                        <div className={cardStyles.header}>
                          <div className={cardStyles.logo}>
                            <Image
                              src="/products/Logo_Repuestos.png"
                              alt="Logo de Repuestos Garcés"
                              width={54}
                              height={54}
                            />
                          </div>
                          <h3>{producto.nombre}</h3>
                        </div>

                        <div className={cardStyles.image}>
                          <Image
                            src={producto.imagen}
                            alt={producto.nombre}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 33vw"
                          />
                        </div>

                        <div className={cardStyles.compatibility}>
                          <span>Aplica para</span>
                          <strong>{vehiculosCompatibles}</strong>
                        </div>
                      </Link>

                      <div className={cardStyles.save}>
                        <AddToQuoteButton item={quoteItem} variant="icon" />
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {resultado.totalPages > 1 ? (
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
                  tabIndex={resultado.page === 1 ? -1 : undefined}
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
                  tabIndex={
                    resultado.page === resultado.totalPages ? -1 : undefined
                  }
                >
                  Siguiente →
                </Link>
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </div>
  );
}
