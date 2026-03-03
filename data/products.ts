export type Product = {
  id: string;
  marcaVehiculo: string;
  categoria: string;
  nombre: string;
  slug: string;
  codigoOEM: string;
  precio: number;
  precioOferta?: number;
  stock: string;
  imagen: string;
  compatibilidad: string[];
};

export const products: Product[] = [
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
  },
  {
    id: "2",
    marcaVehiculo: "HINO",
    categoria: "Frenos",
    nombre: "Bomba Freno Hino Dutro 816 - 716",
    slug: "bomba-de-freno-hino",
    codigoOEM: "HF-220",
    precio: 45.0,
    precioOferta: 39.9,
    stock: "Disponible",
    imagen: "/products/Bomba_Freno_816_716.png",
    compatibilidad: ["Dutro 816", "Dutro 716"],
  },
  {
    id: "3",
    marcaVehiculo: "ISUZU",
    categoria: "Motor",
    nombre: "Filtro de Aceite Isuzu",
    slug: "filtro-de-aceite-isuzu",
    codigoOEM: "IA-101",
    precio: 12.5,
    precioOferta: 10.99,
    stock: "Disponible",
    imagen: "/products/filtro-aceite-isuzu.jpg",
    compatibilidad: ["Isuzu NPR", "Isuzu NKR"],
  },
  {
    id: "4",
    marcaVehiculo: "MERCEDES-BENZ",
    categoria: "Suspensión",
    nombre: "Amortiguador Delantero Mercedes-Benz",
    slug: "amortiguador-delantero-mercedes",
    codigoOEM: "MB-450",
    precio: 68.0,
    precioOferta: 61.5,
    stock: "Disponible",
    imagen: "/products/amortiguador-mercedes.jpg",
    compatibilidad: ["Mercedes-Benz LO", "Mercedes-Benz OF"],
  },
];