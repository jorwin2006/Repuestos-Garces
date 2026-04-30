import { randomUUID } from "crypto";
import { supabaseFetch } from "./products-db";
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

function escapeLike(value: string) {
  return value.replace(/[%*]/g, "");
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

function mapProductToRow(product: Product): ProductRow {
  const now = new Date().toISOString();

  return {
    id: product.id,
    slug: product.slug,
    nombre: product.nombre,
    marca_vehiculo: product.marcaVehiculo,
    categoria: product.categoria,
    imagen: product.imagen,
    codigo_oem: product.codigoOEM ?? null,
    stock_disponible:
      typeof product.stockDisponible === "boolean"
        ? product.stockDisponible
        : null,
    compatibilidad: product.compatibilidad ?? [],
    mostrar_info_publica: product.mostrarInfoPublica ?? true,
    mostrar_mensaje_whatsapp: product.mostrarMensajeWhatsApp ?? true,
    telefono_whatsapp: product.telefonoWhatsApp ?? DEFAULT_PHONE,
    telefono_alterno: product.telefonoAlterno ?? null,
    medidas: product.medidas ?? null,
    descripcion: product.descripcion ?? null,
    envios: product.envios ?? DEFAULT_DELIVERY_INFO,
    created_at: product.createdAt ?? now,
    updated_at: product.updatedAt ?? now,
  };
}

async function findById(id: string): Promise<Product | undefined> {
  const { data: rows } = await supabaseFetch<ProductRow[]>("products", {
    params: {
      select: "*",
      id: `eq.${id}`,
      limit: "1",
    },
  });

  return rows[0] ? mapRowToProduct(rows[0]) : undefined;
}

async function slugExists(slug: string, currentId?: string) {
  const params: Record<string, string> = {
    select: "id",
    slug: `eq.${slug}`,
    limit: "1",
  };

  if (currentId) {
    params.id = `neq.${currentId}`;
  }

  const { data: rows } = await supabaseFetch<Pick<ProductRow, "id">[]>(
    "products",
    { params }
  );

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
  const { data: rows } = await supabaseFetch<ProductRow[]>("products", {
    params: {
      select: "*",
      order: "nombre.asc",
    },
  });

  return rows.map(mapRowToProduct);
}

type PaginatedProductsResult = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

function normalizePage(page?: number) {
  if (!page || Number.isNaN(page) || page < 1) return 1;
  return Math.floor(page);
}

function normalizePageSize(pageSize?: number) {
  if (!pageSize || Number.isNaN(pageSize) || pageSize < 1) return 12;
  return Math.min(Math.floor(pageSize), 48);
}

export async function getBrandCategories(
  marcaVehiculo: string
): Promise<string[]> {
  const { data: rows } = await supabaseFetch<Pick<ProductRow, "categoria">[]>(
    "products",
    {
      params: {
        select: "categoria",
        mostrar_info_publica: "eq.true",
        marca_vehiculo: `ilike.${escapeLike(marcaVehiculo)}`,
        order: "categoria.asc",
      },
    }
  );

  return Array.from(new Set(rows.map((row) => row.categoria))).sort((a, b) =>
    a.localeCompare(b)
  );
}

export async function getPublicProductsByBrand(params: {
  marcaVehiculo: string;
  categoria?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedProductsResult> {
  const page = normalizePage(params.page);
  const pageSize = normalizePageSize(params.pageSize);
  const offset = (page - 1) * pageSize;

  const queryParams: Record<string, string> = {
    select: "*",
    mostrar_info_publica: "eq.true",
    marca_vehiculo: `ilike.${escapeLike(params.marcaVehiculo)}`,
    order: "nombre.asc",
  };

  if (params.categoria) {
    queryParams.categoria = `eq.${params.categoria}`;
  }

  const { data: rows, count } = await supabaseFetch<ProductRow[]>("products", {
    params: queryParams,
    range: {
      from: offset,
      to: offset + pageSize - 1,
    },
    prefer: "count=exact",
  });

  const total = count ?? rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: rows.map(mapRowToProduct),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function searchPublicProducts(params: {
  query: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedProductsResult> {
  const query = params.query.trim();
  const page = normalizePage(params.page);
  const pageSize = normalizePageSize(params.pageSize);
  const offset = (page - 1) * pageSize;

  if (!query) {
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
    };
  }

  const { data: rows } = await supabaseFetch<ProductRow[]>("products", {
    params: {
      select: "*",
      mostrar_info_publica: "eq.true",
      order: "nombre.asc",
    },
  });

  const needle = query.toLowerCase();

  const filtered = rows.filter((row) => {
    const fields = [
      row.nombre,
      row.codigo_oem,
      row.marca_vehiculo,
      row.categoria,
      row.descripcion,
      row.medidas,
      ...(row.compatibilidad ?? []),
    ];

    return fields.some((field) => field?.toLowerCase().includes(needle));
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: filtered.slice(offset, offset + pageSize).map(mapRowToProduct),
    total,
    page,
    pageSize,
    totalPages,
  };
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

  const { data: rows } = await supabaseFetch<ProductRow[]>("products", {
    method: "POST",
    params: {
      on_conflict: "id",
      select: "*",
    },
    body: [mapProductToRow(normalizedProduct)],
    prefer: "resolution=merge-duplicates,return=representation",
  });

  return rows[0] ? mapRowToProduct(rows[0]) : normalizedProduct;
}

export async function removeProduct(id: string) {
  await supabaseFetch<null>("products", {
    method: "DELETE",
    params: {
      id: `eq.${id}`,
    },
    prefer: "return=minimal",
  });
}

export function sanitizePhoneNumber(phone?: string | null) {
  const cleaned = phone?.replace(/\D/g, "").trim();
  return cleaned || DEFAULT_PHONE;
}