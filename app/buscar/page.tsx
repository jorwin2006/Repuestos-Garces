import Link from "next/link";
import Image from "next/image";
import { getProducts } from "../../lib/products";
import type { Product } from "../../data/products";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function BuscarPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const products = await getProducts();

  const resultados: Product[] = query
    ? products.filter((p: Product) => {
        const texto = [
          p.nombre,
          p.codigoOEM ?? "",
          p.marcaVehiculo,
          p.categoria,
          ...(p.compatibilidad ?? []),
          p.descripcion ?? "",
          p.medidas ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return texto.includes(query);
      })
    : [];

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

      {query === "" ? (
        <p>Escribe algo para buscar.</p>
      ) : resultados.length === 0 ? (
        <p>No se encontraron productos para: {q}</p>
      ) : (
        <>
          <p style={{ marginBottom: "20px" }}>
            Resultados para <strong>{q}</strong>: {resultados.length}
          </p>

          <div className="grid">
            {resultados.map((producto: Product) => (
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
                        {producto.stockDisponible
                          ? "Disponible"
                          : "No disponible"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}