import Link from "next/link";
import Image from "next/image";
import { products } from "../../data/products";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function BuscarPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const resultados = query
    ? products.filter((p) => {
        const texto = [
          p.nombre,
          p.codigoOEM,
          p.marcaVehiculo,
          p.categoria,
          ...(p.compatibilidad ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return texto.includes(query);
      })
    : [];

  return (
    <div className="container">
      <h1 className="title">Buscar repuestos</h1>
      <p className="subtitle">
        Busca por nombre, código OEM, marca o compatibilidad.
      </p>

      <form action="/buscar" method="get" className="search-form">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Ej: N-533, terminal, Hino 1721..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Buscar
        </button>
      </form>

      {query === "" ? (
        <p>Escribe algo para buscar.</p>
      ) : resultados.length === 0 ? (
        <p>No se encontraron productos para: <strong>{q}</strong></p>
      ) : (
        <>
          <p style={{ marginBottom: "18px" }}>
            Resultados para <strong>{q}</strong>: {resultados.length}
          </p>

          <div className="grid">
            {resultados.map((producto) => {
              const precioFinal = producto.precioOferta ?? producto.precio;

              return (
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
                  <p><strong>OEM:</strong> {producto.codigoOEM}</p>
                  <p><strong>Marca:</strong> {producto.marcaVehiculo}</p>

                  <p>
                    <strong>Precio:</strong>{" "}
                    <span style={{ textDecoration: "line-through", color: "#777" }}>
                      ${producto.precio.toFixed(2)}
                    </span>{" "}
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      ${precioFinal.toFixed(2)}
                    </span>
                  </p>

                  <p><strong>Stock:</strong> {producto.stock}</p>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}