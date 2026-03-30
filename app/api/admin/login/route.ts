import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  getUserByUsername,
  setSessionCookie,
  verifyPassword,
} from "../../../../lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};

    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Username y password son obligatorios." },
        { status: 400 }
      );
    }

    const user = await getUserByUsername(username.trim());

    if (!user || !user.is_active) {
      return NextResponse.json(
        { error: "Credenciales inválidas." },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(
      password.trim(),
      user.password_hash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Credenciales inválidas." },
        { status: 401 }
      );
    }

    const session = await createSession(user.id);
    await setSessionCookie(session.token);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.role === "developer" ? {
          canCreateProduct: true,
          canEditProduct: true,
          canDeleteProduct: true,
          canUploadImage: true,
          canViewActivity: true,
          canViewDeletedProducts: true,
          canManageUsers: true,
        } : user.permissions,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo iniciar sesión." },
      { status: 500 }
    );
  }
}