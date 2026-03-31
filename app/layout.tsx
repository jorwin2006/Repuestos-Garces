import "./globals.css";
import type { Metadata } from "next";
import SiteChrome from "../components/SiteChrome";

export const metadata: Metadata = {
  title: {
    default: "Repuestos Garces | Repuestos para camiones y buses",
    template: "%s | Repuestos Garces",
  },
  description:
    "Catálogo de repuestos para camiones y buses. Encuentra repuestos de calidad para HINO, ISUZU, MERCEDES-BENZ y más. Contamos con stock y envíos a nivel nacional.",
  metadataBase: new URL("https://repuestosgarces.com"),
  openGraph: {
    title: "Repuestos Garces",
    description:
      "Catálogo de repuestos para camiones y buses. Encuentra repuestos de calidad para HINO, ISUZU, MERCEDES-BENZ y más.",
    url: "https://repuestosgarces.com",
    siteName: "Repuestos Garces",
    images: [
      {
        url: "/products/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repuestos Garces",
    description: "Catálogo de repuestos para camiones y buses",
    images: ["/products/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/products/favicon_io/favicon.ico", sizes: "any" },
      {
        url: "/products/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/products/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/products/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/products/favicon_io/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}