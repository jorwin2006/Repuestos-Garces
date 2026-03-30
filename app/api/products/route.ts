import { NextRequest, NextResponse } from "next/server";
import {
  getProducts,
  removeProduct,
  upsertProduct,
  type ProductInput,
} from "../../../lib/products";
import { requirePermission, requireUser } from "../../../lib/admin-auth";
import { logDeletedProduct, logProductEdit } from "../../../lib/admin-audit";

function authErrorResponse(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "No autenticado." },
        { status: 401 }
      );
    }

    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "No tienes permisos para esta acción." },
        { status: 403 }
      );
    }
  }

  return null;
}

export async function GET() {
  try {
    await requireUser();

    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { error: "No se pudieron cargar los productos." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requirePermission("canCreateProduct");

    const payload = (await request.json()) as ProductInput;

    if (
      !payload.nombre?.trim() ||
      !payload.marcaVehiculo?.trim() ||
      !payload.categoria?.trim()
    ) {
      return NextResponse.json(
        { error: "Nombre, marca y categoría son obligatorios." },
        { status: 400 }
      );
    }

    const product = await upsertProduct(payload);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { error: "No se pudo crear el producto." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await requirePermission("canEditProduct");

    const payload = (await request.json()) as ProductInput;

    if (!payload.id) {
      return NextResponse.json(
        { error: "Falta el id del producto a editar." },
        { status: 400 }
      );
    }

    if (
      !payload.nombre?.trim() ||
      !payload.marcaVehiculo?.trim() ||
      !payload.categoria?.trim()
    ) {
      return NextResponse.json(
        { error: "Nombre, marca y categoría son obligatorios." },
        { status: 400 }
      );
    }

    const product = await upsertProduct(payload);

    if (currentUser.role !== "developer") {
      await logProductEdit({
        productId: product.id,
        userId: currentUser.id,
        username: currentUser.username,
      });
    }

    return NextResponse.json({ product });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { error: "No se pudo actualizar el producto." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await requirePermission("canDeleteProduct");

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Falta el id del producto." },
        { status: 400 }
      );
    }

    const products = await getProducts();
    const product = products.find((item) => item.id === id);

    if (!product) {
      return NextResponse.json(
        { error: "No se encontró el producto." },
        { status: 404 }
      );
    }

    if (currentUser.role !== "developer") {
      await logDeletedProduct({
        oldProductId: product.id,
        productName: product.nombre,
        userId: currentUser.id,
        username: currentUser.username,
      });
    }

    await removeProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { error: "No se pudo eliminar el producto." },
      { status: 500 }
    );
  }
}