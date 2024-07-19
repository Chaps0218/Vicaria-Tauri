import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { useUser } from '../UserContext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const Inicio = () => {
  const { user } = useUser();
  const [parroquias, setParroquias] = useState([]);

  const fetchParroquias = async () => {
    try {
      const response = await invoke('get_all_parroquias');
      setParroquias(response);
      setFilteredParroquias(response);
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    fetchParroquias();
  }, []);

  return (
    <div className='gridCentrao grid-2row-equal-lessSpace'>
      <div className='header-inicio'>
        <h1 id='nombre_inicio' >Bienvenido, {user.usu_nombre}</h1>
        <h1 id='vicaria_inicio'>Vicaria Episcopal Nuestra Señora de la Merced</h1>
      </div>
      <div className='gridCentrao3 grid-3colum-equal'>
        <div>
          <Card sx={{ maxHeight: 230, backgroundColor: '#B5A7A7', borderRadius: 4 }}>
            <CardContent>
              <div >
                <img src="src\images\confirmados.jpg" alt="confirmados" width="100%" height="100"></img>
              </div>
              <p>Agregar confirmado</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card sx={{ maxHeight: 230, backgroundColor: '#B5A7A7', borderRadius: 4 }}>
            <CardContent>
              <p>Información cuenta</p>
              <div className='card-interno overflow '>
                <p>{user.usu_nombre}  {user.usu_apellido}</p>
                <p>{user.usu_rol}</p>
                <p>{user.usu_user}</p>
                <p>{user.est_nombre}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card sx={{ maxHeight: 230, backgroundColor: '#B5A7A7', borderRadius: 4 }}>
            <CardContent>
              <p>Parroquias</p>
              <div className='overflow card-interno'>
                {parroquias.map((parroquia) => (
                  <p key={parroquia.parr_id}>{parroquia.parr_nombre}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default Inicio;
