import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import DownloadAppSection from "../components/DownloadAppSection";
import HomeShowcaseBanner from "../components/HomeShowcaseBanner";
import HomeOffersSection from "../components/HomeOffersSection";

import { getProducts } from "../lib/products";

export const metadata: Metadata = {
  title: "Repuestos Garces",
};

const marcas = [
  {
    name: "HINO",
    logo: "/products/HINO/Hino2.png",
  },
  {
    name: "ISUZU",
    logo: "/products/ISUZU/isuzu1.png",
  },
  {
    name: "NISSAN",
    logo: "/products/NISSAN/nissan.png",
  },
  {
    name: "MERCEDES-BENZ",
    logo: "/products/MERCEDES/mercedes-benz.png",
  },
  {
    name: "VOLKSWAGEN",
    logo: "/products/VOLKSWAGEN/volkswagen1.png",
  },
  {
    name: "YUTONG",
    logo: "/products/YUTONG/yutong1.png",
  },
];

function normalizeBrand(
  value: string
) {
  return value
    .trim()
    .toUpperCase();
}

export default async function Home() {
  const productos =
    await getProducts();

  const productosBase =
    productos
      .filter(
        (producto) =>
          producto.mostrarInfoPublica !==
          false
      )
      .filter(
        (producto) =>
          producto.imagen &&
          producto.imagen !==
            "/products/placeholder.svg"
      );

  const productosPublicos =
    marcas
      .flatMap((marca) =>
        productosBase
          .filter(
            (producto) =>
              normalizeBrand(
                producto.marcaVehiculo ??
                  ""
              ) ===
              normalizeBrand(
                marca.name
              )
          )
          .slice(0, 10)
      )
      .map((producto) => ({
        id: String(
          producto.id
        ),

        slug:
          producto.slug,

        nombre:
          producto.nombre,

        marcaVehiculo:
          producto.marcaVehiculo,

        categoria:
          producto.categoria,

        imagen:
          producto.imagen,
      }));

  return (
    <div className="home-page">
      {/* HERO */}

      <HomeShowcaseBanner
        products={
          productosPublicos
        }
      />

      {/* OFERTAS WEB */}

      <HomeOffersSection
        products={
          productosBase
        }
      />

      {/* MARCAS */}

      <section
        id="marcas"
        className="home-brands-section"
      >
        <div className="home-brands-heading">
          <div>
            <span className="home-brands-eyebrow">
              CATÁLOGO
            </span>

            <h2 className="home-brands-title">
              Marcas
            </h2>

            <p className="home-brands-subtitle">
              Encuentre el repuesto que
              necesite por fabricante.
            </p>
          </div>

          <span className="home-brands-count">
            {marcas.length} marcas
          </span>
        </div>

        <div className="home-grid">
          {marcas.map(
            (marca) => (
              <Link
                key={
                  marca.name
                }
                href={`/marca/${encodeURIComponent(
                  marca.name
                )}`}
                className="home-card"
              >
                <div className="home-card-image">
                  <Image
                    src={
                      marca.logo
                    }
                    alt={`Logo ${marca.name}`}
                    width={240}
                    height={130}
                    className="home-brand-logo"
                    sizes="(max-width: 768px) 80vw, 240px"
                  />
                </div>

                <div className="home-brand-card-footer">
                  <span className="home-card-name">
                    {
                      marca.name
                    }
                  </span>

                  <span
                    className="home-brand-arrow"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* DESCARGAR APP */}

      <DownloadAppSection />
    </div>
  );
}