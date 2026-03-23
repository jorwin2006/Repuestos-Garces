import { randomUUID } from "crypto";
import { sql } from "./db";
import {
  DEFAULT_DELIVERY_INFO,
  DEFAULT_PHONE,
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

export { DEFAULT_DELIVERY_INFO, DEFAULT_PHONE };

type ProductRow = {
  id: string;
  slug: string;
  nombre: string;
  marca_vehiculo: string;
  categoria: string;
  imagen: string;
  codigo_oem: string | null;
  stock_disponible: boolean | null;
  compatibilidad: string[] | null;
  mostrar_info_publica: boolean;
  mostrar_mensaje_whatsapp: boolean;
  telefono_whatsapp: string | null;
  telefono_alterno: string | null;
  medidas: string | null;
  descripcion: string | null;
  envios: DeliveryInfo | null;
  created_at: string;
  updated_at: string;
};

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

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    marcaVehiculo: row.marca_vehiculo,
    categoria: row.categoria,
    imagen: row.imagen,
    codigoOEM: row.codigo_oem ?? undefined,
    stockDisponible: row.stock_disponible ?? undefined,
    compatibilidad: row.compatibilidad ?? undefined,
    mostrarInfoPublica: row.mostrar_info_publica,
    mostrarMensajeWhatsApp: row.mostrar_mensaje_whatsapp,
    telefonoWhatsApp: row.telefono_whatsapp ?? DEFAULT_PHONE,
    telefonoAlterno: row.telefono_alterno ?? undefined,
    medidas: row.medidas ?? undefined,
    descripcion: row.descripcion ?? undefined,
    envios: row.envios ?? DEFAULT_DELIVERY_INFO,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findById(id: string): Promise<Product | undefined> {
  const rows = (await sql`
    SELECT *
    FROM products
    WHERE id = ${id}
    LIMIT 1
  `) as ProductRow[];

  return rows[0] ? mapRowToProduct(rows[0]) : undefined;
}

async function slugExists(slug: string, currentId?: string) {
  if (currentId) {
    const rows = await sql`
      SELECT id
      FROM products
      WHERE slug = ${slug} AND id <> ${currentId}
      LIMIT 1
    `;
    return rows.length > 0;
  }

  const rows = await sql`
    SELECT id
    FROM products
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return rows.length > 0;
}

async function buildUniqueSlug(baseSlug: string, currentId?: string) {
  let slug = baseSlug;
  let counter = 2;

  while (await slugExists(slug, currentId)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function getProducts(): Promise<Product[]> {
  const rows = (await sql`
    SELECT *
    FROM products
    ORDER BY nombre ASC
  `) as ProductRow[];

  return rows.map(mapRowToProduct);
}

export async function upsertProduct(input: ProductInput): Promise<Product> {
  const now = new Date().toISOString();
  const existing = input.id ? await findById(input.id) : undefined;

  const baseSlug = slugify(
    input.nombre || existing?.nombre || `producto-${Date.now()}`
  );
  const slug = await buildUniqueSlug(baseSlug, existing?.id);

  const normalizedProduct: Product = {
    id: existing?.id ?? randomUUID(),
    slug,
    nombre: input.nombre.trim(),
    marcaVehiculo: input.marcaVehiculo.trim(),
    categoria: input.categoria.trim(),
    imagen:
      normalizeText(input.imagen) ??
      existing?.imagen ??
      "/products/placeholder.svg",
    codigoOEM: normalizeText(input.codigoOEM),
    stockDisponible: input.stockDisponible,
    telefonoWhatsApp:
      normalizeText(input.telefonoWhatsApp) ??
      existing?.telefonoWhatsApp ??
      DEFAULT_PHONE,
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
    mostrarInfoPublica:
      input.mostrarInfoPublica ?? existing?.mostrarInfoPublica ?? true,
    mostrarMensajeWhatsApp:
      input.mostrarMensajeWhatsApp ?? existing?.mostrarMensajeWhatsApp ?? true,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await sql`
    INSERT INTO products (
      id,
      slug,
      nombre,
      marca_vehiculo,
      categoria,
      imagen,
      codigo_oem,
      stock_disponible,
      compatibilidad,
      mostrar_info_publica,
      mostrar_mensaje_whatsapp,
      telefono_whatsapp,
      telefono_alterno,
      medidas,
      descripcion,
      envios,
      created_at,
      updated_at
    )
    VALUES (
      ${normalizedProduct.id},
      ${normalizedProduct.slug},
      ${normalizedProduct.nombre},
      ${normalizedProduct.marcaVehiculo},
      ${normalizedProduct.categoria},
      ${normalizedProduct.imagen},
      ${normalizedProduct.codigoOEM ?? null},
      ${typeof normalizedProduct.stockDisponible === "boolean"
        ? normalizedProduct.stockDisponible
        : null},
      ${JSON.stringify(normalizedProduct.compatibilidad ?? [])}::jsonb,
      ${normalizedProduct.mostrarInfoPublica ?? true},
      ${normalizedProduct.mostrarMensajeWhatsApp ?? true},
      ${normalizedProduct.telefonoWhatsApp ?? DEFAULT_PHONE},
      ${normalizedProduct.telefonoAlterno ?? null},
      ${normalizedProduct.medidas ?? null},
      ${normalizedProduct.descripcion ?? null},
      ${JSON.stringify(
        normalizedProduct.envios ?? DEFAULT_DELIVERY_INFO
      )}::jsonb,
      ${normalizedProduct.createdAt},
      ${normalizedProduct.updatedAt}
    )
    ON CONFLICT (id)
    DO UPDATE SET
      slug = EXCLUDED.slug,
      nombre = EXCLUDED.nombre,
      marca_vehiculo = EXCLUDED.marca_vehiculo,
      categoria = EXCLUDED.categoria,
      imagen = EXCLUDED.imagen,
      codigo_oem = EXCLUDED.codigo_oem,
      stock_disponible = EXCLUDED.stock_disponible,
      compatibilidad = EXCLUDED.compatibilidad,
      mostrar_info_publica = EXCLUDED.mostrar_info_publica,
      mostrar_mensaje_whatsapp = EXCLUDED.mostrar_mensaje_whatsapp,
      telefono_whatsapp = EXCLUDED.telefono_whatsapp,
      telefono_alterno = EXCLUDED.telefono_alterno,
      medidas = EXCLUDED.medidas,
      descripcion = EXCLUDED.descripcion,
      envios = EXCLUDED.envios,
      updated_at = EXCLUDED.updated_at
  `;

  return normalizedProduct;
}

export async function removeProduct(id: string) {
  await sql`
    DELETE FROM products
    WHERE id = ${id}
  `;
}

export function sanitizePhoneNumber(phone?: string | null) {
  const cleaned = phone?.replace(/\D/g, "").trim();
  return cleaned || DEFAULT_PHONE;
}