import { NextResponse } from "next/server";

export const dynamic =
  "force-dynamic";

export async function GET() {
  const apkUrl =
    process.env.APP_APK_URL;

  if (!apkUrl) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "La aplicación todavía no está disponible para descarga.",
      },
      {
        status: 503,
      }
    );
  }

  return NextResponse.redirect(
    apkUrl,
    {
      status: 307,
    }
  );
}