import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Repuestos Garces",
};

export default function Home() {
  const marcas = [
    { name: "HINO", logo: "/products/HINO/Hino2.png" },
    { name: "ISUZU", logo: "/products/ISUZU/isuzu1.png" },
    { name: "NISSAN", logo: "/products/NISSAN/nissan.png" },
    { name: "MERCEDES-BENZ", logo: "/products/MERCEDES/mercedes-benz.png" },
    { name: "VOLKSWAGEN", logo: "/products/VOLKSWAGEN/volkswagen1.png" },
    { name: "YUTONG", logo: "/products/YUTONG/yutong1.png" },
  ];

  return (
    <div className="home-page">
      <div className="home-intro">
        <h1 className="home-title">Repuestos Garces</h1>
        <p className="home-subtitle">
          Selecciona tu marca para ver los repuestos organizados por categorías.
        </p>
      </div>

      <div className="home-grid">
        {marcas.map((marca) => (
          <Link key={marca.name} href={`/marca/${marca.name}`} className="home-card">
            <div className="home-card-image">
              <Image
                src={marca.logo}
                alt={`Logo ${marca.name}`}
                width={240}
                height={130}
                className="home-brand-logo"
                sizes="(max-width: 768px) 80vw, 240px"
                priority
              />
            </div>
            <span className="home-card-name">{marca.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}