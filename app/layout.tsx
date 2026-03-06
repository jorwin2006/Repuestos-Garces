import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Repuestos Garces | Repuestos para camiones y buses",
    template: "%s | Repuestos Garces",
  },
  description:
    "Catálogo de repuestos para camiones y buses. Encuentra repuestos de calidad para HINO, ISUZU, MERCEDES-BENZ y más. Contamos con stock y envíos a nivel nacional.",
  metadataBase: new URL("https://repuestosgarces.com"),
  openGraph: {
    title: "Repuestos Garces",
    description:
      "Catálogo de repuestos para camiones y buses. Encuentra repuestos de calidad para HINO, ISUZU, MERCEDES-BENZ y más.",
    url: "https://repuestosgarces.com",
    siteName: "Repuestos Garces",
    images: [
      {
        url: "/products/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repuestos Garces",
    description: "Catálogo de repuestos para camiones y buses",
    images: ["/products/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/products/favicon_io/favicon.ico", sizes: "any" },
      {
        url: "/products/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/products/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/products/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/products/favicon_io/site.webmanifest",
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
              <span className="logo-image-wrap">
                <img
                  src="/products/Logo_Repuestos.png"
                  alt="Logo Repuestos Garces"
                  className="logo-image"
                />
              </span>
              <span className="logo-text">Repuestos Garces</span>
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
              <Link href="/nosotros">Nosotros</Link>
              <Link href="/envios">Envíos</Link>
              <Link href="/contacto">Contacto</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <a
          href="https://wa.me/593991657178?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20un%20repuesto"
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
        >
          <img src="/products/whatsapp-icon.png" alt="WhatsApp" width="28" height="28" />
        </a>
      </body>
    </html>
  );
}