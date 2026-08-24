import { NextResponse } from "next/server";

import { getProducts } from "../../../../lib/products";

const SITE_URL = "https://repuestosgarces.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function getAbsoluteImageUrl(image: string) {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${SITE_URL}${image}`;
  }

  return `${SITE_URL}/${image}`;
}

export async function GET() {
  try {
    const products = await getProducts();

    const publicProducts = products
      .filter((product) => product.mostrarInfoPublica !== false)
      .filter(
        (product) =>
          product.imagen &&
          product.imagen !== "/products/placeholder.svg"
      )
      .map((product) => ({
        id: String(product.id),
        slug: product.slug,
        nombre: product.nombre,
        marcaVehiculo: product.marcaVehiculo,
        categoria: product.categoria,

        imagen: getAbsoluteImageUrl(product.imagen),

        codigoOEM: product.codigoOEM ?? null,

        stockDisponible:
          typeof product.stockDisponible === "boolean"
            ? product.stockDisponible
            : null,

        compatibilidad: product.compatibilidad ?? [],

        medidas: product.medidas ?? null,

        descripcion: product.descripcion ?? null,

        telefonoWhatsApp:
          product.mostrarMensajeWhatsApp !== false
            ? product.telefonoWhatsApp ?? null
            : null,
      }));

    return NextResponse.json(
      {
        ok: true,
        total: publicProducts.length,
        products: publicProducts,
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error cargando catálogo público:", error);

    return NextResponse.json(
      {
        ok: false,
        total: 0,
        products: [],
        error: "No se pudo cargar el catálogo.",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}