"use client";

import { useEffect, useMemo, useState } from "react";
import ProductForm from "./ProductForm";
import type { Product, ProductInput } from "../../lib/products";

type SortOption =
  | "updated-desc"
  | "updated-asc"
  | "name-asc"
  | "name-desc"
  | "brand-asc"
  | "brand-desc";

export default function AdminPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated-desc");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const savedPassword = window.sessionStorage.getItem("rg_admin_password");

    if (savedPassword) {
      setPasswordInput(savedPassword);
      setAdminPassword(savedPassword);
    }
  }, []);

  useEffect(() => {
    if (adminPassword) {
      void loadProducts(adminPassword);
    }
  }, [adminPassword]);

  async function loadProducts(password: string) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/products", {
        headers: {
          "x-admin-password": password,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudieron cargar los productos.");
      }

      setProducts(data.products ?? []);
      setAdminPassword(password);
      window.sessionStorage.setItem("rg_admin_password", password);
    } catch (loadError) {
      setProducts([]);
      window.sessionStorage.removeItem("rg_admin_password");
      setAdminPassword("");
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Error al cargar productos."
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
        "x-admin-password": adminPassword,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo guardar el producto.");
    }

    setIsFormOpen(false);
    setEditingProduct(null);
    await loadProducts(adminPassword);
  }

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este repuesto?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/products?id=${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-password": adminPassword,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "No se pudo eliminar el repuesto.");
      return;
    }

    await loadProducts(adminPassword);
  }

  function openCreateForm() {
    setEditingProduct(null);
    setIsFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setIsFormOpen(true);
  }

  function handleLogout() {
    setProducts([]);
    setAdminPassword("");
    setPasswordInput("");
    window.sessionStorage.removeItem("rg_admin_password");
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

  if (!adminPassword) {
    return (
      <div className="container admin-page">
        <div className="admin-login-card">
          <h1 className="title">Panel del encargado</h1>
          <p className="subtitle">
            Ingresa la clave de administración para cargar y editar repuestos.
          </p>

          <div className="admin-login-form">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Clave de administración"
              className="search-input"
            />

            <button
              type="button"
              className="admin-primary-btn"
              onClick={() => loadProducts(passwordInput)}
              disabled={!passwordInput.trim() || loading}
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
            Aquí puedes crear, editar y eliminar productos sin tocar el código.
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
          adminPassword={adminPassword}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}