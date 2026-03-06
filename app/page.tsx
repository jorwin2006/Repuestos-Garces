import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Repuestos Garces",
};

export default function Home() {
  const marcas = [
    { name: "HINO", logo: "/products/hino.png" },
    { name: "ISUZU", logo: "/products/isuzu.png" },
    { name: "NISSAN", logo: "/products/nissan.png" },
    { name: "MERCEDES-BENZ", logo: "/products/mercedes-benz.png" },
    { name: "VOLKSWAGEN", logo: "/products/volkswagen.png" },
    { name: "YUTONG", logo: "/products/yutong.png" },
  ];

  return (
    <div className="container">
      <h1 className="title">Repuestos Garces</h1>
      <p className="subtitle">
        Selecciona tu marca para ver los repuestos organizados por categorías.
      </p>

      <div className="grid">
        {marcas.map((marca) => (
          <Link key={marca.name} href={`/marca/${marca.name}`} className="card">
            <div className="card-image">
              <Image
                src={marca.logo}
                alt={`Logo ${marca.name}`}
                width={240}
                height={130}
                style={{ objectFit: "contain" }}
                priority
              />
            </div>

            <span className="card-name">{marca.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}