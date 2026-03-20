"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import type { ProductInput, Product } from "../../lib/products";

type Props = {
  initialProduct?: Product | null;
  adminPassword: string;
  onCancel: () => void;
  onSave: (payload: ProductInput) => Promise<void>;
};

type StockState = "" | "si" | "no";

function toTextareaValue(values?: string[]) {
  return values?.join("\n") ?? "";
}

export default function ProductForm({
  initialProduct,
  adminPassword,
  onCancel,
  onSave,
}: Props) {
  const [nombre, setNombre] = useState(initialProduct?.nombre ?? "");
  const [marcaVehiculo, setMarcaVehiculo] = useState(initialProduct?.marcaVehiculo ?? "");
  const [categoria, setCategoria] = useState(initialProduct?.categoria ?? "");
  const [codigoOEM, setCodigoOEM] = useState(initialProduct?.codigoOEM ?? "");
  const [telefonoWhatsApp, setTelefonoWhatsApp] = useState(
    initialProduct?.telefonoWhatsApp ?? ""
  );
  const [telefonoAlterno, setTelefonoAlterno] = useState(
    initialProduct?.telefonoAlterno ?? ""
  );
  const [medidas, setMedidas] = useState(initialProduct?.medidas ?? "");
  const [descripcion, setDescripcion] = useState(initialProduct?.descripcion ?? "");
  const [compatibilidad, setCompatibilidad] = useState(
    toTextareaValue(initialProduct?.compatibilidad)
  );
  const [retiroLocal, setRetiroLocal] = useState(initialProduct?.envios?.retiroLocal ?? "");
  const [deliveryLocal, setDeliveryLocal] = useState(
    initialProduct?.envios?.deliveryLocal ?? ""
  );
  const [enviosNacionales, setEnviosNacionales] = useState(
    initialProduct?.envios?.enviosNacionales ?? ""
  );
  const [mostrarInfoPublica, setMostrarInfoPublica] = useState(
    initialProduct?.mostrarInfoPublica ?? true
  );
  const [mostrarMensajeWhatsApp, setMostrarMensajeWhatsApp] = useState(
    initialProduct?.mostrarMensajeWhatsApp ?? true
  );
  const [imageUrl, setImageUrl] = useState(initialProduct?.imagen ?? "");
  const [stockEstado, setStockEstado] = useState<StockState>(
    typeof initialProduct?.stockDisponible === "boolean"
      ? initialProduct.stockDisponible
        ? "si"
        : "no"
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewImage = useMemo(() => imageUrl || "/products/placeholder.svg", [imageUrl]);

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-admin-password": adminPassword,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo subir la imagen.");
      }

      setImageUrl(data.imageUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: ProductInput = {
        id: initialProduct?.id,
        nombre,
        marcaVehiculo,
        categoria,
        imagen: imageUrl,
        codigoOEM,
        stockDisponible:
          stockEstado === "" ? undefined : stockEstado === "si",
        telefonoWhatsApp,
        telefonoAlterno,
        medidas,
        descripcion,
        compatibilidad: compatibilidad
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        envios: {
          retiroLocal,
          deliveryLocal,
          enviosNacionales,
        },
        mostrarInfoPublica,
        mostrarMensajeWhatsApp,
      };

      await onSave(payload);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div>
            <h2>{initialProduct ? "Editar repuesto" : "Nuevo repuesto"}</h2>
            <p>Los campos vacíos no se mostrarán en la ficha pública.</p>
          </div>
          <button type="button" className="admin-close-btn" onClick={onCancel}>
            ×
          </button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <label>
              <span>Nombre del repuesto *</span>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </label>

            <label>
              <span>Marca *</span>
              <input
                value={marcaVehiculo}
                onChange={(e) => setMarcaVehiculo(e.target.value)}
                required
              />
            </label>

            <label>
              <span>Categoría *</span>
              <input value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
            </label>

            <label>
              <span>¿Stock disponible?</span>
              <select value={stockEstado} onChange={(e) => setStockEstado(e.target.value as StockState)}>
                <option value="">No mostrar</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </label>

            <label>
              <span>Código OEM</span>
              <input value={codigoOEM} onChange={(e) => setCodigoOEM(e.target.value)} />
            </label>

            <label>
              <span>Teléfono WhatsApp</span>
              <input
                value={telefonoWhatsApp}
                onChange={(e) => setTelefonoWhatsApp(e.target.value)}
                placeholder="593991657178"
              />
            </label>

            <label>
              <span>Teléfono alterno</span>
              <input
                value={telefonoAlterno}
                onChange={(e) => setTelefonoAlterno(e.target.value)}
                placeholder="0991234567"
              />
            </label>

            <label>
              <span>Medidas</span>
              <input value={medidas} onChange={(e) => setMedidas(e.target.value)} />
            </label>
          </div>

          <label>
            <span>Descripción</span>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ejemplo: Balancín para motor Hino, venta por unidad."
            />
          </label>

          <label>
            <span>Compatibilidad (una por línea)</span>
            <textarea
              rows={4}
              value={compatibilidad}
              onChange={(e) => setCompatibilidad(e.target.value)}
              placeholder={"Hino J05C\nHino J08CT"}
            />
          </label>

          <div className="admin-form-grid">
            <label>
              <span>Retiro en local</span>
              <textarea rows={3} value={retiroLocal} onChange={(e) => setRetiroLocal(e.target.value)} />
            </label>

            <label>
              <span>Delivery local</span>
              <textarea
                rows={3}
                value={deliveryLocal}
                onChange={(e) => setDeliveryLocal(e.target.value)}
              />
            </label>

            <label>
              <span>Envíos nacionales</span>
              <textarea
                rows={3}
                value={enviosNacionales}
                onChange={(e) => setEnviosNacionales(e.target.value)}
              />
            </label>
          </div>

          <div className="admin-form-grid admin-image-grid">
            <label>
              <span>Ruta o URL de imagen</span>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/products/HINO/MOTOR/balancin_motor.png"
              />
            </label>

            <label>
              <span>Subir imagen</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
              <small>{uploading ? "Subiendo imagen..." : "Puedes subir JPG, PNG o WEBP."}</small>
            </label>

            <div className="admin-image-preview">
              <span>Vista previa</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewImage} alt="Vista previa del repuesto" />
            </div>
          </div>

          <div className="admin-switches">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={mostrarInfoPublica}
                onChange={(e) => setMostrarInfoPublica(e.target.checked)}
              />
              <span>Mostrar producto públicamente</span>
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={mostrarMensajeWhatsApp}
                onChange={(e) => setMostrarMensajeWhatsApp(e.target.checked)}
              />
              <span>Mostrar mensaje de WhatsApp</span>
            </label>
          </div>

          {error && <p className="admin-error">{error}</p>}

          <div className="admin-actions-row">
            <button type="button" className="admin-secondary-btn" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="admin-primary-btn" disabled={saving || uploading}>
              {saving ? "Guardando..." : initialProduct ? "Guardar cambios" : "Crear repuesto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
