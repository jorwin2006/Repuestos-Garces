# Continuidad del proyecto: Repuestos Garces

## Objetivo
Continuar en un nuevo chat el desarrollo de una web catálogo para **Repuestos Garces**, enfocada en repuestos para camiones y buses, con estructura escalable, pero manteniendo por ahora una solución simple y funcional.

## Contexto del negocio
- Nombre del local: **Repuestos Garces**
- Tipo de web actual: **catálogo estático**
- Venta actual: **cotización por WhatsApp**, no carrito todavía
- Estructura deseada: **por marca → luego categorías → luego ficha individual del producto**
- Mostrar precios: **sí**, con estrategia de **precio normal + precio oferta/descuento**
- Marcas principales: **HINO, VOLKSWAGEN, MERCEDES-BENZ, ISUZU, NISSAN, YUTONG**
- Envíos: 
  - Retiro en local
  - Delivery local
  - Envíos nacionales por **encomienda en buses interprovinciales**
  - El cliente debe **retirar en el terminal designado** de su ciudad

## Stack actual
- Framework: **Next.js 16**
- Lenguaje: **TypeScript**
- App Router: **sí**
- Estilos: CSS global simple (`app/globals.css`)
- Editor: **VS Code**
- Repositorio: Git + GitHub
- Hosting futuro: **Vercel**

## Importante sobre Next.js 16
En esta versión:
- Los `params` de rutas dinámicas llegan como **Promise**
- Los `searchParams` también llegan como **Promise**
- Por eso, en archivos como `app/marca/[marca]/page.tsx` y `app/buscar/page.tsx`, se debe usar:
  - `export default async function ...`
  - `const { marca } = await params`
  - `const { q } = await searchParams`

No usar acceso directo tipo `params.marca` sin `await`, porque da error.

## Estructura actual del proyecto (conceptual)
- `app/page.tsx` → Inicio con marcas y buscador
- `app/marca/[marca]/page.tsx` → Lista productos de una marca, agrupados por categoría
- `app/producto/[slug]/page.tsx` → Ficha individual del producto
- `app/buscar/page.tsx` → Resultados de búsqueda por query string
- `app/globals.css` → estilos globales
- `data/products.ts` → base de datos local de productos (array tipado)
- `public/products/` → imágenes de productos

## Estado actual: ya funciona
### 1) Página principal
- Muestra marcas principales
- Tiene buscador por texto
- El buscador envía a `/buscar?q=...`

### 2) Página por marca
- Filtra productos por marca
- Agrupa productos por categoría
- Muestra tarjetas con:
  - imagen
  - nombre
  - código OEM
  - precio normal tachado
  - precio oferta
  - stock

### 3) Página de producto
- Muestra ficha individual completa
- Muestra:
  - imagen
  - nombre
  - marca
  - categoría
  - código OEM
  - stock
  - precio normal y precio oferta
  - compatibilidad
  - política de envíos
- Tiene botón **Cotizar por WhatsApp** con mensaje prellenado
- Se cambió de `<img>` a `next/image` o se recomendó usar `next/image` para evitar advertencias de ESLint/Next

### 4) Imágenes
- Ya se confirmó que las imágenes funcionan bien desde `public/products/`
- Ejemplo válido de ruta:
  - Archivo real: `public/products/Terminal_Direccion_RH.png`
  - Ruta en código: `"/products/Terminal_Direccion_RH.png"`
- Se probó y cargó correctamente

### 5) Buscador
- Ya se implementó una página `app/buscar/page.tsx`
- Filtra por:
  - nombre
  - código OEM
  - marca
  - categoría
  - compatibilidad

## Modelo de datos actual (`data/products.ts`)
Cada producto tiene esta forma:
- `id: string`
- `marcaVehiculo: string`
- `categoria: string`
- `nombre: string`
- `slug: string`
- `codigoOEM: string`
- `precio: number`
- `precioOferta?: number`
- `stock: string`
- `imagen: string`
- `compatibilidad: string[]`

## Ejemplo de producto actual
```ts
{
  id: "1",
  marcaVehiculo: "HINO",
  categoria: "Dirección",
  nombre: "Terminal Dirección Derecho RH - Nakata N-533",
  slug: "terminal-direccion-rh-nakata-n-533",
  codigoOEM: "N-533",
  precio: 26.24,
  precioOferta: 22.99,
  stock: "Disponible",
  imagen: "/products/Terminal_Direccion_RH.png",
  compatibilidad: ["Hino 1721", "Hino 1318"],
}
```

## Recordatorios importantes
### WhatsApp
En `app/producto/[slug]/page.tsx`, revisar que la URL tenga el número real en formato internacional de Ecuador:
- Formato correcto: `593` + número sin el `0` inicial
- Ejemplo: si el número es `0987654321`, usar `593987654321`

### Imágenes
- Todo archivo dentro de `public/` se referencia sin escribir `public`
- Se usan rutas web con `/`, no con `\\`

### Git / trabajo entre PCs
El proyecto ya fue subido a GitHub para moverlo entre computadoras.
Flujo correcto:
- En una PC: `git add . && git commit -m "..." && git push`
- En otra PC: `git pull`
- Si es primera vez en otra PC: `git clone <url-del-repo>`, luego `npm install`, luego `npm run dev`

## Lo último que se hizo antes de este resumen
- Se confirmó que todo funciona “excelente” hasta este punto
- Se pidió seguir adelante después de implementar el buscador
- Se generó este archivo para continuidad porque el chat puede reiniciarse o llegar a límite

## Próximo paso lógico recomendado
Seguir con una de estas mejoras (prioridad sugerida):
1. **Mover el buscador al header** para que se pueda usar desde cualquier página
2. Crear un **header más profesional** con logo, navegación y buscador
3. Crear una **página de envíos** independiente
4. Mejorar el diseño visual del home con banner principal
5. Agregar **más productos reales** y pulir compatibilidades
6. Preparar el despliegue en **Vercel**

## Instrucción para el nuevo chat
Asume que este proyecto ya está configurado y funcionando en local con Next.js 16 + TypeScript. No reinicies desde cero. Continúa directamente desde este estado, respetando la estructura actual y la compatibilidad con Next.js 16 (params/searchParams async).
