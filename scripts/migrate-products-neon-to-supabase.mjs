import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");
const BACKUP_PATH = path.join(ROOT, "migration-products-backup.json");

function loadEnvLocal() {
  if (!fs.existsSync(ENV_PATH)) {
    throw new Error("No existe el archivo .env.local en la raíz del proyecto.");
  }

  const content = fs.readFileSync(ENV_PATH, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const cleanLine = line.trim();

    if (!cleanLine || cleanLine.startsWith("#")) continue;

    const equalIndex = cleanLine.indexOf("=");
    if (equalIndex === -1) continue;

    const key = cleanLine.slice(0, equalIndex).trim();
    let value = cleanLine.slice(equalIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta configurar ${name} en .env.local`);
  }

  return value;
}

function normalizeJsonArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeJsonObject(value) {
  if (!value) return {};

  if (typeof value === "object" && !Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  return {};
}

function normalizeRow(row) {
  const now = new Date().toISOString();

  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    marca_vehiculo: row.marca_vehiculo,
    categoria: row.categoria,
    imagen: row.imagen || "/products/placeholder.svg",
    codigo_oem: row.codigo_oem ?? null,
    stock_disponible:
      typeof row.stock_disponible === "boolean"
        ? row.stock_disponible
        : row.stock_disponible === null || row.stock_disponible === undefined
          ? null
          : Boolean(row.stock_disponible),
    compatibilidad: normalizeJsonArray(row.compatibilidad),
    mostrar_info_publica:
      typeof row.mostrar_info_publica === "boolean"
        ? row.mostrar_info_publica
        : true,
    mostrar_mensaje_whatsapp:
      typeof row.mostrar_mensaje_whatsapp === "boolean"
        ? row.mostrar_mensaje_whatsapp
        : true,
    telefono_whatsapp: row.telefono_whatsapp ?? null,
    telefono_alterno: row.telefono_alterno ?? null,
    medidas: row.medidas ?? null,
    descripcion: row.descripcion ?? null,
    envios: normalizeJsonObject(row.envios),
    created_at: row.created_at
      ? new Date(row.created_at).toISOString()
      : now,
    updated_at: row.updated_at
      ? new Date(row.updated_at).toISOString()
      : now,
  };
}

function chunkArray(items, size) {
  const chunks = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

function analyzeImages(products) {
  let blobOrExternal = 0;
  let localPublic = 0;
  let missingLocal = 0;
  let empty = 0;

  const missing = [];

  for (const product of products) {
    const image = product.imagen;

    if (!image) {
      empty++;
      continue;
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      blobOrExternal++;
      continue;
    }

    if (image.startsWith("/")) {
      localPublic++;

      const localPath = path.join(ROOT, "public", image);

      if (!fs.existsSync(localPath)) {
        missingLocal++;
        missing.push({
          id: product.id,
          nombre: product.nombre,
          imagen: product.imagen,
        });
      }
    }
  }

  return {
    blobOrExternal,
    localPublic,
    missingLocal,
    empty,
    missing,
  };
}

async function insertIntoSupabase(products) {
  const supabaseUrl = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
  const serviceKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  const batches = chunkArray(products, 100);
  let inserted = 0;

  for (const [index, batch] of batches.entries()) {
    const url = new URL(`${supabaseUrl}/rest/v1/products`);
    url.searchParams.set("on_conflict", "id");

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(batch),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Error insertando lote ${index + 1}/${batches.length} en Supabase: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    inserted += batch.length;

    console.log(`Lote ${index + 1}/${batches.length} migrado: ${inserted}/${products.length}`);
  }
}

async function main() {
  loadEnvLocal();

  const databaseUrl = requiredEnv("DATABASE_URL");

  console.log("Conectando a Neon...");
  const sql = neon(databaseUrl);

  console.log("Leyendo productos desde Neon...");

  const neonRows = await sql`
    SELECT
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
    FROM products
    ORDER BY created_at ASC
  `;

  console.log(`Productos encontrados en Neon: ${neonRows.length}`);

  if (neonRows.length === 0) {
    console.log("No hay productos para migrar.");
    return;
  }

  const products = neonRows.map(normalizeRow);

  fs.writeFileSync(BACKUP_PATH, JSON.stringify(products, null, 2), "utf8");

  console.log(`Backup creado: ${BACKUP_PATH}`);

  const imageReport = analyzeImages(products);

  console.log("Reporte de imágenes:");
  console.log(`- Imágenes externas / Vercel Blob: ${imageReport.blobOrExternal}`);
  console.log(`- Imágenes locales en public: ${imageReport.localPublic}`);
  console.log(`- Imágenes locales no encontradas: ${imageReport.missingLocal}`);
  console.log(`- Productos sin imagen: ${imageReport.empty}`);

  if (imageReport.missing.length > 0) {
    fs.writeFileSync(
      path.join(ROOT, "migration-missing-images.json"),
      JSON.stringify(imageReport.missing, null, 2),
      "utf8"
    );

    console.log("Se creó migration-missing-images.json con las imágenes locales no encontradas.");
  }

  console.log("Insertando productos en Supabase...");

  await insertIntoSupabase(products);

  console.log("Migración terminada correctamente.");
  console.log(`Total migrado: ${products.length}`);
}

main().catch((error) => {
  console.error("Error en la migración:");
  console.error(error);
  process.exit(1);
});