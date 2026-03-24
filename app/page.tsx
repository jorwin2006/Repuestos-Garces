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
    <div
    style={{
      minHeight: "100vh",
      backgroundImage:
        "linear-gradient(rgba(0,0,0,0.22), rgba(0,0,0,0.22)), url('/hero/home-premium.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    >
      <div className="home-intro">
        <h1 className="title">Repuestos Garces</h1>
        <p className="subtitle">
          Selecciona tu marca para ver los repuestos organizados por categorías.
        </p>
      </div>

      <div className="grid">
        {marcas.map((marca) => (
          <Link key={marca.name} href={`/marca/${marca.name}`} className="card">
            <div className="card-image">
              <Image
                src={marca.logo}
                alt={`Logo ${marca.name}`}
                width={240}
                height={130}
                className="brand-logo"
                sizes="(max-width: 768px) 80vw, 240px"
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