"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import QuoteCartDrawer from "./quote-cart/QuoteCartDrawer";
import { QuoteCartProvider } from "./quote-cart/QuoteCartProvider";
import ThemeToggle from "./ThemeToggle";
import styles from "./SiteChrome.module.css";

type SiteChromeProps = {
  children: React.ReactNode;
};

export default function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <QuoteCartProvider>
      {!isAdmin ? (
        <header className={styles.header}>
          <div className={styles.inner}>
            {/* Logo y nombre */}

            <Link
              href="/"
              className={styles.brand}
              aria-label="Ir al inicio de Repuestos Garces"
            >
              <div className={styles.logoWrap}>
                <Image
                  src="/products/Logo_Repuestos.png"
                  alt="Logo de Repuestos Garces"
                  width={52}
                  height={52}
                  className={styles.logo}
                  priority
                />
              </div>

              <div className={styles.brandText}>
                <span className={styles.brandTop}>Repuestos</span>
                <strong className={styles.brandName}>Garces</strong>
              </div>
            </Link>

            {/* Buscador */}

            <form
              action="/buscar"
              method="get"
              className={styles.searchForm}
            >
              <div className={styles.searchBox}>
                <svg
                  className={styles.searchIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M21 21L16.65 16.65M10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5C18 14.6421 14.6421 18 10.5 18Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  type="search"
                  name="q"
                  placeholder="Buscar por nombre, OEM o marca..."
                  className={styles.searchInput}
                  aria-label="Buscar repuestos"
                />
              </div>

              <button type="submit" className={styles.searchButton}>
                Buscar
              </button>
            </form>

            {/* Navegación */}

            <nav
              className={styles.nav}
              aria-label="Navegación principal"
            >
              <Link href="/" className={styles.navLink}>
                Inicio
              </Link>

              <Link href="/nosotros" className={styles.navLink}>
                Nosotros
              </Link>

              <Link href="/envios" className={styles.navLink}>
                Envíos
              </Link>

              <Link href="/contacto" className={styles.navLink}>
                Contacto
              </Link>
            </nav>

            {/* Tema */}

            <div className={styles.actions}>
              <div className={styles.themeWrap}>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>
      ) : null}

      {/* Aquí se muestra el contenido de cada página */}

      <main>{children}</main>

      {!isAdmin ? (
        <>
          {/* Carrito de cotización */}

          <QuoteCartDrawer />

          {/* WhatsApp flotante */}

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
        </>
      ) : null}
    </QuoteCartProvider>
  );
}