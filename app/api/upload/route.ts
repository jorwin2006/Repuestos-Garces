import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requirePermission } from "../../../lib/admin-auth";

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
        { error: "No tienes permisos para subir imágenes." },
        { status: 403 }
      );
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    await requirePermission("canUploadImage");

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
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("Error subiendo imagen a Blob:", error);

    return NextResponse.json(
      { error: "No se pudo subir la imagen." },
      { status: 500 }
    );
  }
}