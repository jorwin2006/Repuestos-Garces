import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sql } from "./db";
import type { AdminPermissions, SessionUser } from "./admin-types";
import { DEVELOPER_PERMISSIONS } from "./admin-types";

const SESSION_COOKIE = "rg_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type AdminUserRow = {
  id: string;
  username: string;
  password_hash: string;
  role: "developer" | "staff";
  permissions: Partial<AdminPermissions> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type AdminSessionRow = {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
};

type CountRow = {
  total: number;
};

function normalizePermissions(
  role: "developer" | "staff",
  permissions?: Partial<AdminPermissions> | null
): AdminPermissions {
  if (role === "developer") {
    return DEVELOPER_PERMISSIONS;
  }

  return {
    canCreateProduct: Boolean(permissions?.canCreateProduct),
    canEditProduct: Boolean(permissions?.canEditProduct),
    canDeleteProduct: Boolean(permissions?.canDeleteProduct),
    canUploadImage: Boolean(permissions?.canUploadImage),
    canViewActivity: Boolean(permissions?.canViewActivity),
    canViewDeletedProducts: Boolean(permissions?.canViewDeletedProducts),
    canManageUsers: Boolean(permissions?.canManageUsers),
  };
}

function mapUserRowToSessionUser(row: AdminUserRow): SessionUser {
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    permissions: normalizePermissions(row.role, row.permissions),
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getUserByUsername(username: string) {
  const rows = (await sql`
    SELECT *
    FROM admin_users
    WHERE username = ${username}
    LIMIT 1
  `) as AdminUserRow[];

  return rows[0] ?? null;
}

export async function getUserById(id: string) {
  const rows = (await sql`
    SELECT *
    FROM admin_users
    WHERE id = ${id}
    LIMIT 1
  `) as AdminUserRow[];

  return rows[0] ?? null;
}

export async function createSession(userId: string) {
  const token = randomUUID();
  const expiresAt = new Date(
    Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  ).toISOString();

  await sql`
    INSERT INTO admin_sessions (id, user_id, token, expires_at)
    VALUES (${randomUUID()}, ${userId}, ${token}, ${expiresAt})
  `;

  return { token, expiresAt };
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function getSessionUser() {
  const token = await getSessionTokenFromCookies();
  if (!token) return null;

  const sessionRows = (await sql`
    SELECT *
    FROM admin_sessions
    WHERE token = ${token}
    LIMIT 1
  `) as AdminSessionRow[];

  const session = sessionRows[0];
  if (!session) return null;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    await sql`
      DELETE FROM admin_sessions
      WHERE token = ${token}
    `;
    return null;
  }

  const user = await getUserById(session.user_id);
  if (!user || !user.is_active) return null;

  return mapUserRowToSessionUser(user);
}

export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requirePermission(permission: keyof AdminPermissions) {
  const user = await requireUser();

  if (user.role === "developer") {
    return user;
  }

  if (!user.permissions[permission]) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export async function deleteSessionByToken(token: string) {
  await sql`
    DELETE FROM admin_sessions
    WHERE token = ${token}
  `;
}

export async function createAdminUser(params: {
  username: string;
  passwordHash: string;
  role: "developer" | "staff";
  permissions: AdminPermissions;
}) {
  const rows = (await sql`
    INSERT INTO admin_users (
      id,
      username,
      password_hash,
      role,
      permissions,
      is_active,
      created_at,
      updated_at
    )
    VALUES (
      ${randomUUID()},
      ${params.username},
      ${params.passwordHash},
      ${params.role},
      ${JSON.stringify(params.permissions)}::jsonb,
      true,
      NOW(),
      NOW()
    )
    RETURNING *
  `) as AdminUserRow[];

  return rows[0];
}

export async function developerAlreadyExists() {
  const rows = (await sql`
    SELECT COUNT(*)::int AS total
    FROM admin_users
    WHERE role = 'developer'
  `) as CountRow[];

  return (rows[0]?.total ?? 0) > 0;
}