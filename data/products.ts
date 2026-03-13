export type Product = {
  id: string;
  marcaVehiculo: string;
  categoria: string;
  nombre: string;
  slug: string;
  codigoOEM?: string;
  precio?: number;
  precioOferta?: number;
  stock?: string;
  imagen: string;
  compatibilidad: string[];
  mostrarInfoPublica?: boolean;
};

/* =========================
          Plantilla
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
========================= */

export const products: Product[] = [
  /* =========================
            HINO
  ========================= */

  /* =========================
         HINO-DIRECCIÓN
  ========================= */

  /* =========================
          HINO-FRENOS
  ========================= */
  {
    id: "1",
    marcaVehiculo: "HINO",
    categoria: "Frenos",
    nombre: "Hidrovac Freno",
    slug: "hidrovac-freno",
    codigoOEM: "",
    precio: 0,
    stock: "Disponible",
    imagen: "/products/HINO/FRENOS/Hidrovac Freno.png",
    compatibilidad: ["Hino Dutro"],
  },

  /* =========================
        HINO-TRANSMISIÓN
  ========================= */

  /* =========================
        HINO-SUSPENSIÓN
  ========================= */

  /* =========================
         HINO-ELECTRÓNICO
  ========================= */

  /* =========================
   HINO-ELECTRÓNICA Y SOFTWARE
  ========================= */

  /* =========================
       HINO-REFRIGERACIÓN
  ========================= */

  /* =========================
         SISTEMA ESCAPE
  ========================= */

  /* =========================
         SISTEMA MOTOR
  ========================= */
  {
    id: "2",
    marcaVehiculo: "HINO",
    categoria: "Motor",
    nombre: "Balancin Motor",
    slug: "balancin-motor",
    codigoOEM: "",
    precio: 0,
    stock: "Disponible",
    imagen: "/products/HINO/MOTOR/balancin_motor.png",
    compatibilidad: ["Hino J05C", "Hino J08CT"],
  },

  /* =========================
           FIN HINO
  ========================= */

  /* =========================
            ISUZU
  ========================= */

  /* =========================
      ISUZU-SISTEMA MOTOR
  ========================= */

  /* =========================
        ISUZU-TRANSMISIÓN
  ========================= */

  /* =========================
        ISUZU-SUSPENSIÓN
  ========================= */

  /* =========================
         ISUZU-ELECTRÓNICO
  ========================= */

  /* =========================
   ISUZU-ELECTRÓNICA Y SOFTWARE
  ========================= */

  /* =========================
      ISUZU-REFRIGERACIÓN
  ========================= */

  /* =========================
      ISUZU-SISTEMA ESCAPE
  ========================= */

  /* =========================
      ISUZU-SISTEMA MOTOR
  ========================= */

  /* =========================
         ISUZU-FRENOS
  ========================= */

  /* =========================
        ISUZU-DIRECCIÓN
  ========================= */

  /* =========================
          FIN ISUZU
  ========================= */

  /* =========================
       MERCEDES-BENZ
  ========================= */

  /* =========================
      MERCEDES-SUSPENSIÓN
  ========================= */

  /* =========================
      MERCEDES-TRANSMISIÓN
  ========================= */

  /* =========================
       MERCEDES-ELECTRÓNICO
  ========================= */

  /* =========================
   MERCEDES-ELECTRÓNICA Y SOFTWARE
  ========================= */

  /* =========================
      MERCEDES-REFRIGERACIÓN
  ========================= */

  /* =========================
    MERCEDES-SISTEMA ESCAPE
  ========================= */

  /* =========================
    MERCEDES-SISTEMA MOTOR
  ========================= */

  /* =========================
       MERCEDES-FRENOS
  ========================= */

  /* =========================
      MERCEDES-DIRECCIÓN
  ========================= */

  /* =========================
      FIN MERCEDES-BENZ
  ========================= */

  /* =========================
            NISSAN
  ========================= */

  /* =========================
        NISSAN-TRANSMISIÓN
  ========================= */

  /* =========================
        NISSAN-SUSPENSIÓN
  ========================= */

  /* =========================
        NISSAN-ELECTRÓNICO
  ========================= */

  /* =========================
   NISSAN-ELECTRÓNICA Y SOFTWARE
  ========================= */

  /* =========================
      NISSAN-REFRIGERACIÓN
  ========================= */

  /* =========================
      NISSAN-SISTEMA ESCAPE
  ========================= */

  /* =========================
      NISSAN-SISTEMA MOTOR
  ========================= */

  /* =========================
        NISSAN-FRENOS
  ========================= */

  /* =========================
      NISSAN-DIRECCIÓN
  ========================= */

  /* =========================
         FIN NISSAN
  ========================= */

  /* =========================
            YUTONG
  ========================= */

  /* =========================
        YUTONG-TRANSMISIÓN
  ========================= */

  /* =========================
        YUTONG-SUSPENSIÓN
  ========================= */

  /* =========================
        YUTONG-ELECTRÓNICO
  ========================= */

  /* =========================
   YUTONG-ELECTRÓNICA Y SOFTWARE
  ========================= */

  /* =========================
      YUTONG-REFRIGERACIÓN
  ========================= */

  /* =========================
      YUTONG-SISTEMA ESCAPE
  ========================= */

  /* =========================
      YUTONG-SISTEMA MOTOR
  ========================= */

  /* =========================
        YUTONG-FRENOS
  ========================= */

  /* =========================
      YUTONG-DIRECCIÓN
  ========================= */

  /* =========================
         FIN YUTONG
  ========================= */

  /* =========================
         VOLKSWAGEN
  ========================= */

  /* =========================
      VOLKSWAGEN-TRANSMISIÓN
  ========================= */

  /* =========================
      VOLKSWAGEN-SUSPENSIÓN
  ========================= */

  /* =========================
      VOLKSWAGEN-ELECTRÓNICO
  ========================= */

  /* =========================
   VOLKSWAGEN-ELECTRÓNICA Y SOFTWARE
  ========================= */

  /* =========================
      VOLKSWAGEN-REFRIGERACIÓN
  ========================= */

  /* =========================
    VOLKSWAGEN-SISTEMA ESCAPE
  ========================= */

  /* =========================
    VOLKSWAGEN-SISTEMA MOTOR
  ========================= */

  /* =========================
      VOLKSWAGEN-FRENOS
  ========================= */

  /* =========================
     VOLKSWAGEN-DIRECCIÓN
  ========================= */

  /* =========================
        FIN VOLKSWAGEN
  ========================= */
];