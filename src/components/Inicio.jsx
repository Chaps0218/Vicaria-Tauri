import React from 'react';
import { useUser } from '../UserContext';

const Inicio = () => {
  const { user } = useUser();

  return (
    <div>
      <h1>Bienvenido, {user.usu_nombre}</h1>
      {/* Otros contenidos */}
    </div>
  );
};

export default Inicio;
