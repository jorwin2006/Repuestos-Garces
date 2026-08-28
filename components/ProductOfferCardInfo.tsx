"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./ProductOfferCardInfo.module.css";

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

function getTime(value?: string) {
  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();

  return Number.isFinite(time)
    ? time
    : null;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function getLabel(type?: OfferType) {
  switch (type) {
    case "remate":
      return "REMATE";

    case "liquidacion":
      return "LIQUIDACIÓN";

    default:
      return "OFERTA";
  }
}

export default function ProductOfferCardInfo({
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

    /*
      Cada 10 segundos verificamos si
      la promoción continúa vigente.
      Si vence, desaparece automáticamente.
    */
    const interval = window.setInterval(
      update,
      10_000
    );

    return () => {
      window.clearInterval(interval);
    };
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
      getTime(ofertaInicio);

    const end =
      getTime(ofertaFin);

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

    const ahorro =
      precioRegular - precioOferta;

    const porcentaje = Math.round(
      (ahorro / precioRegular) * 100
    );

    return {
      porcentaje,
      ahorro,
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
    precioRegular === undefined ||
    precioOferta === undefined
  ) {
    return null;
  }

  return (
    <div
      className={styles.offer}
      aria-label={`${getLabel(
        tipoOferta
      )} ${offer.porcentaje}% de descuento`}
    >
      <div className={styles.top}>
        <span className={styles.badge}>
          🔥 {getLabel(tipoOferta)}
        </span>
      </div>

      <div className={styles.prices}>
        <span className={styles.oldPrice}>
          {formatPrice(precioRegular)}
        </span>

        <strong
          className={styles.newPrice}
        >
          {formatPrice(precioOferta)}
        </strong>

        <span className={styles.discount}>
          -{offer.porcentaje}%
        </span>
      </div>
    </div>
  );
}