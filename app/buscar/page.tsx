import Link from "next/link";
import Image from "next/image";
import { searchPublicProducts } from "../../lib/products";

type Props = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

function buildSearchHref(query: string, page = 1) {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set("q", query);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  return `/buscar?${params.toString()}`;
}

export default async function BuscarPage({ searchParams }: Props) {
  const { q = "", page } = await searchParams;
  const paginaActual = Math.max(1, Number(page) || 1);

  const resultado = await searchPublicProducts({
    query: q,
    page: paginaActual,
    pageSize: 12,
  });

  return (
    <div className="container">
      <p style={{ marginBottom: "20px" }}>
        <Link href="/">← Volver al inicio</Link>
      </p>

      <h1 className="title">Buscar</h1>
      <p className="subtitle">
        Busca por nombre, código OEM, marca o compatibilidad.
      </p>

      <form action="/buscar" method="get" className="search-form">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Ejemplo: balancín, HINO, J08CT, OEM..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>

      {q.trim() === "" ? (
        <p>Escribe algo para buscar.</p>
      ) : resultado.items.length === 0 ? (
        <p>No se encontraron productos para: {q}</p>
      ) : (
        <>
          <p className="pagination-summary">
            Resultados para <strong>{q}</strong>: {resultado.total}
          </p>

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

                <p className="product-card-meta">
                  <strong>Marca:</strong> {producto.marcaVehiculo}
                </p>

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

          {resultado.totalPages > 1 ? (
            <div className="pagination">
              <Link
                href={buildSearchHref(q, Math.max(1, resultado.page - 1))}
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
                href={buildSearchHref(
                  q,
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
        </>
      )}
    </div>
  );
}