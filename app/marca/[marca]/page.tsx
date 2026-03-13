import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "../../../data/products";

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

  // Todos los productos de la marca (sin filtro)
  const productosMarcaCompleta = products.filter(
    (p) => p.marcaVehiculo.toLowerCase() === marcaDecodificada.toLowerCase()
  );

  if (productosMarcaCompleta.length === 0) {
    notFound();
  }

  // Categorías disponibles en esta marca
  const categorias = Array.from(
    new Set(productosMarcaCompleta.map((p) => p.categoria))
  );

  // Validar que el sistema solicitado exista
  const sistemaActivo = sistema && categorias.includes(sistema) ? sistema : null;

  // Productos filtrados (si hay sistema activo, solo los de esa categoría)
  const productosFiltrados = sistemaActivo
    ? productosMarcaCompleta.filter((p) => p.categoria === sistemaActivo)
    : productosMarcaCompleta;

  // Categorías a mostrar (una sola si hay filtro, todas si no)
  const categoriasAMostrar = sistemaActivo ? [sistemaActivo] : categorias;

  return (
    <div className="container">
      <p style={{ marginBottom: "20px" }}>
        <Link href="/">← Volver al inicio</Link>
      </p>

      <h1 className="title">Marca: {marcaDecodificada}</h1>
      <p className="subtitle">Repuestos organizados por categorías.</p>

      {/* Botones de filtro por sistema */}
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
            href={`/marca/${encodeURIComponent(marcaDecodificada)}?sistema=${encodeURIComponent(cat)}`}
            className={`category-filter ${sistemaActivo === cat ? "active" : ""}`}
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

                  <div style={{ marginTop: "14px" }}>
                    <p
                      style={{
                        color: "#16a34a",
                        fontWeight: "bold",
                        lineHeight: "1.5",
                        marginBottom: "12px",
                      }}
                    >
                      Consulta precio y disponibilidad por WhatsApp
                    </p>

                    <div
                      style={{
                        borderTop: "1px solid #dbe3ea",
                        margin: "10px 0 14px 0",
                      }}
                    ></div>

                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        display: "inline-block",
                      }}
                    >
                      <strong style={{ color: "#1e3a8a" }}>Stock:</strong>{" "}
                      <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                        {producto.stock}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {productosFiltrados.length === 0 && sistemaActivo && (
        <p>No hay productos en la categoría &quot;{sistemaActivo}&quot; para esta marca.</p>
      )}
    </div>
  );
}