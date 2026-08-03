"use client";

import type { MouseEvent } from "react";
import { useQuoteCart, type QuoteCartItem } from "./QuoteCartProvider";
import styles from "./QuoteCart.module.css";

type Props = {
  item: QuoteCartItem;
  variant?: "icon" | "full";
  className?: string;
};

function BagIcon({ checked = false }: { checked?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.8 8.2h10.4l1 11.3H5.8l1-11.3Z" />
      <path d="M9.2 9V6.8a2.8 2.8 0 0 1 5.6 0V9" />
      {checked ? <path d="m9.2 14 1.8 1.8 3.8-4" /> : <path d="M12 12v5M9.5 14.5h5" />}
    </svg>
  );
}

export default function AddToQuoteButton({
  item,
  variant = "icon",
  className = "",
}: Props) {
  const { addItem, removeItem, isInCart } = useQuoteCart();
  const saved = isInCart(item.id);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (saved) {
      removeItem(item.id);
      return;
    }

    addItem(item);
  }

  const label = saved
    ? "Quitar de la cotización"
    : "Agregar a la cotización";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.addButton} ${
        variant === "full" ? styles.addButtonFull : styles.addButtonIcon
      } ${saved ? styles.isSaved : ""} ${className}`}
      aria-label={label}
      aria-pressed={saved}
      title={label}
    >
      <BagIcon checked={saved} />
      {variant === "full" ? (
        <span>{saved ? "Guardado en cotización" : "Agregar a cotización"}</span>
      ) : null}
    </button>
  );
}
