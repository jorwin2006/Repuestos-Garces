import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import {
  DEFAULT_DELIVERY_INFO,
  DEFAULT_PHONE,
  seedProducts,
  type DeliveryInfo,
  type Product,
} from "../data/products";

export type { DeliveryInfo, Product };

export type ProductInput = {
  id?: string;
  nombre: string;
  marcaVehiculo: string;
  categoria: string;
  imagen?: string;
  codigoOEM?: string;
  stockDisponible?: boolean;
  telefonoWhatsApp?: string;
  telefonoAlterno?: string;
  medidas?: string;
  descripcion?: string;
  compatibilidad?: string[];
  envios?: DeliveryInfo;
  mostrarInfoPublica?: boolean;
  mostrarMensajeWhatsApp?: boolean;
};

const DATA_FILE = path.join(process.cwd(), "data", "products.json");

export { DEFAULT_DELIVERY_INFO, DEFAULT_PHONE };

function normalizeText(value?: string | null): string | undefined {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

function normalizeArray(values?: string[] | null): string[] | undefined {
  if (!values) return undefined;

  const cleaned = values
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index);

  return cleaned.length > 0 ? cleaned : undefined;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(seedProducts, null, 2), "utf8");
  }
}

export async function getProducts(): Promise<Product[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");

  try {
    const parsed = JSON.parse(raw) as Product[];
    return parsed.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(seedProducts, null, 2), "utf8");
    return [...seedProducts].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }
}

async function saveProducts(products: Product[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf8");
}

function buildUniqueSlug(baseSlug: string, products: Product[], currentId?: string) {
  let slug = baseSlug;
  let counter = 2;

  while (products.some((item) => item.slug === slug && item.id !== currentId)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function upsertProduct(input: ProductInput): Promise<Product> {
  const products = await getProducts();
  const now = new Date().toISOString();
  const existing = input.id ? products.find((item) => item.id === input.id) : undefined;
  const baseSlug = slugify(input.nombre || existing?.nombre || `producto-${Date.now()}`);
  const slug = buildUniqueSlug(baseSlug, products, existing?.id);

  const normalizedProduct: Product = {
    id: existing?.id ?? randomUUID(),
    slug,
    nombre: input.nombre.trim(),
    marcaVehiculo: input.marcaVehiculo.trim(),
    categoria: input.categoria.trim(),
    imagen: normalizeText(input.imagen) ?? existing?.imagen ?? "/products/placeholder.svg",
    codigoOEM: normalizeText(input.codigoOEM),
    stockDisponible: input.stockDisponible,
    telefonoWhatsApp: normalizeText(input.telefonoWhatsApp) ?? existing?.telefonoWhatsApp ?? DEFAULT_PHONE,
    telefonoAlterno: normalizeText(input.telefonoAlterno),
    medidas: normalizeText(input.medidas),
    descripcion: normalizeText(input.descripcion),
    compatibilidad: normalizeArray(input.compatibilidad),
    envios: {
      retiroLocal:
        normalizeText(input.envios?.retiroLocal) ??
        existing?.envios?.retiroLocal ??
        DEFAULT_DELIVERY_INFO.retiroLocal,
      deliveryLocal:
        normalizeText(input.envios?.deliveryLocal) ??
        existing?.envios?.deliveryLocal ??
        DEFAULT_DELIVERY_INFO.deliveryLocal,
      enviosNacionales:
        normalizeText(input.envios?.enviosNacionales) ??
        existing?.envios?.enviosNacionales ??
        DEFAULT_DELIVERY_INFO.enviosNacionales,
    },
    mostrarInfoPublica: input.mostrarInfoPublica ?? existing?.mostrarInfoPublica ?? true,
    mostrarMensajeWhatsApp:
      input.mostrarMensajeWhatsApp ?? existing?.mostrarMensajeWhatsApp ?? true,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const updatedProducts = existing
    ? products.map((item) => (item.id === existing.id ? normalizedProduct : item))
    : [...products, normalizedProduct];

  await saveProducts(updatedProducts);
  return normalizedProduct;
}

export async function removeProduct(id: string) {
  const products = await getProducts();
  const updated = products.filter((item) => item.id !== id);
  await saveProducts(updated);
}

export function sanitizePhoneNumber(phone?: string | null) {
  const cleaned = phone?.replace(/\D/g, "").trim();
  return cleaned || DEFAULT_PHONE;
}
