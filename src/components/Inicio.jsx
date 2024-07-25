import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { useUser } from '../UserContext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link } from 'react-router-dom';

const Inicio = () => {
  const { user } = useUser();
  const [parroquias, setParroquias] = useState([]);

  const fetchParroquias = async () => {
    try {
      const response = await invoke('get_all_parroquias');
      setParroquias(response);
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
      <div className='gridCentrao3 grid-3colum-inicio'>
        <Link to="/confirmaciones" style={{ textDecoration: 'none' }}>
          <div>
            <Card sx={{ minHeight: 200, backgroundColor: '#ced4da', borderRadius: 4 }}>
              <CardContent>
                <div >
                  <img src="/images/confirmados2.jpg" alt="confirmados" width="100%" height="100"></img>
                </div>
                <strong>Agregar confirmado</strong>
              </CardContent>
            </Card>
          </div>
        </Link>
        <div>
          <Card sx={{ maxHeight: 200, backgroundColor: '#ced4da', borderRadius: 4 }}>
            <CardContent>
              <div className='card-inicio'>
                <div className='gridCentrao3'>
                  <strong>Información cuentas</strong>
                </div>

                <div className='card-interno '>
                  <p>{user.usu_nombre}  {user.usu_apellido}</p>
                  {user.usu_rol === "Admin" ? <p>{"Administrador"}</p> :
                    <p>{user.usu_rol}</p>}
                  <p>{user.usu_user}</p>
                  <p>{user.est_nombre}</p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
        <div>
          <Card sx={{ maxHeight: 200, backgroundColor: '#ced4da', borderRadius: 4 }}>
            <CardContent>
              <div className='card-inicio'>
                <div className='gridCentrao3'>
                  <strong>Parroquias</strong>
                </div>
                <div className='card-interno parr-inicio'>
                  {parroquias.map((parroquia) => (
                    <p key={parroquia.parr_id}>{parroquia.parr_nombre}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default Inicio;
