"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import type {
  OfferType,
  Product,
  ProductInput,
} from "../../lib/products";

type Props = {
  initialProduct?: Product | null;
  onCancel: () => void;
  onSave: (payload: ProductInput) => Promise<void>;
};

type StockState = "" | "si" | "no";

function toTextareaValue(values?: string[]) {
  return values?.join("\n") ?? "";
}

function toLocalDateTimeInput(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() - offset * 60_000
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}

function toIsoDate(value: string) {
  if (!value) return undefined;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

export default function ProductForm({
  initialProduct,
  onCancel,
  onSave,
}: Props) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [nombre, setNombre] = useState(
    initialProduct?.nombre ?? ""
  );

  const [marcaVehiculo, setMarcaVehiculo] =
    useState(
      initialProduct?.marcaVehiculo ?? ""
    );

  const [categoria, setCategoria] = useState(
    initialProduct?.categoria ?? ""
  );

  const [codigoOEM, setCodigoOEM] = useState(
    initialProduct?.codigoOEM ?? ""
  );

  const [
    telefonoWhatsApp,
    setTelefonoWhatsApp,
  ] = useState(
    initialProduct?.telefonoWhatsApp ?? ""
  );

  const [telefonoAlterno, setTelefonoAlterno] =
    useState(
      initialProduct?.telefonoAlterno ?? ""
    );

  const [medidas, setMedidas] = useState(
    initialProduct?.medidas ?? ""
  );

  const [descripcion, setDescripcion] =
    useState(
      initialProduct?.descripcion ?? ""
    );

  const [compatibilidad, setCompatibilidad] =
    useState(
      toTextareaValue(
        initialProduct?.compatibilidad
      )
    );

  const [retiroLocal, setRetiroLocal] =
    useState(
      initialProduct?.envios?.retiroLocal ?? ""
    );

  const [deliveryLocal, setDeliveryLocal] =
    useState(
      initialProduct?.envios?.deliveryLocal ??
        ""
    );

  const [
    enviosNacionales,
    setEnviosNacionales,
  ] = useState(
    initialProduct?.envios
      ?.enviosNacionales ?? ""
  );

  const [
    mostrarInfoPublica,
    setMostrarInfoPublica,
  ] = useState(
    initialProduct?.mostrarInfoPublica ?? true
  );

  const [
    mostrarMensajeWhatsApp,
    setMostrarMensajeWhatsApp,
  ] = useState(
    initialProduct
      ?.mostrarMensajeWhatsApp ?? true
  );

  const [imageUrl, setImageUrl] = useState(
    initialProduct?.imagen ?? ""
  );

  const [stockEstado, setStockEstado] =
    useState<StockState>(
      typeof initialProduct
        ?.stockDisponible === "boolean"
        ? initialProduct.stockDisponible
          ? "si"
          : "no"
        : ""
    );

  // OFERTAS
  const [
    ofertaActiva,
    setOfertaActiva,
  ] = useState(
    initialProduct?.ofertaActiva ?? false
  );

  const [
    precioRegular,
    setPrecioRegular,
  ] = useState(
    initialProduct?.precioRegular !==
      undefined
      ? String(
          initialProduct.precioRegular
        )
      : ""
  );

  const [
    precioOferta,
    setPrecioOferta,
  ] = useState(
    initialProduct?.precioOferta !==
      undefined
      ? String(
          initialProduct.precioOferta
        )
      : ""
  );

  const [tipoOferta, setTipoOferta] =
    useState<OfferType>(
      initialProduct?.tipoOferta ?? "oferta"
    );

  const [
    ofertaInicio,
    setOfertaInicio,
  ] = useState(
    toLocalDateTimeInput(
      initialProduct?.ofertaInicio
    )
  );

  const [ofertaFin, setOfertaFin] =
    useState(
      toLocalDateTimeInput(
        initialProduct?.ofertaFin
      )
    );

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const previewImage = useMemo(
    () =>
      imageUrl ||
      "/products/placeholder.svg",
    [imageUrl]
  );

  async function handleFileUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "No se pudo subir la imagen."
        );
      }

      setImageUrl(data.imageUrl);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Error al subir la imagen."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleClearImage() {
    setImageUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setError(null);

    const regular =
      precioRegular.trim() === ""
        ? undefined
        : Number(precioRegular);

    const oferta =
      precioOferta.trim() === ""
        ? undefined
        : Number(precioOferta);

    if (
      regular !== undefined &&
      (!Number.isFinite(regular) ||
        regular < 0)
    ) {
      setError(
        "El precio regular no es válido."
      );
      return;
    }

    if (
      oferta !== undefined &&
      (!Number.isFinite(oferta) ||
        oferta < 0)
    ) {
      setError(
        "El precio de oferta no es válido."
      );
      return;
    }

    if (ofertaActiva) {
      if (regular === undefined) {
        setError(
          "Ingrese el precio regular para activar la oferta."
        );
        return;
      }

      if (oferta === undefined) {
        setError(
          "Ingrese el precio de oferta."
        );
        return;
      }

      if (oferta >= regular) {
        setError(
          "El precio de oferta debe ser menor que el precio regular."
        );
        return;
      }
    }

    const inicioISO =
      toIsoDate(ofertaInicio);

    const finISO =
      toIsoDate(ofertaFin);

    if (
      inicioISO &&
      finISO &&
      new Date(finISO).getTime() <=
        new Date(inicioISO).getTime()
    ) {
      setError(
        "La fecha de finalización debe ser posterior a la fecha de inicio."
      );
      return;
    }

    try {
      setSaving(true);

      const payload: ProductInput = {
        id: initialProduct?.id,

        nombre,
        marcaVehiculo,
        categoria,
        imagen: imageUrl,

        codigoOEM,

        stockDisponible:
          stockEstado === ""
            ? undefined
            : stockEstado === "si",

        telefonoWhatsApp,
        telefonoAlterno,
        medidas,
        descripcion,

        compatibilidad:
          compatibilidad
            .split("\n")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),

        envios: {
          retiroLocal,
          deliveryLocal,
          enviosNacionales,
        },

        mostrarInfoPublica,
        mostrarMensajeWhatsApp,

        precioRegular: regular,
        precioOferta: oferta,
        ofertaActiva,
        ofertaInicio: inicioISO,
        ofertaFin: finISO,
        tipoOferta,
      };

      await onSave(payload);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar el producto."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div>
            <h2>
              {initialProduct
                ? "Editar repuesto"
                : "Nuevo repuesto"}
            </h2>

            <p>
              Los campos vacíos no se
              mostrarán en la ficha pública.
            </p>
          </div>

          <button
            type="button"
            className="admin-close-btn"
            onClick={onCancel}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-form-grid">
            <label>
              <span>
                Nombre del repuesto *
              </span>

              <input
                value={nombre}
                onChange={(e) =>
                  setNombre(
                    e.target.value
                  )
                }
                required
              />
            </label>

            <label>
              <span>Marca *</span>

              <input
                value={marcaVehiculo}
                onChange={(e) =>
                  setMarcaVehiculo(
                    e.target.value
                  )
                }
                required
              />
            </label>

            <label>
              <span>Categoría *</span>

              <input
                value={categoria}
                onChange={(e) =>
                  setCategoria(
                    e.target.value
                  )
                }
                required
              />
            </label>

            <label>
              <span>
                ¿Stock disponible?
              </span>

              <select
                value={stockEstado}
                onChange={(e) =>
                  setStockEstado(
                    e.target
                      .value as StockState
                  )
                }
              >
                <option value="">
                  No mostrar
                </option>

                <option value="si">
                  Sí
                </option>

                <option value="no">
                  No
                </option>
              </select>
            </label>

            <label>
              <span>Código OEM</span>

              <input
                value={codigoOEM}
                onChange={(e) =>
                  setCodigoOEM(
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              <span>
                Teléfono WhatsApp
              </span>

              <input
                value={telefonoWhatsApp}
                onChange={(e) =>
                  setTelefonoWhatsApp(
                    e.target.value
                  )
                }
                placeholder="593991657178"
              />
            </label>

            <label>
              <span>
                Teléfono alterno
              </span>

              <input
                value={telefonoAlterno}
                onChange={(e) =>
                  setTelefonoAlterno(
                    e.target.value
                  )
                }
                placeholder="0991234567"
              />
            </label>

            <label>
              <span>Medidas</span>

              <input
                value={medidas}
                onChange={(e) =>
                  setMedidas(
                    e.target.value
                  )
                }
              />
            </label>
          </div>

          <label>
            <span>Descripción</span>

            <textarea
              rows={4}
              value={descripcion}
              onChange={(e) =>
                setDescripcion(
                  e.target.value
                )
              }
              placeholder="Ejemplo: Balancín para motor Hino, venta por unidad."
            />
          </label>

          <label>
            <span>
              Compatibilidad (una por
              línea)
            </span>

            <textarea
              rows={4}
              value={compatibilidad}
              onChange={(e) =>
                setCompatibilidad(
                  e.target.value
                )
              }
              placeholder={
                "Hino J05C\nHino J08CT"
              }
            />
          </label>

          {/* OFERTAS */}
          <div
            style={{
              border:
                "1px solid #dbe4f0",
              borderRadius: 16,
              padding: 18,
              marginTop: 8,
              background: "#f8fafc",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "flex-start",
                justifyContent:
                  "space-between",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <strong
                  style={{
                    display: "block",
                    fontSize: 17,
                  }}
                >
                  Oferta / Promoción
                </strong>

                <small>
                  Controle promociones
                  temporales del producto.
                </small>
              </div>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={ofertaActiva}
                  onChange={(e) =>
                    setOfertaActiva(
                      e.target.checked
                    )
                  }
                />

                <span>
                  Activar oferta
                </span>
              </label>
            </div>

            <div className="admin-form-grid">
              <label>
                <span>
                  Precio regular
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioRegular}
                  onChange={(e) =>
                    setPrecioRegular(
                      e.target.value
                    )
                  }
                  placeholder="120.00"
                />
              </label>

              <label>
                <span>
                  Precio de oferta
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioOferta}
                  onChange={(e) =>
                    setPrecioOferta(
                      e.target.value
                    )
                  }
                  placeholder="89.00"
                />
              </label>

              <label>
                <span>
                  Tipo de promoción
                </span>

                <select
                  value={tipoOferta}
                  onChange={(e) =>
                    setTipoOferta(
                      e.target
                        .value as OfferType
                    )
                  }
                >
                  <option value="oferta">
                    Oferta
                  </option>

                  <option value="remate">
                    Remate
                  </option>

                  <option value="liquidacion">
                    Liquidación
                  </option>
                </select>
              </label>

              <label>
                <span>
                  Inicia
                </span>

                <input
                  type="datetime-local"
                  value={ofertaInicio}
                  onChange={(e) =>
                    setOfertaInicio(
                      e.target.value
                    )
                  }
                />
              </label>

              <label>
                <span>
                  Finaliza
                </span>

                <input
                  type="datetime-local"
                  value={ofertaFin}
                  onChange={(e) =>
                    setOfertaFin(
                      e.target.value
                    )
                  }
                />
              </label>
            </div>

            <p
              style={{
                margin:
                  "12px 0 0",
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.5,
              }}
            >
              Si deja la fecha de inicio
              vacía, la oferta podrá
              mostrarse inmediatamente.
              Si deja la fecha final vacía,
              permanecerá activa hasta que
              usted la desactive.
            </p>
          </div>

          <div className="admin-form-grid">
            <label>
              <span>
                Retiro en local
              </span>

              <textarea
                rows={3}
                value={retiroLocal}
                onChange={(e) =>
                  setRetiroLocal(
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              <span>
                Delivery local
              </span>

              <textarea
                rows={3}
                value={deliveryLocal}
                onChange={(e) =>
                  setDeliveryLocal(
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              <span>
                Envíos nacionales
              </span>

              <textarea
                rows={3}
                value={enviosNacionales}
                onChange={(e) =>
                  setEnviosNacionales(
                    e.target.value
                  )
                }
              />
            </label>
          </div>

          <div className="admin-form-grid admin-image-grid">
            <label>
              <span>
                Ruta o URL de imagen
              </span>

              <input
                value={imageUrl}
                onChange={(e) =>
                  setImageUrl(
                    e.target.value
                  )
                }
                placeholder="/products/HINO/MOTOR/balancin_motor.png"
              />
            </label>

            <label>
              <span>
                Subir imagen
              </span>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handleFileUpload
                }
              />

              <small>
                {uploading
                  ? "Subiendo imagen..."
                  : "Puede subir JPG, PNG o WEBP."}
              </small>
            </label>

            <div className="admin-image-preview">
              <span>
                Vista previa
              </span>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="Vista previa del repuesto"
              />

              <button
                type="button"
                className="admin-remove-image-btn"
                onClick={handleClearImage}
                disabled={
                  !imageUrl &&
                  !fileInputRef.current
                    ?.value
                }
              >
                Quitar imagen
              </button>
            </div>
          </div>

          <div className="admin-switches">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={
                  mostrarInfoPublica
                }
                onChange={(e) =>
                  setMostrarInfoPublica(
                    e.target.checked
                  )
                }
              />

              <span>
                Mostrar producto
                públicamente
              </span>
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={
                  mostrarMensajeWhatsApp
                }
                onChange={(e) =>
                  setMostrarMensajeWhatsApp(
                    e.target.checked
                  )
                }
              />

              <span>
                Mostrar mensaje de
                WhatsApp
              </span>
            </label>
          </div>

          {error ? (
            <p className="admin-error">
              {error}
            </p>
          ) : null}

          <div className="admin-actions-row">
            <button
              type="button"
              className="admin-secondary-btn"
              onClick={onCancel}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="admin-primary-btn"
              disabled={
                saving || uploading
              }
            >
              {saving
                ? "Guardando..."
                : initialProduct
                ? "Guardar cambios"
                : "Crear repuesto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}