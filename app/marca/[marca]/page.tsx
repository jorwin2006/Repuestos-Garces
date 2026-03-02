import { use } from "react";

type Props = {
  params: {
    marca: string;
  };
};

export default function MarcaPage({ params }: Props) {
  const marca = params.marca;

  return (
    <div className="container">
      <h1>Marca: {marca}</h1>
      <p>Aquí irán los repuestos organizados por categorías.</p>
    </div>
  );
}