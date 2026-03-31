"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin ? (
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
      ) : null}

      <main>{children}</main>

      {!isAdmin ? (
        <a
          href="https://wa.me/593991657178?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20un%20repuesto"
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
        >
          <img
            src="/products/whatsapp-icon.png"
            alt="WhatsApp"
            width="28"
            height="28"
          />
        </a>
      ) : null}
    </>
  );
}