"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ShowcaseProduct = {
  id: string;
  slug?: string;
  nombre: string;
  marcaVehiculo: string;
  categoria: string;
  imagen: string;
};

type ShowcaseSlide = {
  marca: string;
  products: ShowcaseProduct[];
};

type Props = {
  products: ShowcaseProduct[];
};

const AUTO_BRAND_INTERVAL_MS = 5000;
const VISIBLE_PRODUCTS = 3;

const BRAND_ORDER = [
  "HINO",
  "ISUZU",
  "NISSAN",
  "MERCEDES-BENZ",
  "VOLKSWAGEN",
  "YUTONG",
];

const brandLogos: Record<string, string> = {
  HINO: "/products/HINO/Hino2.png",
  ISUZU: "/products/ISUZU/isuzu1.png",
  NISSAN: "/products/NISSAN/nissan.png",
  MERCEDES: "/products/MERCEDES/mercedes-benz.png",
  "MERCEDES BENZ": "/products/MERCEDES/mercedes-benz.png",
  "MERCEDES-BENZ": "/products/MERCEDES/mercedes-benz.png",
  VOLKSWAGEN: "/products/VOLKSWAGEN/volkswagen1.png",
  YUTONG: "/products/YUTONG/yutong1.png",
};

const fallbackProducts: ShowcaseProduct[] = [
  {
    id: "fallback-1",
    nombre: "Hidrovac Freno",
    marcaVehiculo: "HINO",
    categoria: "Frenos",
    imagen: "/products/HINO/FRENOS/Hidrovac Freno.png",
  },
  {
    id: "fallback-2",
    nombre: "Balancín Motor",
    marcaVehiculo: "HINO",
    categoria: "Motor",
    imagen: "/products/HINO/MOTOR/balancin_motor.png",
  },
  {
    id: "fallback-3",
    nombre: "Bomba de Freno",
    marcaVehiculo: "HINO",
    categoria: "Frenos",
    imagen: "/products/Bomba_Freno_816_716.png",
  },
];

function normalizeBrandName(brand: string) {
  return brand.trim().toUpperCase();
}

function getBrandLogo(brand: string) {
  return brandLogos[normalizeBrandName(brand)] ?? "/products/Logo_Repuestos.png";
}

function getProductHref(product: ShowcaseProduct, brand: string) {
  if (product.slug) {
    return `/producto/${encodeURIComponent(product.slug)}`;
  }

  return `/marca/${encodeURIComponent(brand)}`;
}

function getVisibleProducts(products: ShowcaseProduct[], offset: number) {
  // Evita mostrar dos productos que usen exactamente la misma imagen
  const uniqueProducts = Array.from(
    new Map(products.map((product) => [product.imagen, product])).values()
  );

  // Si solamente existen 1, 2 o 3 imágenes, muestra las disponibles
  if (uniqueProducts.length <= VISIBLE_PRODUCTS) {
    return uniqueProducts;
  }

  // Generador pseudoaleatorio estable basado en el offset
  function seededRandom(seed: number) {
    const value = Math.sin(seed) * 10000;
    return value - Math.floor(value);
  }

  // Mezclamos los productos sin modificar el arreglo original
  const shuffled = [...uniqueProducts];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const seed = offset * 100 + i + 1;
    const j = Math.floor(seededRandom(seed) * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Mostramos máximo 3 productos diferentes
  return shuffled.slice(0, VISIBLE_PRODUCTS);
}

function buildSlides(products: ShowcaseProduct[]): ShowcaseSlide[] {
  const grouped = products.reduce<Record<string, ShowcaseProduct[]>>(
    (acc, product) => {
      const brand = normalizeBrandName(product.marcaVehiculo ?? "");

      if (!brand || !product.imagen) {
        return acc;
      }

      if (!acc[brand]) {
        acc[brand] = [];
      }

      const alreadyExists = acc[brand].some(
        (item) => item.id === product.id || item.slug === product.slug
      );

      if (!alreadyExists) {
        acc[brand].push(product);
      }

      return acc;
    },
    {}
  );

  const orderedSlides = BRAND_ORDER.map((brand) => ({
    marca: brand,
    products: grouped[brand] ?? [],
  })).filter((slide) => slide.products.length > 0);

  if (orderedSlides.length > 0) {
    return orderedSlides;
  }

  return [
    {
      marca: "HINO",
      products: fallbackProducts,
    },
  ];
}

export default function HomeShowcaseBanner({ products }: Props) {
  const slides = useMemo(() => buildSlides(products), [products]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [productOffsets, setProductOffsets] = useState<Record<string, number>>(
    {}
  );

  const activeSlide = slides[activeIndex] ?? slides[0];
  const currentProductOffset = productOffsets[activeSlide.marca] ?? 0;
  const isLongBrand = activeSlide.marca === "MERCEDES-BENZ";

  const visibleProducts = useMemo(
    () => getVisibleProducts(activeSlide.products, currentProductOffset),
    [activeSlide.products, currentProductOffset]
  );

  function resetTimer() {
    setTimerKey((current) => current + 1);
  }

  function handleBrandSelection(index: number) {
    const selectedSlide = slides[index];

    if (!selectedSlide) {
      return;
    }

    setActiveIndex(index);
    setProductOffsets((current) => ({
      ...current,
      [selectedSlide.marca]: 0,
    }));
    resetTimer();
  }

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % slides.length;
        const nextSlide = slides[nextIndex];

        if (nextSlide) {
          setProductOffsets((offsets) => ({
            ...offsets,
            [nextSlide.marca]: (offsets[nextSlide.marca] ?? 0) + 1,
          }));
        }

        return nextIndex;
      });
    }, AUTO_BRAND_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, timerKey, slides]);

  return (
    <section className="home-showcase-banner">
      <div className="home-showcase-copy">
        <div className="home-showcase-brand">
          <Image
            src="/products/Logo_Repuestos.png"
            alt="Logo Repuestos Garces"
            width={130}
            height={70}
            className="home-showcase-logo"
            priority
          />

          <span>Catálogo de repuestos</span>
        </div>

        <div className="home-showcase-title-area">

          <h1 className="home-showcase-title">
            <span className="home-showcase-title-prefix">
              Repuestos para tu
            </span>

            <strong
              className={`home-showcase-brand-name ${
                isLongBrand ? "is-long-brand" : ""
              }`}
            >
              {activeSlide.marca}
            </strong>
          </h1>
        </div>

        <p className="home-showcase-fixed-text">
          Encuentra repuestos por marca y por sistema: frenos, motor,
          transmisión, rodamiento y más.
        </p>

        <div className="home-showcase-actions">
          <Link
            href={`/marca/${encodeURIComponent(activeSlide.marca)}`}
            className="home-showcase-primary"
          >
            Ver {activeSlide.marca}
          </Link>

          <a href="#marcas" className="home-showcase-secondary">
            Ver marcas
          </a>
        </div>

        {slides.length > 1 && (
          <div className="home-showcase-brand-selector">
            {slides.map((slide, index) => (
              <button
                key={slide.marca}
                type="button"
                className={`home-showcase-brand-option ${
                  index === activeIndex ? "active" : ""
                }`}
                onClick={() => handleBrandSelection(index)}
                aria-label={`Ver repuestos ${slide.marca}`}
              >
                <Image
                  src={getBrandLogo(slide.marca)}
                  alt=""
                  width={44}
                  height={28}
                  className="home-showcase-brand-option-logo"
                />

                <span>{slide.marca}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        key={`visual-${activeSlide.marca}-${currentProductOffset}`}
        className="home-showcase-visual"
      >
        <div className="home-showcase-wave" aria-hidden="true" />

        <span className="home-showcase-watermark" aria-hidden="true">
          {activeSlide.marca}
        </span>

        {visibleProducts.map((product, index) => (
          <Link
            key={`${activeSlide.marca}-${product.id}-${index}`}
            href={getProductHref(product, activeSlide.marca)}
            className={`showcase-part showcase-part-clickable showcase-part-${
              index + 1
            }`}
            onClick={resetTimer}
            aria-label={`Ver detalles de ${product.nombre}`}
          >
            <Image
              src={product.imagen}
              alt={product.nombre}
              width={360}
              height={260}
              className="showcase-part-image"
              sizes="(max-width: 640px) 42vw, (max-width: 980px) 34vw, 360px"
              priority={activeIndex === 0 && index === 0}
            />

            <span className="showcase-part-label">{product.nombre}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
