import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './popup.css';
import '../../App.css';

const PopupMinistro = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        min_nombre: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                min_nombre: '',
            });
            setErrors({});
        }
    }, [isOpen]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.min_nombre) {
            newErrors.min_nombre = 'El nombre del ministro es requerido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2 className='h2-est'>{initialData ? 'Editar Ministro' : 'Agregar Ministro'}</h2>
                <div className="gridCentraoNoFull grid-2row-equal">
                    <div className='gridCentraoNoFull'>
                        <TextField
                            label="Nombre del ministro"
                            name="min_nombre"
                            value={formData.min_nombre}
                            onChange={handleChange}
                            error={errors.min_nombre}
                            helperText={errors.min_nombre}
                            fullWidth
                        />
                    </div>
                    <div className="form-buttons">
                        <button id="cancelar" onClick={onClose}>Cancelar</button>
                        <button onClick={handleSubmit}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopupMinistro