import { NextResponse } from "next/server";

const APK_URL =
  "https://80d0jsilzbb1p3ip.public.blob.vercel-storage.com/Repuestos-Garces-1.0.0.apk";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.redirect(APK_URL, {
    status: 307,
  });
}