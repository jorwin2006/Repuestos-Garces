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

function normalize(value?: string | null) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function parsePositiveInteger(
  value: string | null,
  fallback: number
) {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number < 1
  ) {
    return fallback;
  }

  return Math.floor(number);
}

function getTimestamp(value?: string | null) {
  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();

  return Number.isFinite(time)
    ? time
    : null;
}

function isOfferActive(
  product: Awaited<
    ReturnType<typeof getProducts>
  >[number],
  now: number
) {
  if (!product.ofertaActiva) {
    return false;
  }

  const regular =
    product.precioRegular;

  const offer =
    product.precioOferta;

  if (
    typeof regular !== "number" ||
    typeof offer !== "number" ||
    regular <= 0 ||
    offer < 0 ||
    offer >= regular
  ) {
    return false;
  }

  const start =
    getTimestamp(
      product.ofertaInicio
    );

  const end =
    getTimestamp(
      product.ofertaFin
    );

  if (
    start !== null &&
    now < start
  ) {
    return false;
  }

  if (
    end !== null &&
    now >= end
  ) {
    return false;
  }

  return true;
}

function matchesSearch(
  product: Awaited<
    ReturnType<typeof getProducts>
  >[number],
  query: string
) {
  const needle = normalize(query);

  if (!needle) {
    return true;
  }

  const fields = [
    product.nombre,
    product.codigoOEM,
    product.marcaVehiculo,
    product.categoria,
    product.descripcion,
    product.medidas,
    ...(product.compatibilidad ?? []),
  ];

  return fields.some((field) =>
    normalize(field).includes(needle)
  );
}

function mapPublicProduct(
  product: Awaited<
    ReturnType<typeof getProducts>
  >[number]
) {
  return {
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

    /* PRECIOS Y OFERTAS */

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
      product.ofertaActiva ??
      false,

    ofertaInicio:
      product.ofertaInicio ?? null,

    ofertaFin:
      product.ofertaFin ?? null,

    tipoOferta:
      product.tipoOferta ??
      "oferta",
  };
}

export async function GET(
  request: Request
) {
  try {
    const url =
      new URL(request.url);

    const params =
      url.searchParams;

    /*
     * FILTROS DISPONIBLES
     *
     * q
     * marca
     * categoria
     * ofertas=true
     * slug
     * page
     * pageSize
     */

    const query =
      params.get("q")?.trim() ??
      "";

    const marca =
      params
        .get("marca")
        ?.trim() ?? "";

    const categoria =
      params
        .get("categoria")
        ?.trim() ?? "";

    const slug =
      params
        .get("slug")
        ?.trim() ?? "";

    const ofertas =
      params.get("ofertas") ===
        "true" ||
      params.get("ofertas") ===
        "1";

    /*
     * Mantenemos compatibilidad
     * con la app actual.
     *
     * Solo paginamos si la petición
     * envía page o pageSize.
     */

    const paginationRequested =
      params.has("page") ||
      params.has("pageSize");

    const requestedPage =
      parsePositiveInteger(
        params.get("page"),
        1
      );

    const requestedPageSize =
      Math.min(
        parsePositiveInteger(
          params.get("pageSize"),
          20
        ),
        50
      );

    const now =
      Date.now();

    const products =
      await getProducts();

    /*
     * PRODUCTOS PÚBLICOS
     */

    const publicProducts =
      products
        .filter(
          (product) =>
            product.mostrarInfoPublica !==
            false
        )
        .filter(
          (product) =>
            product.imagen &&
            product.imagen !==
              "/products/placeholder.svg"
        );

    /*
     * CATEGORÍAS DE LA MARCA
     *
     * Se calculan antes de aplicar
     * categoría y búsqueda para que
     * la APP pueda construir todos
     * los filtros disponibles.
     */

    const productsForCategories =
      marca
        ? publicProducts.filter(
            (product) =>
              normalize(
                product.marcaVehiculo
              ) ===
              normalize(marca)
          )
        : publicProducts;

    const categories =
      Array.from(
        new Set(
          productsForCategories
            .map(
              (product) =>
                product.categoria
            )
            .filter(Boolean)
        )
      ).sort((a, b) =>
        a.localeCompare(
          b,
          "es"
        )
      );

    /*
     * FILTROS
     */

    let filtered =
      [...publicProducts];

    /*
     * Buscar un solo producto
     * por slug o id.
     */

    if (slug) {
      filtered =
        filtered.filter(
          (product) =>
            product.slug ===
              slug ||
            String(product.id) ===
              slug
        );
    }

    /*
     * Marca
     */

    if (marca) {
      filtered =
        filtered.filter(
          (product) =>
            normalize(
              product.marcaVehiculo
            ) ===
            normalize(marca)
        );
    }

    /*
     * Categoría
     */

    if (categoria) {
      filtered =
        filtered.filter(
          (product) =>
            normalize(
              product.categoria
            ) ===
            normalize(categoria)
        );
    }

    /*
     * Buscador
     *
     * Busca en:
     * - nombre
     * - OEM
     * - marca
     * - categoría
     * - descripción
     * - medidas
     * - compatibilidad
     */

    if (query) {
      filtered =
        filtered.filter(
          (product) =>
            matchesSearch(
              product,
              query
            )
        );
    }

    /*
     * Solo ofertas vigentes
     */

    if (ofertas) {
      filtered =
        filtered.filter(
          (product) =>
            isOfferActive(
              product,
              now
            )
        );

      /*
       * Las promociones que
       * terminan primero aparecen
       * antes.
       */

      filtered.sort(
        (a, b) => {
          const endA =
            getTimestamp(
              a.ofertaFin
            ) ??
            Number.MAX_SAFE_INTEGER;

          const endB =
            getTimestamp(
              b.ofertaFin
            ) ??
            Number.MAX_SAFE_INTEGER;

          return endA - endB;
        }
      );
    } else {
      /*
       * Orden normal alfabético.
       */

      filtered.sort(
        (a, b) =>
          a.nombre.localeCompare(
            b.nombre,
            "es"
          )
      );
    }

    /*
     * PAGINACIÓN
     */

    const total =
      filtered.length;

    let page = 1;

    let pageSize =
      total;

    let totalPages =
      total > 0 ? 1 : 0;

    let paginatedProducts =
      filtered;

    if (paginationRequested) {
      page =
        requestedPage;

      pageSize =
        requestedPageSize;

      totalPages =
        Math.max(
          1,
          Math.ceil(
            total / pageSize
          )
        );

      /*
       * Si alguien pide una página
       * demasiado alta, devolvemos
       * simplemente una lista vacía.
       */

      const start =
        (page - 1) *
        pageSize;

      const end =
        start +
        pageSize;

      paginatedProducts =
        filtered.slice(
          start,
          end
        );
    }

    const publicResult =
      paginatedProducts.map(
        mapPublicProduct
      );

    return NextResponse.json(
      {
        ok: true,

        /*
         * PAGINACIÓN
         */

        page,
        pageSize,
        total,
        totalPages,

        /*
         * FILTROS DISPONIBLES
         */

        categories,

        /*
         * RESULTADOS
         */

        products:
          publicResult,
      },
      {
        status: 200,

        headers: {
          ...corsHeaders,

          /*
           * Las promociones y el
           * inventario pueden cambiar
           * en cualquier momento.
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

        page: 1,
        pageSize: 0,
        total: 0,
        totalPages: 0,

        categories: [],

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
  return new NextResponse(
    null,
    {
      status: 204,
      headers: corsHeaders,
    }
  );
}