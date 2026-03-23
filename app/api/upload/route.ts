import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

function sanitizeFileName(fileName: string) {
  const name = fileName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return name || `imagen-${Date.now()}.png`;
}

function isAuthorized(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get("x-admin-password");

  if (!adminPassword) {
    return { ok: false, reason: "Falta configurar ADMIN_PASSWORD." };
  }

  if (provided !== adminPassword) {
    return { ok: false, reason: "Clave de administrador incorrecta." };
  }

  return { ok: true, reason: null };
}

export async function POST(request: NextRequest) {
  const auth = isAuthorized(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió ninguna imagen." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: "Formato inválido. Usa JPG, PNG o WEBP." },
        { status: 400 }
      );
    }

    const safeName = `${Date.now()}-${sanitizeFileName(image.name)}`;

    const blob = await put(`products/${safeName}`, image, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({
      imageUrl: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error("Error subiendo imagen a Blob:", error);

    return NextResponse.json(
      { error: "No se pudo subir la imagen." },
      { status: 500 }
    );
  }
}