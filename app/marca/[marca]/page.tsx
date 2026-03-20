import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProducts } from "../../../lib/products";

type Props = {
  params: Promise<{
    marca: string;
  }>;
  searchParams: Promise<{
    sistema?: string;
  }>;
};

export default async function MarcaPage({ params, searchParams }: Props) {
  const { marca } = await params;
  const { sistema } = await searchParams;
  const marcaDecodificada = decodeURIComponent(marca);

  const products = await getProducts();

  const productosMarcaCompleta = products.filter(
    (p) =>
      p.mostrarInfoPublica !== false &&
      p.marcaVehiculo.toLowerCase() === marcaDecodificada.toLowerCase()
  );

  if (productosMarcaCompleta.length === 0) {
    notFound();
  }

  const categorias = Array.from(
    new Set(
      productosMarcaCompleta
        .map((p) => p.categoria)
        .filter((categoria) => Boolean(categoria))
    )
  );

  const sistemaActivo =
    sistema && categorias.includes(sistema) ? sistema : null;

  const productosFiltrados = sistemaActivo
    ? productosMarcaCompleta.filter((p) => p.categoria === sistemaActivo)
    : productosMarcaCompleta;

  const categoriasAMostrar = sistemaActivo ? [sistemaActivo] : categorias;

  return (
    <div className="container">
      <p style={{ marginBottom: "20px" }}>
        <Link href="/">← Volver al inicio</Link>
      </p>

      <h1 className="title">Marca: {marcaDecodificada}</h1>
      <p className="subtitle">Repuestos organizados por categorías.</p>

      <div className="category-filters">
        <Link
          href={`/marca/${encodeURIComponent(marcaDecodificada)}`}
          className={`category-filter ${!sistemaActivo ? "active" : ""}`}
        >
          Todos
        </Link>

        {categorias.map((cat) => (
          <Link
            key={cat}
            href={`/marca/${encodeURIComponent(
              marcaDecodificada
            )}?sistema=${encodeURIComponent(cat)}`}
            className={`category-filter ${
              sistemaActivo === cat ? "active" : ""
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {categoriasAMostrar.map((categoria) => {
        const productosCategoria = productosFiltrados.filter(
          (p) => p.categoria === categoria
        );

        if (productosCategoria.length === 0) return null;

        return (
          <section key={categoria} style={{ marginBottom: "36px" }}>
            <h2 style={{ marginBottom: "18px" }}>{categoria}</h2>

            <div className="grid">
              {productosCategoria.map((producto) => (
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
          </section>
        );
      })}

      {productosFiltrados.length === 0 && sistemaActivo ? (
        <p>
          No hay productos en la categoría &quot;{sistemaActivo}&quot; para esta
          marca.
        </p>
      ) : null}
    </div>
  );
}