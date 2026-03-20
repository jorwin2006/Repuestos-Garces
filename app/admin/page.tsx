"use client";

import { useEffect, useMemo, useState } from "react";
import ProductForm from "./ProductForm";
import type { Product, ProductInput } from "../../lib/products";

export default function AdminPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
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
      setError(loadError instanceof Error ? loadError.message : "Error al cargar productos.");
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
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este repuesto?");
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
    if (!term) return products;

    return products.filter((product) => {
      return [product.nombre, product.marcaVehiculo, product.categoria, product.codigoOEM]
        .filter(Boolean)
        .some((value) => typeof value === "string" && value.toLowerCase().includes(term));
    });
  }, [products, search]);

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
              placeholder="Clave de administrador"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button className="admin-primary-btn" onClick={() => loadProducts(passwordInput)}>
              Entrar
            </button>
          </div>

          {error && <p className="admin-error">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="container admin-page">
      <div className="admin-header-row">
        <div>
          <h1 className="title">Administrador de repuestos</h1>
          <p className="subtitle">
            Aquí puedes crear, editar y eliminar productos sin tocar el código.
          </p>
        </div>

        <div className="admin-header-actions">
          <button className="admin-secondary-btn" onClick={handleLogout}>
            Salir
          </button>
          <button className="admin-primary-btn" onClick={openCreateForm}>
            + Nuevo repuesto
          </button>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          className="admin-search-input"
          placeholder="Buscar por nombre, marca, categoría u OEM"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading ? <p>Cargando productos...</p> : null}

      <div className="admin-products-grid">
        {filteredProducts.map((product) => (
          <article key={product.id} className="admin-product-card">
            <div className="admin-product-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.imagen} alt={product.nombre} className="admin-product-image" />
            </div>

            <div className="admin-product-content">
              <h3>{product.nombre}</h3>
              <p>
                <strong>Marca:</strong> {product.marcaVehiculo}
              </p>
              <p>
                <strong>Categoría:</strong> {product.categoria}
              </p>
              {product.codigoOEM && (
                <p>
                  <strong>OEM:</strong> {product.codigoOEM}
                </p>
              )}
              {typeof product.stockDisponible === "boolean" && (
                <p>
                  <strong>Stock:</strong>{" "}
                  {product.stockDisponible ? "Disponible" : "No disponible"}
                </p>
              )}
              <p>
                <strong>Público:</strong> {product.mostrarInfoPublica === false ? "No" : "Sí"}
              </p>
            </div>

            <div className="admin-card-actions">
              <button className="admin-secondary-btn" onClick={() => openEditForm(product)}>
                Editar
              </button>
              <button className="admin-danger-btn" onClick={() => handleDelete(product.id)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>

      {!loading && filteredProducts.length === 0 && (
        <p>No se encontraron repuestos con ese criterio.</p>
      )}

      {isFormOpen && (
        <ProductForm
          initialProduct={editingProduct}
          adminPassword={adminPassword}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
