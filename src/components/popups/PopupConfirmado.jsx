import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import './popup.css'

const PopupConfirmado = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        conf_nombres: '',
        usu_id: 1,
        min_id: 1,
        est_id: 1,
        conf_apellidos: '',
        conf_fecha: '',
        conf_tomo: '',
        conf_pagina: '',
        conf_numero: '',
        conf_padre_nombre: '',
        conf_madre_nombre: '',
        conf_padrino1_nombre: '',
        conf_padrino1_apellido: '',
        conf_padrino2_nombre: '',
        conf_padrino2_apellido: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                conf_nombres: '',
                usu_id: 1,
                min_id: 1,
                est_id: 1,
                conf_apellidos: '',
                conf_fecha: '',
                conf_tomo: '',
                conf_pagina: '',
                conf_numero: '',
                conf_padre_nombre: '',
                conf_madre_nombre: '',
                conf_padrino1_nombre: '',
                conf_padrino1_apellido: '',
                conf_padrino2_nombre: '',
                conf_padrino2_apellido: '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className='gridCentrao popup-inputs-conf'>
                    <h2>{initialData ? 'Editar Confirmado' : 'Agregar Confirmado'}</h2>
                    <TextField
                        fullWidth
                        required
                        name="conf_nombres"
                        label="Nombres Confirmado"
                        value={formData.conf_nombres}
                        onChange={handleChange}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        required
                        name="conf_apellidos"
                        label="Apellidos Confirmado"
                        value={formData.conf_nombres}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </div>
                {/* Agregar más campos según sea necesario */}
                <div className='gridCentrao popup-botones'>
                    <button onClick={handleSubmit}>Guardar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default PopupConfirmado;
