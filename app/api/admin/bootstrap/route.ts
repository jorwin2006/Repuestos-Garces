import { NextRequest, NextResponse } from "next/server";
import { DEVELOPER_PERMISSIONS } from "../../../../lib/admin-types";
import {
  createAdminUser,
  developerAlreadyExists,
  getUserByUsername,
  hashPassword,
} from "../../../../lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const setupKey = process.env.BOOTSTRAP_SETUP_KEY;

    if (!setupKey) {
      return NextResponse.json(
        { error: "Falta configurar BOOTSTRAP_SETUP_KEY en .env.local." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { username, password, setupKey: providedKey } = body ?? {};

    if (providedKey !== setupKey) {
      return NextResponse.json(
        { error: "Clave de configuración incorrecta." },
        { status: 401 }
      );
    }

    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Username y password son obligatorios." },
        { status: 400 }
      );
    }

    const alreadyExists = await developerAlreadyExists();
    if (alreadyExists) {
      return NextResponse.json(
        { error: "Ya existe un usuario developer." },
        { status: 409 }
      );
    }

    const existingUser = await getUserByUsername(username.trim());
    if (existingUser) {
      return NextResponse.json(
        { error: "Ese username ya existe." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password.trim());

    const user = await createAdminUser({
      username: username.trim(),
      passwordHash,
      role: "developer",
      permissions: DEVELOPER_PERMISSIONS,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo crear el usuario developer." },
      { status: 500 }
    );
  }
}