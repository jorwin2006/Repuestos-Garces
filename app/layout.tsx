import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Repuestos Garces",
  description: "Catálogo de repuestos para camiones y buses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="logo">
              Repuestos Garces
            </Link>

            <form action="/buscar" method="get" className="header-search-form">
              <input
                type="text"
                name="q"
                placeholder="Buscar por nombre, OEM o marca..."
                className="header-search-input"
              />
              <button type="submit" className="header-search-button">
                Buscar
              </button>
            </form>

            <nav className="header-nav">
              <Link href="/">Inicio</Link>
              <Link href="/buscar">Buscar</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}