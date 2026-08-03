"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type QuoteCartItem = {
  id: string;
  slug: string;
  nombre: string;
  marcaVehiculo: string;
  categoria: string;
  imagen: string;
  compatibilidad?: string[];
  telefonoWhatsApp?: string;
};

type QuoteCartContextValue = {
  items: QuoteCartItem[];
  isOpen: boolean;
  count: number;
  addItem: (item: QuoteCartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  openCart: () => void;
  closeCart: () => void;
};

const STORAGE_KEY = "repuestos-garces-cotizacion-v1";

const QuoteCartContext = createContext<QuoteCartContextValue | null>(null);

function isQuoteItem(value: unknown): value is QuoteCartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<QuoteCartItem>;

  return Boolean(
    item.id &&
      item.slug &&
      item.nombre &&
      item.marcaVehiculo &&
      item.categoria &&
      item.imagen
  );
}

export function QuoteCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteCartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : [];

      if (Array.isArray(parsed)) {
        setItems(parsed.filter(isQuoteItem));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [isHydrated, items]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const addItem = useCallback((item: QuoteCartItem) => {
    setItems((current) => {
      if (current.some((saved) => saved.id === item.id)) return current;
      return [...current, item];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const isInCart = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items]
  );

  const value = useMemo<QuoteCartContextValue>(
    () => ({
      items,
      isOpen,
      count: items.length,
      addItem,
      removeItem,
      clearCart,
      isInCart,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [items, isOpen, addItem, removeItem, clearCart, isInCart]
  );

  return (
    <QuoteCartContext.Provider value={value}>
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext);

  if (!context) {
    throw new Error("useQuoteCart debe usarse dentro de QuoteCartProvider");
  }

  return context;
}
