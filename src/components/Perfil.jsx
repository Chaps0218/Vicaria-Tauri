import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import '../App.css';
import './popups/popup.css';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { blueGrey } from '@mui/material/colors';

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

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(blueGrey[900]),
        backgroundColor: blueGrey[900],
        '&:hover': {
            backgroundColor: blueGrey[500],
        },
    }));

    return (
        <div className='gridCentrao grid-2row-top perfilFontSize'>
            <h1>Perfil</h1>
            <div className='gridCentrao grid-3row-equal perfilFontSize'>
                <div className='gridCentrao grid-2row-top perfilFontSize'>
                    <div className='gridCentrao5 cuadrado-gris'>
                        Información Personal
                    </div>
                    <div className='gridCentraoNoFull grid-2row-equal-lessSpace perfilFontSize'>
                        <div className='gridCentraoNoFull grid-2colum-equal-lessSpace perfilFontSize'>
                            <strong>Nombre:</strong>
                            <p>{user.usu_nombre}</p>
                        </div>
                        <div className='gridCentraoNoFull grid-2colum-equal-lessSpace perfilFontSize'>
                            <strong>Apellido:</strong>
                            <p>{user.usu_apellido}</p>
                        </div>
                    </div>
                </div>
                <div className='gridCentrao grid-2row-top perfilFontSize'>
                    <div className='gridCentrao5 cuadrado-gris'>
                        Permisos
                    </div>
                    <div className='gridCentraoNoFull grid-2row-equal-lessSpace perfilFontSize'>
                        <div className='gridCentraoNoFull grid-2colum-equal-lessSpace perfilFontSize'>
                            <strong>Rol:</strong>
                            <p>{user.usu_rol}</p>
                        </div>
                        <div className='gridCentraoNoFull grid-2colum-equal-lessSpace perfilFontSize'>
                            <strong>Establecimiento:</strong>
                            <p>{user.est_nombre}</p>
                        </div>
                    </div>
                </div>
                <div className='gridCentrao grid-2row-top perfilFontSize'>
                    <div className='gridCentrao5 cuadrado-gris'>
                        Seguridad
                    </div>
                    <div className='gridCentraoNoFull grid-2row-equal-lessSpace perfilFontSize'>
                        <div className='gridCentraoNoFull grid-2colum-equal-lessSpace perfilFontSize'>
                            <strong>Usuario:</strong>
                            <p>{user.usu_user}</p>
                        </div>
                        <div className='gridCentraoNoFull grid-2colum-equal-lessSpace perfilFontSize'>
                            <strong>Contraseña:</strong>
                            <ColorButton variant="contained" onClick={handleOpenPopup}>Cambiar Contraseña</ColorButton>
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