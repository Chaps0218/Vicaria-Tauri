import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import '../App.css';
import PopupCambioPassword from './popups/PopupCambioPassword';

function Perfil() {
    const { user } = useUser();
    const [openPopup, setOpenPopup] = useState(false);

    const handleOpenPopup = () => {
        setOpenPopup(true);
    }

    const handleClosePopup = () => {
        setOpenPopup(false);
    }

    return (
        <div className='gridCentrao'>
            <h1>Perfil</h1>
            <div className='gridCentrao grid-3row-equal'>
                <div>
                    <div className='cuadrado-gris'>
                        Información Personal
                    </div>
                    <div className='gridCentrao grid-2row-equal'>
                        <div>
                            <strong>Nombre:</strong>
                            <p>{user.usu_nombre}</p>
                        </div>
                        <div>
                            <strong>Apellido:</strong>
                            <p>{user.usu_apellido}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='cuadrado-gris'>
                        Permisos
                    </div>
                    <div className='gridCentrao grid-2row-equal'>
                        <div>
                            <strong>Rol:</strong>
                            <p>{user.usu_rol}</p>
                        </div>
                        <div>
                            <strong>Establecimiento:</strong>
                            <p>{user.est_nombre}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='cuadrado-gris'>
                        Seguridad
                    </div>
                    <div className='gridCentrao grid-2row-equal'>
                        <div>
                            <strong>Usuario:</strong>
                            <p>{user.usu_user}</p>
                        </div>
                        <div>
                            <strong>Contraseña:</strong>
                            <button onClick={() => handleOpenPopup()}>Cambiar contraseña</button>
                        </div>
                    </div>
                </div>
            </div>
            <PopupCambioPassword
                isOpen={openPopup}
                onClose={handleClosePopup}
            />
        </div>
    )
}

export default Perfil