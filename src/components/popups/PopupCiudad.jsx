import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './popup.css';
import '../../App.css';

const PopupCiudad = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        ciu_nom: '',
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
                ciu_nom: '',
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
        if (!formData.ciu_nom) {
            newErrors.ciu_nom = 'El nombre de la ciudad es requerido';
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
                <h2 className='h2-est'>{initialData ? 'Editar Ciudad' : 'Agregar Ciudad'}</h2>
                <div className="gridCentraoNoFull grid-2row-equal">
                    <div className='gridCentraoNoFull'>
                        <TextField
                            label="Nombre del ciudad"
                            name="ciu_nom"
                            value={formData.ciu_nom}
                            onChange={handleChange}
                            error={errors.ciu_nom}
                            helperText={errors.ciu_nom}
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

export default PopupCiudad