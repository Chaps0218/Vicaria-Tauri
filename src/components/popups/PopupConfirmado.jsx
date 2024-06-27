import React, { useState, useEffect } from 'react';
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
                <h2>{initialData ? 'Editar Confirmado' : 'Agregar Confirmado'}</h2>
                <label>
                    Nombres:
                    <input
                        type="text"
                        name="conf_nombres"
                        value={formData.conf_nombres}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Apellidos:
                    <input
                        type="text"
                        name="conf_apellidos"
                        value={formData.conf_apellidos}
                        onChange={handleChange}
                    />
                </label>
                {/* Agregar más campos según sea necesario */}
                <button onClick={handleSubmit}>Guardar</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default PopupConfirmado;
