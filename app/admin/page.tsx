"use client";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import ProductForm from "./ProductForm";
import type { Product, ProductInput } from "../../lib/products";
import type { SessionUser } from "../../lib/admin-types";

type SortOption =
  | "updated-desc"
  | "updated-asc"
  | "name-asc"
  | "name-desc"
  | "brand-asc"
  | "brand-desc";

type ProductActivityItem = {
  id: string;
  productId: string;
  userId: string;
  username: string;
  action: "EDITAR";
  createdAt: string;
};

type DeletedProductItem = {
  id: string;
  oldProductId: string;
  productName: string;
  userId: string;
  username: string;
  createdAt: string;
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statLabel}>{label}</span>
      <strong style={styles.statValue}>{value}</strong>
      <span style={styles.statHint}>{hint}</span>
    </div>
  );
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalCard}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>{title}</h2>
            {subtitle ? <p style={styles.modalSubtitle}>{subtitle}</p> : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={styles.closeButton}
          >
            ×
          </button>
        </div>

        <div>{children}</div>

        {footer ? <div style={styles.modalFooter}>{footer}</div> : null}
      </div>
    </div>
  );
}

function formatDateTime(dateValue?: string) {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleString("es-EC", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatDateOnly(dateValue: string) {
  return new Date(dateValue).toLocaleDateString("es-EC");
}

function formatTimeOnly(dateValue: string) {
  return new Date(dateValue).toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function BackgroundVideo() {
  return (
    <>
      <div style={styles.videoLayer}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={styles.videoElement}
        >
          <source src="/videos/admin-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div style={styles.videoOverlay} />
    </>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated-desc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [activityProduct, setActivityProduct] = useState<Product | null>(null);
  const [activityRows, setActivityRows] = useState<ProductActivityItem[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const [showDeletedProductsModal, setShowDeletedProductsModal] =
    useState(false);
  const [deletedProductRows, setDeletedProductRows] = useState<
    DeletedProductItem[]
  >([]);
  const [loadingDeletedProducts, setLoadingDeletedProducts] = useState(false);

  useEffect(() => {
    void restoreSession();
  }, []);

  async function restoreSession() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/me");
      if (!response.ok) {
        setUser(null);
        setProducts([]);
        return;
      }

      const data = await response.json();
      setUser(data.user ?? null);

      await loadProducts();
    } catch (sessionError) {
      setUser(null);
      setProducts([]);
      setError(
        sessionError instanceof Error
          ? sessionError.message
          : "No se pudo restaurar la sesión."
      );
    } finally {
      setLoading(false);
      setSessionChecked(true);
    }
  }

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/products");
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          setProducts([]);
          setError("Tu sesión expiró. Inicia sesión nuevamente.");
          return;
        }

        throw new Error(data.error || "No se pudieron cargar los productos.");
      }

      setProducts(data.products ?? []);
    } catch (loadError) {
      setProducts([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Error al cargar productos."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo iniciar sesión.");
      }

      setUser(data.user ?? null);
      setPasswordInput("");
      await loadProducts();
    } catch (loginError) {
      setUser(null);
      setProducts([]);
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Error al iniciar sesión."
      );
    } finally {
      setLoading(false);
      setSessionChecked(true);
    }
  }

  async function handleLogout() {
    try {
      setLoading(true);
      setError(null);

      await fetch("/api/admin/logout", {
        method: "POST",
      });

      setUser(null);
      setProducts([]);
      setUsernameInput("");
      setPasswordInput("");
      setSearch("");
      setIsFormOpen(false);
      setEditingProduct(null);
      setActivityProduct(null);
      setActivityRows([]);
      setShowDeletedProductsModal(false);
      setDeletedProductRows([]);
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "No se pudo cerrar sesión."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(payload: ProductInput) {
    const isEditing = Boolean(payload.id);

    const response = await fetch("/api/products", {
      method: isEditing ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo guardar el producto.");
    }

    setIsFormOpen(false);
    setEditingProduct(null);
    await loadProducts();

    if (activityProduct?.id === data.product?.id) {
      await openActivity(data.product);
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este repuesto?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/products?id=${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "No se pudo eliminar el repuesto.");
      return;
    }

    if (activityProduct?.id === id) {
      setActivityProduct(null);
      setActivityRows([]);
    }

    await loadProducts();

    if (showDeletedProductsModal) {
      await openDeletedProductsModal();
    }
  }

  function openCreateForm() {
    setEditingProduct(null);
    setIsFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setIsFormOpen(true);
  }

  async function openActivity(product: Product) {
    try {
      setLoadingActivity(true);
      setError(null);

      const response = await fetch(`/api/products/${product.id}/activity`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo cargar la actividad del producto."
        );
      }

      setActivityProduct(product);
      setActivityRows(data.activity ?? []);
    } catch (activityError) {
      setError(
        activityError instanceof Error
          ? activityError.message
          : "No se pudo cargar la actividad."
      );
    } finally {
      setLoadingActivity(false);
    }
  }

  function closeActivityModal() {
    setActivityProduct(null);
    setActivityRows([]);
  }

  async function openDeletedProductsModal() {
    try {
      setLoadingDeletedProducts(true);
      setError(null);

      const response = await fetch("/api/admin/deleted-products");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "No se pudo cargar el historial de eliminaciones."
        );
      }

      setDeletedProductRows(data.deletedProducts ?? []);
      setShowDeletedProductsModal(true);
    } catch (deletedError) {
      setError(
        deletedError instanceof Error
          ? deletedError.message
          : "No se pudo cargar el historial de eliminaciones."
      );
    } finally {
      setLoadingDeletedProducts(false);
    }
  }

  function closeDeletedProductsModal() {
    setShowDeletedProductsModal(false);
    setDeletedProductRows([]);
  }

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    const base = !term
      ? products
      : products.filter((product) => {
          return [
            product.nombre,
            product.marcaVehiculo,
            product.categoria,
            product.codigoOEM,
            product.telefonoWhatsApp,
            product.telefonoAlterno,
            product.medidas,
            product.descripcion,
            ...(product.compatibilidad ?? []),
          ]
            .filter(Boolean)
            .some(
              (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(term)
            );
        });

    const sorted = [...base].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.nombre.localeCompare(b.nombre, "es");
        case "name-desc":
          return b.nombre.localeCompare(a.nombre, "es");
        case "brand-asc":
          return a.marcaVehiculo.localeCompare(b.marcaVehiculo, "es");
        case "brand-desc":
          return b.marcaVehiculo.localeCompare(a.marcaVehiculo, "es");
        case "updated-asc":
          return (
            new Date(a.updatedAt ?? a.createdAt ?? 0).getTime() -
            new Date(b.updatedAt ?? b.createdAt ?? 0).getTime()
          );
        case "updated-desc":
        default:
          return (
            new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
            new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
          );
      }
    });

    return sorted;
  }, [products, search, sortBy]);

  const totalProducts = products.length;
  const visibleProducts = products.filter(
    (product) => product.mostrarInfoPublica !== false
  ).length;
  const availableProducts = products.filter(
    (product) => product.stockDisponible === true
  ).length;
  const hiddenProducts = products.filter(
    (product) => product.mostrarInfoPublica === false
  ).length;

  if (!sessionChecked) {
    return (
      <div style={styles.pageShell}>
        <BackgroundVideo />
        <div style={styles.pageContent}>
          <div style={styles.centerWrap}>
            <div style={styles.loginCard}>
              <span style={styles.loginBadge}>Acceso privado</span>
              <h1 style={styles.loginTitle}>Panel de administración</h1>
              <p style={styles.loginText}>Verificando sesión...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.pageShell}>
        <BackgroundVideo />
        <div style={styles.pageContent}>
          <div style={styles.centerWrap}>
            <div style={styles.loginCard}>
              <span style={styles.loginBadge}>Acceso privado</span>
              <h1 style={styles.loginTitle}>Panel de administración</h1>
              <p style={styles.loginText}>
                Inicia sesión con tu usuario y contraseña para gestionar repuestos.
              </p>

              <div style={styles.loginForm}>
                <label style={styles.fieldGroup}>
                  <span style={styles.fieldLabel}>Usuario</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Ingresa tu usuario"
                    autoComplete="username"
                    style={styles.input}
                  />
                </label>

                <label style={styles.fieldGroup}>
                  <span style={styles.fieldLabel}>Contraseña</span>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    style={styles.input}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={
                    !usernameInput.trim() || !passwordInput.trim() || loading
                  }
                  style={{
                    ...styles.primaryButton,
                    ...(loading ||
                    !usernameInput.trim() ||
                    !passwordInput.trim()
                      ? styles.buttonDisabled
                      : {}),
                  }}
                >
                  {loading ? "Entrando..." : "Entrar al panel"}
                </button>
              </div>

              {error ? <div style={styles.errorBox}>{error}</div> : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageShell}>
      <BackgroundVideo />
      <div style={styles.pageContent}>
        <div style={styles.adminContainer}>
          <section style={styles.heroCard}>
            <div style={styles.heroTextWrap}>
              <span style={styles.heroBadge}>Administrador</span>
              <h1 style={styles.heroTitle}>Panel de repuestos</h1>
              <p style={styles.heroText}>
                Gestiona productos, revisa actividad y controla el historial de
                eliminaciones desde un solo lugar.
              </p>
              <p style={styles.sessionText}>
                Sesión iniciada como <strong>{user.username}</strong> ({user.role})
              </p>
            </div>

            <div style={styles.heroActions}>
              <button
                type="button"
                onClick={openDeletedProductsModal}
                style={styles.secondaryButton}
              >
                Repuestos eliminados
              </button>

              <button
                type="button"
                onClick={handleLogout}
                style={styles.ghostButton}
              >
                Cerrar sesión
              </button>

              <button
                type="button"
                onClick={openCreateForm}
                style={styles.primaryButton}
              >
                + Nuevo repuesto
              </button>
            </div>
          </section>

          <section style={styles.statsGrid}>
            <StatCard
              label="Total de repuestos"
              value={totalProducts}
              hint="Inventario registrado"
            />
            <StatCard
              label="Visibles al público"
              value={visibleProducts}
              hint="Se muestran en catálogo"
            />
            <StatCard
              label="Con stock visible"
              value={availableProducts}
              hint="Marcados como disponibles"
            />
            <StatCard
              label="Ocultos"
              value={hiddenProducts}
              hint="No visibles en la web"
            />
          </section>

          <section style={styles.toolbarCard}>
            <div style={styles.toolbarTop}>
              <div>
                <h2 style={styles.sectionTitle}>Productos</h2>
                <p style={styles.sectionText}>
                  Mostrando {filteredProducts.length} de {products.length} repuestos
                </p>
              </div>

              <div style={styles.toolbarControls}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre, marca, categoría u OEM..."
                  style={{ ...styles.input, minWidth: "280px" }}
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  style={styles.select}
                >
                  <option value="updated-desc">Más recientes primero</option>
                  <option value="updated-asc">Más antiguos primero</option>
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                  <option value="brand-asc">Marca A-Z</option>
                  <option value="brand-desc">Marca Z-A</option>
                </select>
              </div>
            </div>

            {error ? <div style={styles.errorBox}>{error}</div> : null}
            {loading ? (
              <p style={styles.sectionText}>Cargando productos...</p>
            ) : null}

            <div style={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <article key={product.id} style={styles.productCard}>
                  <div style={styles.productImageWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      style={styles.productImage}
                    />
                  </div>

                  <div style={styles.productBody}>
                    <div style={styles.productTop}>
                      <h3 style={styles.productTitle}>{product.nombre}</h3>
                      <span style={styles.productUpdated}>
                        {formatDateTime(product.updatedAt ?? product.createdAt)}
                      </span>
                    </div>

                    <div style={styles.metaGrid}>
                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Marca</span>
                        <span style={styles.metaValue}>{product.marcaVehiculo}</span>
                      </div>

                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Categoría</span>
                        <span style={styles.metaValue}>{product.categoria}</span>
                      </div>

                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>OEM</span>
                        <span style={styles.metaValue}>
                          {product.codigoOEM || "No definido"}
                        </span>
                      </div>

                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Estado</span>
                        <span style={styles.metaValue}>
                          <span
                            style={{
                              ...styles.badge,
                              ...(product.stockDisponible
                                ? styles.badgeOk
                                : styles.badgeMuted),
                            }}
                          >
                            {typeof product.stockDisponible === "boolean"
                              ? product.stockDisponible
                                ? "Disponible"
                                : "No disponible"
                              : "No visible"}
                          </span>
                        </span>
                      </div>

                      <div style={styles.metaItem}>
                        <span style={styles.metaLabel}>Público</span>
                        <span style={styles.metaValue}>
                          <span
                            style={{
                              ...styles.badge,
                              ...(product.mostrarInfoPublica === false
                                ? styles.badgeDanger
                                : styles.badgeOk),
                            }}
                          >
                            {product.mostrarInfoPublica === false ? "No" : "Sí"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div style={styles.cardActions}>
                      <button
                        type="button"
                        onClick={() => openActivity(product)}
                        style={styles.secondaryButton}
                      >
                        Ver actividad
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditForm(product)}
                        style={styles.ghostButton}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        style={styles.dangerButton}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {!loading && filteredProducts.length === 0 ? (
              <div style={styles.emptyState}>
                No se encontraron repuestos con ese criterio.
              </div>
            ) : null}
          </section>

          {isFormOpen ? (
            <ProductForm
              initialProduct={editingProduct}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingProduct(null);
              }}
              onSave={handleSave}
            />
          ) : null}

          {activityProduct ? (
            <ModalShell
              title="Actividad del repuesto"
              subtitle={activityProduct.nombre}
              onClose={closeActivityModal}
              footer={
                <button
                  type="button"
                  onClick={closeActivityModal}
                  style={styles.secondaryButton}
                >
                  Cerrar
                </button>
              }
            >
              {loadingActivity ? (
                <p style={styles.sectionText}>Cargando actividad...</p>
              ) : activityRows.length === 0 ? (
                <div style={styles.emptyState}>
                  Este repuesto todavía no tiene actividad registrada.
                </div>
              ) : (
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHead}>Usuario</th>
                        <th style={styles.tableHead}>Acción</th>
                        <th style={styles.tableHead}>Fecha</th>
                        <th style={styles.tableHead}>Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityRows.map((row) => (
                        <tr key={row.id}>
                          <td style={styles.tableCell}>{row.username}</td>
                          <td style={styles.tableCell}>{row.action}</td>
                          <td style={styles.tableCell}>
                            {formatDateOnly(row.createdAt)}
                          </td>
                          <td style={styles.tableCell}>
                            {formatTimeOnly(row.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ModalShell>
          ) : null}

          {showDeletedProductsModal ? (
            <ModalShell
              title="Repuestos eliminados"
              subtitle="Historial general de eliminaciones registradas."
              onClose={closeDeletedProductsModal}
              footer={
                <button
                  type="button"
                  onClick={closeDeletedProductsModal}
                  style={styles.secondaryButton}
                >
                  Cerrar
                </button>
              }
            >
              {loadingDeletedProducts ? (
                <p style={styles.sectionText}>Cargando historial...</p>
              ) : deletedProductRows.length === 0 ? (
                <div style={styles.emptyState}>
                  No hay repuestos eliminados registrados todavía.
                </div>
              ) : (
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHead}>Usuario</th>
                        <th style={styles.tableHead}>Repuesto eliminado</th>
                        <th style={styles.tableHead}>Fecha</th>
                        <th style={styles.tableHead}>Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deletedProductRows.map((row) => (
                        <tr key={row.id}>
                          <td style={styles.tableCell}>{row.username}</td>
                          <td style={styles.tableCell}>{row.productName}</td>
                          <td style={styles.tableCell}>
                            {formatDateOnly(row.createdAt)}
                          </td>
                          <td style={styles.tableCell}>
                            {formatTimeOnly(row.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ModalShell>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  pageShell: {
    position: "relative",
    minHeight: "100vh",
    padding: "32px 20px 56px",
    overflow: "hidden",
    background: "#020617",
  },
  videoLayer: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    overflow: "hidden",
  },
  videoElement: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.28) saturate(0.85) blur(2px)",
  },
  videoOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    background:
      "linear-gradient(180deg, rgba(2,6,23,0.72) 0%, rgba(2,6,23,0.82) 45%, rgba(2,6,23,0.92) 100%)",
  },
  pageContent: {
    position: "relative",
    zIndex: 2,
  },
  centerWrap: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginCard: {
    width: "100%",
    maxWidth: "460px",
    background: "rgba(15, 23, 42, 0.88)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.35)",
    backdropFilter: "blur(14px)",
  },
  loginBadge: {
    display: "inline-flex",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "rgba(59, 130, 246, 0.18)",
    color: "#93c5fd",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    marginBottom: "16px",
  },
  loginTitle: {
    fontSize: "34px",
    lineHeight: 1.1,
    color: "#f8fafc",
    margin: 0,
    fontWeight: 800,
  },
  loginText: {
    color: "#cbd5e1",
    marginTop: "10px",
    marginBottom: "24px",
    fontSize: "15px",
    lineHeight: 1.6,
  },
  loginForm: {
    display: "grid",
    gap: "16px",
  },
  fieldGroup: {
    display: "grid",
    gap: "8px",
  },
  fieldLabel: {
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    borderRadius: "14px",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "rgba(255, 255, 255, 0.04)",
    color: "#f8fafc",
    padding: "14px 16px",
    fontSize: "15px",
    outline: "none",
  },
  select: {
    borderRadius: "14px",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "rgba(15, 23, 42, 0.88)",
    color: "#f8fafc",
    padding: "14px 16px",
    fontSize: "15px",
    minWidth: "220px",
  },
  primaryButton: {
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    padding: "14px 18px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.30)",
  },
  secondaryButton: {
    border: "1px solid rgba(148, 163, 184, 0.24)",
    borderRadius: "14px",
    background: "rgba(255, 255, 255, 0.04)",
    color: "#e2e8f0",
    padding: "12px 16px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
  ghostButton: {
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: "14px",
    background: "transparent",
    color: "#cbd5e1",
    padding: "12px 16px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
  dangerButton: {
    border: "1px solid rgba(248, 113, 113, 0.24)",
    borderRadius: "14px",
    background: "rgba(127, 29, 29, 0.18)",
    color: "#fecaca",
    padding: "12px 16px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  errorBox: {
    marginTop: "16px",
    borderRadius: "14px",
    padding: "14px 16px",
    background: "rgba(127, 29, 29, 0.30)",
    border: "1px solid rgba(248, 113, 113, 0.22)",
    color: "#fecaca",
    fontSize: "14px",
  },
  adminContainer: {
    width: "100%",
    maxWidth: "1280px",
    margin: "0 auto",
    display: "grid",
    gap: "24px",
  },
  heroCard: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "20px",
    padding: "28px",
    borderRadius: "28px",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(15,23,42,0.86) 55%, rgba(30,64,175,0.38) 100%)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.25)",
  },
  heroTextWrap: {
    flex: "1 1 420px",
  },
  heroBadge: {
    display: "inline-flex",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "rgba(59, 130, 246, 0.18)",
    color: "#93c5fd",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    marginBottom: "14px",
  },
  heroTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "36px",
    fontWeight: 800,
    lineHeight: 1.08,
  },
  heroText: {
    marginTop: "10px",
    marginBottom: "12px",
    color: "#cbd5e1",
    maxWidth: "720px",
    lineHeight: 1.6,
  },
  sessionText: {
    margin: 0,
    color: "#e2e8f0",
    fontSize: "14px",
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "12px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  statCard: {
    borderRadius: "22px",
    padding: "20px",
    background: "rgba(15, 23, 42, 0.86)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    boxShadow: "0 18px 40px rgba(0, 0, 0, 0.18)",
    display: "grid",
    gap: "8px",
  },
  statLabel: {
    color: "#93c5fd",
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  statValue: {
    color: "#f8fafc",
    fontSize: "30px",
    lineHeight: 1,
    fontWeight: 800,
  },
  statHint: {
    color: "#94a3b8",
    fontSize: "13px",
  },
  toolbarCard: {
    padding: "24px",
    borderRadius: "26px",
    background: "rgba(15, 23, 42, 0.86)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    boxShadow: "0 22px 60px rgba(0, 0, 0, 0.20)",
  },
  toolbarTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  toolbarControls: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 800,
    color: "#f8fafc",
  },
  sectionText: {
    margin: "6px 0 0",
    color: "#94a3b8",
    lineHeight: 1.5,
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
    marginTop: "18px",
  },
  productCard: {
    overflow: "hidden",
    borderRadius: "24px",
    background: "rgba(2, 6, 23, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
    boxShadow: "0 18px 40px rgba(0, 0, 0, 0.18)",
  },
  productImageWrap: {
    height: "220px",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.92) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px",
  },
  productImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "16px",
  },
  productBody: {
    padding: "18px",
    display: "grid",
    gap: "16px",
  },
  productTop: {
    display: "grid",
    gap: "6px",
  },
  productTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "20px",
    fontWeight: 700,
    lineHeight: 1.3,
  },
  productUpdated: {
    color: "#94a3b8",
    fontSize: "12px",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },
  metaItem: {
    padding: "12px",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(148, 163, 184, 0.08)",
    display: "grid",
    gap: "6px",
  },
  metaLabel: {
    color: "#93c5fd",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  metaValue: {
    color: "#e2e8f0",
    fontSize: "14px",
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
  },
  badgeOk: {
    background: "rgba(22, 163, 74, 0.20)",
    color: "#86efac",
    border: "1px solid rgba(22, 163, 74, 0.18)",
  },
  badgeMuted: {
    background: "rgba(148, 163, 184, 0.12)",
    color: "#cbd5e1",
    border: "1px solid rgba(148, 163, 184, 0.12)",
  },
  badgeDanger: {
    background: "rgba(127, 29, 29, 0.24)",
    color: "#fecaca",
    border: "1px solid rgba(248, 113, 113, 0.16)",
  },
  cardActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  emptyState: {
    marginTop: "18px",
    padding: "20px",
    borderRadius: "18px",
    background: "rgba(255, 255, 255, 0.03)",
    color: "#cbd5e1",
    border: "1px dashed rgba(148, 163, 184, 0.18)",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(2, 6, 23, 0.72)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 9999,
  },
  modalCard: {
    width: "100%",
    maxWidth: "980px",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "26px",
    background: "#0f172a",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    padding: "24px",
    boxShadow: "0 30px 90px rgba(0, 0, 0, 0.40)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "18px",
  },
  modalTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "24px",
    fontWeight: 800,
  },
  modalSubtitle: {
    margin: "8px 0 0",
    color: "#94a3b8",
  },
  closeButton: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background: "transparent",
    color: "#e2e8f0",
    fontSize: "28px",
    cursor: "pointer",
    lineHeight: 1,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "20px",
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: "18px",
    border: "1px solid rgba(148, 163, 184, 0.14)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "640px",
  },
  tableHead: {
    textAlign: "left",
    padding: "14px 16px",
    background: "rgba(255, 255, 255, 0.04)",
    color: "#93c5fd",
    fontSize: "13px",
    fontWeight: 700,
    borderBottom: "1px solid rgba(148, 163, 184, 0.14)",
  },
  tableCell: {
    padding: "14px 16px",
    color: "#e2e8f0",
    borderBottom: "1px solid rgba(148, 163, 184, 0.10)",
    fontSize: "14px",
  },
};
