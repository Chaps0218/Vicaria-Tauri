import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './popup.css';
import '../../App.css';
import { Margin } from '@mui/icons-material';

const PopupParroquia = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        parr_nombre: '',
        ciu_id: '',
    });

    const [errors, setErrors] = useState({});
    const [ciudades, setCiudades] = useState([]);

    useEffect(() => {
        const fetchCiudades = async () => {
            try {
                const response = await invoke('get_all_ciudades');
                setCiudades(response);
            } catch (error) {
                console.error(error);
            }
        }
        fetchCiudades();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                parr_nombre: '',
                ciu_id: '',
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

    const handleAutocompleteChange = (event, value, field) => {
        switch (field) {
            case "ciu_id":
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [field]: value ? value.ciu_id : null,
                }));
                break;
            default:
                break;
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.parr_nombre) {
            newErrors.parr_nombre = 'El nombre de la parroquia es requerido';
        }
        if (!formData.ciu_id) {
            newErrors.ciu_id = 'La ciudad es requerida';
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
                <h2 className='h2-est'>{initialData ? 'Editar Parroquia' : 'Agregar Parroquia'}</h2>
                <div className="gridCentraoNoFull grid-2row-equal">
                    <div className='gridCentraoNoFull grid-2row-equal'>
                        <TextField
                            label="Nombre del parroquia"
                            name="parr_nombre"
                            value={formData.parr_nombre}
                            onChange={handleChange}
                            error={errors.parr_nombre}
                            helperText={errors.parr_nombre}
                            fullWidth
                        />
                        <Autocomplete
                            fullWidth
                            options={ciudades}
                            getOptionLabel={(option) => option.ciu_nom}
                            onChange={(event, value) => handleAutocompleteChange(event, value, 'ciu_id')}
                            value={ciudades.find((ciudad) => ciudad.ciu_id === formData.ciu_id) || null}
                            renderInput={(params) => <TextField {...params} label="Ciudad" />}
                        />
                    </div>
                    <div className="form-buttons">
                        <button id="cancelar" onClick={onClose}>Cancelar</button>
                        <button onClick={handleSubmit}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupParroquia;