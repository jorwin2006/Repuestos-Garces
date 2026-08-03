"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useQuoteCart } from "./QuoteCartProvider";
import styles from "./QuoteCart.module.css";

const DEFAULT_PHONE = "593991657178";

function sanitizePhone(value?: string) {
  const digits = (value ?? DEFAULT_PHONE).replace(/\D/g, "");
  return digits || DEFAULT_PHONE;
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.8 8.2h10.4l1 11.3H5.8l1-11.3Z" />
      <path d="M9.2 9V6.8a2.8 2.8 0 0 1 5.6 0V9" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  );
}

export default function QuoteCartDrawer() {
  const {
    items,
    count,
    isOpen,
    openCart,
    closeCart,
    removeItem,
    clearCart,
  } = useQuoteCart();

  const whatsappURL = useMemo(() => {
    if (items.length === 0) return "#";

    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://repuestosgarces.com";

    const lines = [
      "Hola, deseo cotizar los siguientes repuestos:",
      "",
      ...items.flatMap((item, index) => [
        `${index + 1}. ${item.nombre}`,
        `   Marca: ${item.marcaVehiculo}`,
        item.compatibilidad?.length
          ? `   Aplica para: ${item.compatibilidad.join(" / ")}`
          : "",
        `   Enlace: ${origin}/producto/${item.slug}`,
        "",
      ]),
      "¿Me pueden confirmar disponibilidad y precio de todos estos repuestos?",
    ].filter(Boolean);

    const phone = sanitizePhone(items[0]?.telefonoWhatsApp);
    return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [items]);

  return (
    <>
      <button
        type="button"
        className={styles.floatingCart}
        onClick={openCart}
        aria-label={`Abrir cotización. ${count} productos guardados`}
      >
        <span className={styles.floatingIcon}>
          <CartIcon />
        </span>
        <span className={styles.floatingText}>Cotización</span>
        {count > 0 ? <span className={styles.countBadge}>{count}</span> : null}
      </button>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Productos guardados para cotizar"
        aria-hidden={!isOpen}
      >
        <header className={styles.drawerHeader}>
          <div>
            <span className={styles.drawerEyebrow}>Lista de consulta</span>
            <h2>Tu cotización</h2>
            <p>
              {count === 0
                ? "Todavía no has guardado repuestos."
                : `${count} ${count === 1 ? "repuesto guardado" : "repuestos guardados"}`}
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={closeCart}
            aria-label="Cerrar cotización"
          >
            <CloseIcon />
          </button>
        </header>

        <div className={styles.drawerBody}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>
                <CartIcon />
              </span>
              <h3>Guarda los repuestos que te interesan</h3>
              <p>
                Pulsa el botón de cotización en cualquier producto y aparecerá
                aquí para consultarlos juntos por WhatsApp.
              </p>
            </div>
          ) : (
            <div className={styles.itemList}>
              {items.map((item) => (
                <article key={item.id} className={styles.cartItem}>
                  <Link
                    href={`/producto/${item.slug}`}
                    className={styles.itemImage}
                    onClick={closeCart}
                  >
                    <Image
                      src={item.imagen}
                      alt={item.nombre}
                      fill
                      sizes="76px"
                    />
                  </Link>

                  <div className={styles.itemContent}>
                    <Link href={`/producto/${item.slug}`} onClick={closeCart}>
                      <h3>{item.nombre}</h3>
                    </Link>
                    <p>{item.marcaVehiculo}</p>
                    {item.compatibilidad?.length ? (
                      <small>{item.compatibilidad.join(" / ")}</small>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeItem(item.id)}
                    aria-label={`Eliminar ${item.nombre}`}
                    title="Eliminar de la cotización"
                  >
                    <TrashIcon />
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className={styles.drawerFooter}>
          {items.length > 0 ? (
            <>
              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappButton}
              >
                <span>Consultar todos por WhatsApp</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z" />
                  <path d="M9 8.5c.2 2 2 3.8 4 4.4l1-1c.2-.2.5-.3.8-.1l1.8.8c.3.1.4.4.4.7 0 1.1-.9 2-2 2-4.3 0-7.8-3.5-7.8-7.8 0-1.1.9-2 2-2 .3 0 .6.2.7.5l.8 1.8c.1.3.1.6-.1.8l-1 .9Z" />
                </svg>
              </a>

              <button
                type="button"
                className={styles.clearButton}
                onClick={clearCart}
              >
                Vaciar cotización
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.continueButton}
              onClick={closeCart}
            >
              Seguir viendo repuestos
            </button>
          )}
        </footer>
      </aside>
    </>
  );
}
