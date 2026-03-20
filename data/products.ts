export type DeliveryInfo = {
  retiroLocal?: string;
  deliveryLocal?: string;
  enviosNacionales?: string;
};

export type Product = {
  id: string;
  marcaVehiculo: string;
  categoria: string;
  nombre: string;
  slug: string;
  codigoOEM?: string;
  stockDisponible?: boolean;
  imagen: string;
  compatibilidad?: string[];
  mostrarInfoPublica?: boolean;
  mostrarMensajeWhatsApp?: boolean;
  telefonoWhatsApp?: string;
  telefonoAlterno?: string;
  medidas?: string;
  descripcion?: string;
  envios?: DeliveryInfo;
  createdAt?: string;
  updatedAt?: string;
};

export const DEFAULT_PHONE = "593991657178";

export const DEFAULT_DELIVERY_INFO: DeliveryInfo = {
  retiroLocal:
    "Repuestos Garces - Santo Domingo, Av. Esmeraldas Lote 6 y Río Yuturi, frente a Erco TIRE.",
  deliveryLocal: "Coordinado por WhatsApp.",
  enviosNacionales:
    "Por encomienda en buses interprovinciales; el cliente debe retirar en el terminal designado de su ciudad.",
};

export const seedProducts: Product[] = [
  {
    id: "1",
    marcaVehiculo: "HINO",
    categoria: "Frenos",
    nombre: "Hidrovac Freno",
    slug: "hidrovac-freno",
    codigoOEM: undefined,
    stockDisponible: true,
    imagen: "/products/HINO/FRENOS/Hidrovac Freno.png",
    compatibilidad: ["Hino Dutro"],
    mostrarInfoPublica: true,
    mostrarMensajeWhatsApp: true,
    telefonoWhatsApp: DEFAULT_PHONE,
    envios: DEFAULT_DELIVERY_INFO,
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
  },
  {
    id: "2",
    marcaVehiculo: "HINO",
    categoria: "Motor",
    nombre: "Balancin Motor",
    slug: "balancin-motor",
    codigoOEM: undefined,
    stockDisponible: true,
    imagen: "/products/HINO/MOTOR/balancin_motor.png",
    compatibilidad: ["Hino J05C", "Hino J08CT"],
    mostrarInfoPublica: true,
    mostrarMensajeWhatsApp: true,
    telefonoWhatsApp: DEFAULT_PHONE,
    envios: DEFAULT_DELIVERY_INFO,
    createdAt: "2026-03-20T00:00:00.000Z",
    updatedAt: "2026-03-20T00:00:00.000Z",
  },
];
