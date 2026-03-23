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
    <div className="container">
      <p style={{ marginBottom: "20px" }}>
        <Link href="/">← Volver al inicio</Link>
      </p>

      <h1 className="title">Marca: {marcaDecodificada}</h1>
      <p className="subtitle">Repuestos organizados por categorías.</p>

      <div className="category-filters">
        <Link
          href={buildMarcaHref(marcaDecodificada, null, 1)}
          className={`category-filter ${!sistemaActivo ? "active" : ""}`}
        >
          Todos
        </Link>

        {categorias.map((cat) => (
          <Link
            key={cat}
            href={buildMarcaHref(marcaDecodificada, cat, 1)}
            className={`category-filter ${sistemaActivo === cat ? "active" : ""}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <p className="pagination-summary">
        Mostrando {resultado.items.length} de {resultado.total} repuestos
      </p>

      {resultado.items.length === 0 ? (
        <p>
          No hay productos
          {sistemaActivo ? ` en la categoría "${sistemaActivo}"` : ""} para esta
          marca.
        </p>
      ) : (
        <div className="grid">
          {resultado.items.map((producto) => (
            <Link
              key={producto.id}
              href={`/producto/${producto.slug}`}
              className="card product-card-link"
            >
              <div className="product-card-image-wrap">
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  width={300}
                  height={220}
                  className="product-card-image"
                />
              </div>

              <h3 className="product-card-title">{producto.nombre}</h3>

              {producto.codigoOEM ? (
                <p className="product-card-meta">
                  <strong>Código OEM:</strong> {producto.codigoOEM}
                </p>
              ) : null}

              {producto.mostrarMensajeWhatsApp !== false ? (
                <p className="product-card-whatsapp-copy">
                  Consulta precio y disponibilidad por WhatsApp
                </p>
              ) : null}

              {typeof producto.stockDisponible === "boolean" ? (
                <div className="stock-chip-wrap">
                  <div
                    className={`stock-chip ${
                      producto.stockDisponible ? "in-stock" : "out-stock"
                    }`}
                  >
                    <strong>Stock:</strong>{" "}
                    <span>
                      {producto.stockDisponible ? "Disponible" : "No disponible"}
                    </span>
                  </div>
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      )}

      {resultado.totalPages > 1 ? (
        <div className="pagination">
          <Link
            href={buildMarcaHref(
              marcaDecodificada,
              sistemaActivo,
              Math.max(1, resultado.page - 1)
            )}
            className={`pagination-link ${
              resultado.page === 1 ? "disabled" : ""
            }`}
            aria-disabled={resultado.page === 1}
          >
            ← Anterior
          </Link>

          <span className="pagination-info">
            Página {resultado.page} de {resultado.totalPages}
          </span>

          <Link
            href={buildMarcaHref(
              marcaDecodificada,
              sistemaActivo,
              Math.min(resultado.totalPages, resultado.page + 1)
            )}
            className={`pagination-link ${
              resultado.page === resultado.totalPages ? "disabled" : ""
            }`}
            aria-disabled={resultado.page === resultado.totalPages}
          >
            Siguiente →
          </Link>
        </div>
      ) : null}
    </div>
  );
}