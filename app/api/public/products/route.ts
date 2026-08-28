import { NextResponse } from "next/server";

import { getProducts } from "../../../../lib/products";

const SITE_URL = "https://rggenuineparts.com";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function getAbsoluteImageUrl(image: string) {
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
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
      .filter(
        (product) =>
          product.mostrarInfoPublica !== false
      )
      .filter(
        (product) =>
          product.imagen &&
          product.imagen !==
            "/products/placeholder.svg"
      )
      .map((product) => ({
        id: String(product.id),

        slug: product.slug,

        nombre: product.nombre,

        marcaVehiculo:
          product.marcaVehiculo,

        categoria:
          product.categoria,

        imagen:
          getAbsoluteImageUrl(
            product.imagen
          ),

        codigoOEM:
          product.codigoOEM ?? null,

        stockDisponible:
          typeof product.stockDisponible ===
          "boolean"
            ? product.stockDisponible
            : null,

        compatibilidad:
          product.compatibilidad ?? [],

        medidas:
          product.medidas ?? null,

        descripcion:
          product.descripcion ?? null,

        telefonoWhatsApp:
          product.mostrarMensajeWhatsApp !==
          false
            ? product.telefonoWhatsApp ??
              null
            : null,

        /*
         * PRECIOS Y OFERTAS
         */

        precioRegular:
          typeof product.precioRegular ===
          "number"
            ? product.precioRegular
            : null,

        precioOferta:
          typeof product.precioOferta ===
          "number"
            ? product.precioOferta
            : null,

        ofertaActiva:
          product.ofertaActiva ?? false,

        ofertaInicio:
          product.ofertaInicio ?? null,

        ofertaFin:
          product.ofertaFin ?? null,

        tipoOferta:
          product.tipoOferta ?? "oferta",
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

          /*
           * Evitamos una caché larga porque
           * las ofertas se activan y vencen
           * por fecha y hora.
           */
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Error cargando catálogo público:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        total: 0,
        products: [],
        error:
          "No se pudo cargar el catálogo.",
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