"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./ProductOfferPanel.module.css";

type OfferType =
  | "oferta"
  | "remate"
  | "liquidacion";

type Props = {
  precioRegular?: number;
  precioOferta?: number;
  ofertaActiva?: boolean;
  ofertaInicio?: string;
  ofertaFin?: string;
  tipoOferta?: OfferType;
};

function getTimestamp(value?: string) {
  if (!value) return null;

  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : null;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function getOfferLabel(
  type?: OfferType
) {
  switch (type) {
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
    return "Promoción vigente";
  }

  const end = getTimestamp(endDate);

  if (end === null) {
    return "Promoción vigente";
  }

  const difference = end - now;

  if (difference <= 0) {
    return "Promoción finalizada";
  }

  const totalSeconds = Math.floor(
    difference / 1000
  );

  const days = Math.floor(
    totalSeconds / 86400
  );

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  if (days > 0) {
    return `Termina en ${days} ${
      days === 1 ? "día" : "días"
    } ${hours} h ${minutes} min`;
  }

  if (hours > 0) {
    return `Termina en ${hours} h ${minutes} min`;
  }

  if (minutes > 0) {
    return `Termina en ${minutes} min`;
  }

  return "Termina en menos de 1 minuto";
}

export default function ProductOfferPanel({
  precioRegular,
  precioOferta,
  ofertaActiva,
  ofertaInicio,
  ofertaFin,
  tipoOferta,
}: Props) {
  const [now, setNow] =
    useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      setNow(Date.now());
    };

    update();

    const interval = window.setInterval(
      update,
      1000
    );

    return () =>
      window.clearInterval(interval);
  }, []);

  const offer = useMemo(() => {
    if (
      now === null ||
      !ofertaActiva ||
      precioRegular === undefined ||
      precioOferta === undefined ||
      precioRegular <= 0 ||
      precioOferta < 0 ||
      precioOferta >= precioRegular
    ) {
      return null;
    }

    const start =
      getTimestamp(ofertaInicio);

    const end =
      getTimestamp(ofertaFin);

    if (
      start !== null &&
      now < start
    ) {
      return null;
    }

    if (
      end !== null &&
      now >= end
    ) {
      return null;
    }

    const saving =
      precioRegular - precioOferta;

    const percentage = Math.round(
      (saving / precioRegular) * 100
    );

    return {
      saving,
      percentage,
    };
  }, [
    now,
    ofertaActiva,
    ofertaInicio,
    ofertaFin,
    precioRegular,
    precioOferta,
  ]);

  if (
    !offer ||
    now === null ||
    precioRegular === undefined ||
    precioOferta === undefined
  ) {
    return null;
  }

  return (
    <section
      className={styles.offer}
      aria-label="Oferta vigente"
    >
      <div className={styles.topRow}>
        <div className={styles.badge}>
          <span className={styles.flame}>
            🔥
          </span>

          {getOfferLabel(tipoOferta)}
        </div>

        <div
          className={styles.discount}
        >
          -{offer.percentage}%
        </div>
      </div>

      <div className={styles.heading}>
        <div>
          <span
            className={styles.eyebrow}
          >
            PRECIO ESPECIAL
          </span>

          <h2>
            Aproveche esta promoción
          </h2>
        </div>
      </div>

      <div className={styles.prices}>
        <div className={styles.priceBox}>
          <span
            className={styles.priceLabel}
          >
            Precio regular
          </span>

          <span
            className={styles.oldPrice}
          >
            {formatMoney(
              precioRegular
            )}
          </span>
        </div>

        <div
          className={`${styles.priceBox} ${styles.featuredPrice}`}
        >
          <span
            className={styles.priceLabel}
          >
            Precio oferta
          </span>

          <strong
            className={styles.newPrice}
          >
            {formatMoney(
              precioOferta
            )}
          </strong>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.saving}>
          <span>Usted ahorra</span>

          <strong>
            {formatMoney(
              offer.saving
            )}
          </strong>
        </div>

        <div className={styles.timer}>
          <span aria-hidden="true">
            ◷
          </span>

          <strong>
            {getRemainingTime(
              ofertaFin,
              now
            )}
          </strong>
        </div>
      </div>
    </section>
  );
}