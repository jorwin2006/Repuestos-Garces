import Link from "next/link";

export default function Home() {
  const marcas = [
    "HINO",
    "ISUZU",
    "NISSAN",
    "MERCEDES-BENZ",
    "VOLKSWAGEN",
    "YUTONG"
  ];

  return (
    <div className="container">
      <h1 className="title">Repuestos Garces</h1>
      <p className="subtitle">
        Selecciona tu marca para ver los repuestos organizados por categorías.
      </p>

      <div className="grid">
        {marcas.map((marca) => (
          <Link key={marca} href={`/marca/${marca}`} className="card">
            {marca}
          </Link>
        ))}
      </div>
    </div>
  );
}