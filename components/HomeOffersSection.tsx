"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Product } from "../lib/products";

type Props = {
  products: Product[];
};

function getDateTime(value?: string) {
  if (!value) return null;

  const time = new Date(value).getTime();

  return Number.isFinite(time)
    ? time
    : null;
}

function isOfferActive(
  product: Product,
  now: number
) {
  if (!product.ofertaActiva) {
    return false;
  }

  const regular =
    product.precioRegular;

  const offer =
    product.precioOferta;

  if (
    regular === undefined ||
    offer === undefined ||
    regular <= 0 ||
    offer < 0 ||
    offer >= regular
  ) {
    return false;
  }

  const start =
    getDateTime(
      product.ofertaInicio
    );

  const end =
    getDateTime(
      product.ofertaFin
    );

  if (
    start !== null &&
    now < start
  ) {
    return false;
  }

  if (
    end !== null &&
    now >= end
  ) {
    return false;
  }

  return true;
}

function getDiscountPercentage(
  regular: number,
  offer: number
) {
  return Math.round(
    ((regular - offer) /
      regular) *
      100
  );
}

function formatPrice(
  value: number
) {
  return new Intl.NumberFormat(
    "es-EC",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }
  ).format(value);
}

function getOfferLabel(
  product: Product
) {
  switch (product.tipoOferta) {
    case "remate":
      return "REMATE";

    case "liquidacion":
      return "LIQUIDACIÓN";

    default:
      return "OFERTA";
  }
}

function getRemainingTime(
  endDate: string | undefined,
  now: number
) {
  if (!endDate) {
    return "Oferta vigente";
  }

  const end =
    getDateTime(endDate);

  if (end === null) {
    return "Oferta vigente";
  }

  const difference =
    end - now;

  if (difference <= 0) {
    return "Oferta finalizada";
  }

  const totalSeconds =
    Math.floor(
      difference / 1000
    );

  const days =
    Math.floor(
      totalSeconds / 86400
    );

  const hours =
    Math.floor(
      (totalSeconds % 86400) /
        3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60
    );

  if (days > 0) {
    return `Termina en ${days} ${
      days === 1
        ? "día"
        : "días"
    } ${hours} h ${minutes} min`;
  }

  if (hours > 0) {
    return `Termina en ${hours} h ${minutes} min`;
  }

  if (minutes > 0) {
    return `Termina en ${minutes} min`;
  }

  return "Termina en menos de 1 min";
}

export default function HomeOffersSection({
  products,
}: Props) {
  const [now, setNow] =
    useState<number | null>(null);

  const [expanded, setExpanded] =
    useState(false);

  const carouselRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      setNow(Date.now());
    };

    updateTime();

    const interval =
      window.setInterval(
        updateTime,
        1000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, []);

  const activeOffers =
    useMemo(() => {
      if (now === null) {
        return [];
      }

      return products
        .filter(
          (product) =>
            product
              .mostrarInfoPublica !==
            false
        )
        .filter((product) =>
          isOfferActive(
            product,
            now
          )
        )
        .sort((a, b) => {
          const endA =
            getDateTime(
              a.ofertaFin
            ) ??
            Number.MAX_SAFE_INTEGER;

          const endB =
            getDateTime(
              b.ofertaFin
            ) ??
            Number.MAX_SAFE_INTEGER;

          return endA - endB;
        });
    }, [products, now]);

  if (
    now === null ||
    activeOffers.length === 0
  ) {
    return null;
  }

const total = activeOffers.length;

const singleOffer = total === 1;

// Solo permitimos el modo expandido
// cuando realmente hay 4 o más ofertas.
const isExpanded =
  expanded && total >= 4;

const carouselMode =
  total >= 4 && !isExpanded;

  const scrollCarousel = (
    direction: "left" | "right"
  ) => {
    const element =
      carouselRef.current;

    if (!element) return;

    const amount =
      Math.max(
        240,
        element.clientWidth *
          0.8
      );

    element.scrollBy({
      left:
        direction === "left"
          ? -amount
          : amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={[
        "home-offers-section",
        singleOffer
          ? "home-offers-single"
          : "",
        carouselMode
          ? "home-offers-carousel-mode"
          : "",
        isExpanded
          ? "home-offers-expanded"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="home-offers-title"
    >
      <div className="home-offers-header">
        <div>
          <h2 id="home-offers-title">
            Ofertas
          </h2>

          <p>
            Precios especiales por
            tiempo limitado.
          </p>
        </div>

        {total <= 3 ? (
          <span className="home-offers-count">
            {total}{" "}
            {total === 1
              ? "oferta vigente"
              : "ofertas vigentes"}
          </span>
        ) : null}
      </div>

      <div className="home-offers-content-area">
        {carouselMode ? (
          <button
            type="button"
            className="home-offers-arrow home-offers-arrow-left"
            onClick={() =>
              scrollCarousel("left")
            }
            aria-label="Ver ofertas anteriores"
          >
            ‹
          </button>
        ) : null}

        <div
          ref={carouselRef}
          className={[
            "home-offers-grid",
            carouselMode
              ? "is-carousel"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {activeOffers.map(
            (product) => {
              const regular =
                product
                  .precioRegular!;

              const offer =
                product
                  .precioOferta!;

              const discount =
                getDiscountPercentage(
                  regular,
                  offer
                );

              const savings =
                regular - offer;

              return (
                <article
                  key={product.id}
                  className="home-offer-card"
                >
                  <Link
                    href={`/producto/${product.slug}`}
                    className="home-offer-image-wrap"
                  >
                    <Image
                      src={
                        product.imagen ||
                        "/products/placeholder.svg"
                      }
                      alt={
                        product.nombre
                      }
                      width={420}
                      height={300}
                      className="home-offer-image"
                      sizes={
                        singleOffer
                          ? "(max-width: 680px) 100vw, 205px"
                          : "(max-width: 680px) 48vw, 220px"
                      }
                    />

                    <span className="home-offer-badge">
                      🔥{" "}
                      {getOfferLabel(
                        product
                      )}
                    </span>

                    <span className="home-offer-discount">
                      -{discount}%
                    </span>
                  </Link>

                  <div className="home-offer-content">
                    <div className="home-offer-meta">
                      <span>
                        {
                          product.marcaVehiculo
                        }
                      </span>

                      <span>
                        {
                          product.categoria
                        }
                      </span>
                    </div>

                    <Link
                      href={`/producto/${product.slug}`}
                      className="home-offer-name"
                    >
                      {product.nombre}
                    </Link>

                    {product.codigoOEM ? (
                      <div className="home-offer-oem">
                        OEM:{" "}
                        {
                          product.codigoOEM
                        }
                      </div>
                    ) : null}

                    <div className="home-offer-prices">
                      <div>
                        <span className="home-offer-price-label">
                          Precio regular
                        </span>

                        <span className="home-offer-old-price">
                          {formatPrice(
                            regular
                          )}
                        </span>
                      </div>

                      <div>
                        <span className="home-offer-price-label">
                          Precio oferta
                        </span>

                        <strong className="home-offer-new-price">
                          {formatPrice(
                            offer
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="home-offer-bottom">
                      <div className="home-offer-saving">
                        Ahorra{" "}
                        <strong>
                          {formatPrice(
                            savings
                          )}
                        </strong>
                      </div>

                      <div className="home-offer-timer">
                        <span
                          aria-hidden="true"
                        >
                          ◷
                        </span>

                        <strong>
                          {getRemainingTime(
                            product.ofertaFin,
                            now
                          )}
                        </strong>
                      </div>
                    </div>

                    <Link
                      href={`/producto/${product.slug}`}
                      className="home-offer-button"
                    >
                      Ver repuesto

                      <span
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              );
            }
          )}
        </div>

        {carouselMode ? (
          <button
            type="button"
            className="home-offers-arrow home-offers-arrow-right"
            onClick={() =>
              scrollCarousel("right")
            }
            aria-label="Ver más ofertas"
          >
            ›
          </button>
        ) : null}
      </div>

      {total >= 4 ? (
        <div className="home-offers-more-row">
          <button
            type="button"
            className="home-offers-more-button"
            onClick={() =>
              setExpanded(
                (current) =>
                  !current
              )
            }
          >
            {isExpanded
              ? "Mostrar menos"
              : `Ver todas las ofertas (${total})`}

            <span
              aria-hidden="true"
            >
              {isExpanded
                ? "↑"
                : "→"}
            </span>
          </button>
        </div>
      ) : null}
    </section>
  );
}