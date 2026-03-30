import { NextRequest, NextResponse } from "next/server";
import {
  createAdminUser,
  getUserByUsername,
  hashPassword,
  requirePermission,
} from "../../../../lib/admin-auth";
import {
  EMPTY_STAFF_PERMISSIONS,
  type AdminPermissions,
} from "../../../../lib/admin-types";

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
        { error: "No tienes permisos para crear usuarios." },
        { status: 403 }
      );
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    await requirePermission("canManageUsers");

    const body = await request.json();
    const { username, password, permissions } = body ?? {};

    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Username y password son obligatorios." },
        { status: 400 }
      );
    }

    const existingUser = await getUserByUsername(username.trim());
    if (existingUser) {
      return NextResponse.json(
        { error: "Ese username ya existe." },
        { status: 409 }
      );
    }

    const finalPermissions: AdminPermissions = {
      ...EMPTY_STAFF_PERMISSIONS,
      ...(permissions ?? {}),
    };

    const passwordHash = await hashPassword(password.trim());

    const user = await createAdminUser({
      username: username.trim(),
      passwordHash,
      role: "staff",
      permissions: finalPermissions,
    });

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          permissions: finalPermissions,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { error: "No se pudo crear el usuario." },
      { status: 500 }
    );
  }
}