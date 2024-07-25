import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { blueGrey } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
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

    const ColorButton = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(blueGrey[900]),
        backgroundColor: blueGrey[900],
        '&:hover': {
            backgroundColor: blueGrey[500],
        },
    }));

    const ColorButtonRed = styled(Button)(({ theme }) => ({
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[900],
        },
    }));

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
                    <div className="gridCentraoButtons grid-2colum-equal-lessSpace">
                        <ColorButton startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit}>Guardar</ColorButton>
                        <ColorButtonRed startIcon={<CloseIcon />} variant="contained" onClick={onClose}>Cancelar</ColorButtonRed>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopupCiudad