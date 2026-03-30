import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../lib/admin-auth";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "No autenticado." },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json(
      { error: "No se pudo obtener la sesión." },
      { status: 500 }
    );
  }
}