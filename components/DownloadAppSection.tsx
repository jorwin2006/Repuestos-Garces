"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

import styles from "./DownloadAppSection.module.css";

const DOWNLOAD_URL =
  "https://rggenuineparts.com/api/app/download";

export default function DownloadAppSection() {
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    let active = true;

    async function generateQr() {
      try {
        const dataUrl = await QRCode.toDataURL(
          DOWNLOAD_URL,
          {
            width: 320,
            margin: 1,
            errorCorrectionLevel: "M",
          }
        );

        if (active) {
          setQrCode(dataUrl);
        }
      } catch (error) {
        console.error(
          "No fue posible generar el código QR:",
          error
        );
      }
    }

    void generateQr();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="descargar-app"
      className={styles.section}
    >
      <div className={styles.shell}>
        {/* INFORMACIÓN */}

        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <span className={styles.androidIcon}>
              ↓
            </span>

            <span>
              APP PARA ANDROID
            </span>
          </div>

          <h2 className={styles.title}>
            Lleve Repuestos Garces
            en su celular
          </h2>

          <p className={styles.description}>
            Consulte nuestro catálogo,
            encuentre repuestos por marca,
            revise ofertas y prepare su
            cotización directamente desde
            la aplicación.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>
                ✓
              </span>

              <span>
                Catálogo actualizado
              </span>
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>
                ✓
              </span>

              <span>
                Búsqueda por marca y categoría
              </span>
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>
                ✓
              </span>

              <span>
                Ofertas y cotizaciones
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <a
              href={DOWNLOAD_URL}
              className={styles.downloadButton}
            >
              <span className={styles.downloadButtonIcon}>
                ↓
              </span>

              <span>
                <strong>
                  Descargar APP
                </strong>

                <small>
                  Para dispositivos Android
                </small>
              </span>
            </a>

            <div className={styles.version}>
              <span className={styles.versionDot} />

              <div>
                <strong>
                  Versión 1.0.0
                </strong>

                <span>
                  Descarga oficial
                </span>
              </div>
            </div>
          </div>

          {/* INSTRUCCIÓN ANDROID */}

          <div className={styles.installNotice}>
            <div className={styles.noticeIcon}>
              !
            </div>

            <div>
              <strong>
                Instalación en Android
              </strong>

              <p>
                Android puede solicitar autorización
                para instalar aplicaciones desde su
                navegador. Permita la instalación
                únicamente cuando el archivo haya sido
                descargado desde{" "}
                <strong>
                  rggenuineparts.com
                </strong>.
              </p>
            </div>
          </div>
        </div>

        {/* QR */}

        <div className={styles.qrColumn}>
          <div className={styles.phoneCard}>
            <div className={styles.appLogoWrap}>
              <Image
                src="/products/Logo_Repuestos.png"
                alt="Repuestos Garces App"
                width={92}
                height={92}
                className={styles.appLogo}
              />
            </div>

            <span className={styles.appSmall}>
              REPUESTOS GARCES
            </span>

            <strong className={styles.appName}>
              Aplicación móvil
            </strong>

            <span className={styles.appPlatform}>
              Android
            </span>
          </div>

          <div className={styles.qrCard}>
            <div className={styles.qrHeader}>
              <span className={styles.qrIcon}>
                ▦
              </span>

              <div>
                <strong>
                  Escanee para descargar
                </strong>

                <span>
                  Use la cámara de su celular
                </span>
              </div>
            </div>

            <div className={styles.qrWrap}>
              {qrCode ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrCode}
                  alt="Código QR para descargar Repuestos Garces App"
                  className={styles.qrImage}
                />
              ) : (
                <div className={styles.qrLoading}>
                  Generando QR...
                </div>
              )}
            </div>

            <p className={styles.qrFooter}>
              Descarga directa desde el sitio
              oficial de Repuestos Garces.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}