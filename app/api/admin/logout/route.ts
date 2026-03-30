import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  deleteSessionByToken,
  getSessionTokenFromCookies,
} from "../../../../lib/admin-auth";

export async function POST() {
  try {
    const token = await getSessionTokenFromCookies();

    if (token) {
      await deleteSessionByToken(token);
    }

    await clearSessionCookie();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo cerrar sesión." },
      { status: 500 }
    );
  }
}