import Link from "next/link";
import Image from "next/image";
import { products } from "../../../data/products";

type Props = {
  params: Promise<{
    marca: string;
  }>;
  searchParams: Promise<{
    categoria?: string;
  }>;
};

export default async function MarcaPage({ params, searchParams }: Props) {
  const { marca } = await params;
  const { categoria } = await searchParams;

  const marcaDecodificada = decodeURIComponent(marca);

  const productosFiltrados = products.filter(
    (p) => p.marcaVehiculo.toUpperCase() === marcaDecodificada.toUpperCase()
  );

  const categorias = [...new Set(productosFiltrados.map((p) => p.categoria))];

  const categoriaActiva = categoria ? decodeURIComponent(categoria) : null;

  const productosVisibles = categoriaActiva
    ? productosFiltrados.filter((p) => p.categoria === categoriaActiva)
    : productosFiltrados;

  return (
    <div className="container">
      <h1 className="title">Marca: {marcaDecodificada}</h1>
      <p className="subtitle">Repuestos organizados por categorías.</p>

      {categorias.length > 0 && (
        <div className="category-filters">
          <Link
            href={`/marca/${encodeURIComponent(marcaDecodificada)}`}
            className={`category-filter ${!categoriaActiva ? "active" : ""}`}
          >
            Todas
          </Link>

          {categorias.map((cat) => (
            <Link
              key={cat}
              href={`/marca/${encodeURIComponent(marcaDecodificada)}?categoria=${encodeURIComponent(cat)}`}
              className={`category-filter ${categoriaActiva === cat ? "active" : ""}`}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {productosVisibles.length === 0 ? (
        <p>No hay productos cargados todavía para esta selección.</p>
      ) : (
        (categoriaActiva ? [categoriaActiva] : categorias).map((categoriaItem) => {
          const productosPorCategoria = productosVisibles.filter(
            (p) => p.categoria === categoriaItem
          );

          if (productosPorCategoria.length === 0) return null;

          return (
            <section key={categoriaItem} style={{ marginBottom: "32px" }}>
              <h2 style={{ marginBottom: "16px" }}>{categoriaItem}</h2>

              <div className="grid">
                {productosPorCategoria.map((producto) => (
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

                    <p>
                      <strong>Precio:</strong>{" "}
                      <span style={{ textDecoration: "line-through", color: "#777" }}>
                        ${producto.precio.toFixed(2)}
                      </span>{" "}
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        ${(producto.precioOferta ?? producto.precio).toFixed(2)}
                      </span>
                    </p>

                    <p><strong>Stock:</strong> {producto.stock}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}