import { NextResponse } from "next/server";
import { requirePermission } from "../../../../../lib/admin-auth";
import { getProductActivity } from "../../../../../lib/admin-audit";

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
        { error: "No tienes permisos para ver la actividad." },
        { status: 403 }
      );
    }
  }

  return null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("canViewActivity");

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Falta el id del producto." },
        { status: 400 }
      );
    }

    const activity = await getProductActivity(id);

    return NextResponse.json({ activity });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { error: "No se pudo cargar la actividad del producto." },
      { status: 500 }
    );
  }
}