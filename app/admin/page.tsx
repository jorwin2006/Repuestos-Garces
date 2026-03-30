"use client";

import { useEffect, useMemo, useState } from "react";
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

  if (!sessionChecked) {
    return (
      <div className="container admin-page">
        <div className="admin-login-card">
          <h1 className="title">Administrador de repuestos</h1>
          <p className="subtitle">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container admin-page">
        <div className="admin-login-card">
          <h1 className="title">Administrador de repuestos</h1>
          <p className="subtitle">
            Inicia sesión con tu usuario y contraseña.
          </p>

          <div className="admin-login-form">
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Usuario"
              className="search-input"
              autoComplete="username"
            />

            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Contraseña"
              className="search-input"
              autoComplete="current-password"
            />

            <button
              type="button"
              className="admin-primary-btn"
              onClick={handleLogin}
              disabled={
                !usernameInput.trim() || !passwordInput.trim() || loading
              }
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>

          {error ? <p className="admin-error">{error}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="container admin-page">
      <div className="admin-header-card">
        <div>
          <h1 className="title">Administrador de repuestos</h1>
          <p className="subtitle">
            Sesión iniciada como <strong>{user.username}</strong> ({user.role})
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-secondary-btn"
            onClick={handleLogout}
          >
            Salir
          </button>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={openDeletedProductsModal}
          >
            Repuestos Eliminados
          </button>

          <button
            type="button"
            className="admin-primary-btn"
            onClick={openCreateForm}
          >
            + Nuevo repuesto
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, marca, categoría, OEM..."
          className="search-input admin-toolbar-search"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="admin-select"
        >
          <option value="updated-desc">Más recientes primero</option>
          <option value="updated-asc">Más antiguos primero</option>
          <option value="name-asc">Nombre A-Z</option>
          <option value="name-desc">Nombre Z-A</option>
          <option value="brand-asc">Marca A-Z</option>
          <option value="brand-desc">Marca Z-A</option>
        </select>
      </div>

      <p className="admin-results-count">
        Mostrando {filteredProducts.length} de {products.length} repuestos
      </p>

      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? <p>Cargando productos...</p> : null}

      <div className="admin-products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="admin-product-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imagen}
              alt={product.nombre}
              className="admin-product-thumb"
            />

            <div className="admin-product-body">
              <h3 className="admin-product-title">{product.nombre}</h3>

              <div className="admin-meta-list">
                <div className="admin-meta-row">
                  <span className="admin-meta-label">Marca</span>
                  <span className="admin-meta-value">{product.marcaVehiculo}</span>
                </div>

                <div className="admin-meta-row">
                  <span className="admin-meta-label">Categoría</span>
                  <span className="admin-meta-value">{product.categoria}</span>
                </div>

                {product.codigoOEM ? (
                  <div className="admin-meta-row">
                    <span className="admin-meta-label">OEM</span>
                    <span className="admin-meta-value">{product.codigoOEM}</span>
                  </div>
                ) : null}

                <div className="admin-meta-row">
                  <span className="admin-meta-label">Estado</span>
                  <span className="admin-meta-value">
                    {typeof product.stockDisponible === "boolean" ? (
                      <span
                        className={`admin-status-badge ${
                          product.stockDisponible ? "is-ok" : "is-no"
                        }`}
                      >
                        {product.stockDisponible ? "Disponible" : "No disponible"}
                      </span>
                    ) : (
                      <span className="admin-muted">No visible</span>
                    )}
                  </span>
                </div>

                <div className="admin-meta-row">
                  <span className="admin-meta-label">Público</span>
                  <span className="admin-meta-value">
                    <span
                      className={`admin-status-badge ${
                        product.mostrarInfoPublica === false ? "is-no" : "is-ok"
                      }`}
                    >
                      {product.mostrarInfoPublica === false ? "No" : "Sí"}
                    </span>
                  </span>
                </div>

                <div className="admin-meta-row admin-meta-row-date">
                  <span className="admin-meta-label">Actualizado</span>
                  <span className="admin-meta-value">
                    {product.updatedAt
                      ? new Date(product.updatedAt).toLocaleString("es-EC", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="admin-card-actions">
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => openActivity(product)}
                >
                  Ver Actividad
                </button>

                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => openEditForm(product)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="admin-danger-btn"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredProducts.length === 0 ? (
        <p>No se encontraron repuestos con ese criterio.</p>
      ) : null}

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
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <h2>Actividad del repuesto</h2>
                <p>
                  <strong>{activityProduct.nombre}</strong>
                </p>
              </div>

              <button
                type="button"
                className="admin-close-btn"
                onClick={closeActivityModal}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            {loadingActivity ? (
              <p>Cargando actividad...</p>
            ) : activityRows.length === 0 ? (
              <p>Este repuesto todavía no tiene actividad registrada.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "1rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Usuario
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Acción
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Fecha
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Hora
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityRows.map((row) => {
                      const date = new Date(row.createdAt);

                      return (
                        <tr key={row.id}>
                          <td
                            style={{
                              padding: "0.75rem",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {row.username}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {row.action}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {date.toLocaleDateString("es-EC")}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {date.toLocaleTimeString("es-EC", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="admin-actions-row" style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className="admin-secondary-btn"
                onClick={closeActivityModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showDeletedProductsModal ? (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <h2>Repuestos Eliminados</h2>
                <p>Historial general de eliminaciones registradas.</p>
              </div>

              <button
                type="button"
                className="admin-close-btn"
                onClick={closeDeletedProductsModal}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            {loadingDeletedProducts ? (
              <p>Cargando historial...</p>
            ) : deletedProductRows.length === 0 ? (
              <p>No hay repuestos eliminados registrados todavía.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "1rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Usuario
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Repuesto eliminado
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Fecha
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "0.75rem",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        Hora
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedProductRows.map((row) => {
                      const date = new Date(row.createdAt);

                      return (
                        <tr key={row.id}>
                          <td
                            style={{
                              padding: "0.75rem",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {row.username}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {row.productName}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {date.toLocaleDateString("es-EC")}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            {date.toLocaleTimeString("es-EC", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="admin-actions-row" style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className="admin-secondary-btn"
                onClick={closeDeletedProductsModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}