import { NextResponse } from "next/server";
import { requirePermission } from "../../../../lib/admin-auth";
import { getDeletedProducts } from "../../../../lib/admin-audit";

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
        { error: "No tienes permisos para ver los repuestos eliminados." },
        { status: 403 }
      );
    }
  }

  return null;
}

export async function GET() {
  try {
    await requirePermission("canViewDeletedProducts");

    const deletedProducts = await getDeletedProducts();

    return NextResponse.json({
      deletedProducts,
    });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { error: "No se pudo cargar el historial de repuestos eliminados." },
      { status: 500 }
    );
  }
}