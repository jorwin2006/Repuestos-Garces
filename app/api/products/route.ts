import { NextRequest, NextResponse } from "next/server";
import { getProducts, removeProduct, upsertProduct, type ProductInput } from "../../../lib/products";

function isAuthorized(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get("x-admin-password");

  if (!adminPassword) {
    return {
      ok: false,
      reason:
        "Falta configurar ADMIN_PASSWORD en el archivo .env.local antes de usar el panel administrador.",
    };
  }

  if (provided !== adminPassword) {
    return { ok: false, reason: "Clave de administrador incorrecta." };
  }

  return { ok: true, reason: null };
}

export async function GET(request: NextRequest) {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: 401 });
  }

  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as ProductInput;

    if (!payload.nombre?.trim() || !payload.marcaVehiculo?.trim() || !payload.categoria?.trim()) {
      return NextResponse.json(
        { error: "Nombre, marca y categoría son obligatorios." },
        { status: 400 }
      );
    }

    const product = await upsertProduct(payload);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "No se pudo crear el producto." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as ProductInput;

    if (!payload.id) {
      return NextResponse.json({ error: "Falta el id del producto a editar." }, { status: 400 });
    }

    if (!payload.nombre?.trim() || !payload.marcaVehiculo?.trim() || !payload.categoria?.trim()) {
      return NextResponse.json(
        { error: "Nombre, marca y categoría son obligatorios." },
        { status: 400 }
      );
    }

    const product = await upsertProduct(payload);
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar el producto." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Falta el id del producto." }, { status: 400 });
  }

  try {
    await removeProduct(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar el producto." }, { status: 500 });
  }
}
