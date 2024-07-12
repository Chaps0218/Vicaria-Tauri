import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './popup.css';
import '../../App.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { blueGrey } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

const PopupEstablecimiento = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        est_nombre: '',
        parr_id: '',
    });

    const [errors, setErrors] = useState({});
    const [parroquias, setParroquias] = useState([]);

    useEffect(() => {
        const fetchParroquias = async () => {
            try {
                const response = await invoke('get_all_parroquias');
                setParroquias(response);
            } catch (error) {
                console.error(error);
            }
        }
        fetchParroquias();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                est_nombre: '',
                parr_id: '',
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
            case "parr_id":
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [field]: value ? value.parr_id : null,
                }));
                break;
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.est_nombre) {
            newErrors.est_nombre = 'El nombre del establecimiento es requerido';
        }
        if (!formData.parr_id) {
            newErrors.parr_id = 'La parroquia es requerida';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            formData.parr_id = Number(formData.parr_id);
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
                <h2 className='h2-est'>{initialData ? 'Editar Establecimiento' : 'Agregar Establecimiento'}</h2>
                <div className="gridCentraoNoFull grid-2row-equal">
                    <div className='gridCentraoNoFull grid-2row-equal'>
                        <TextField
                            label="Nombre del establecimiento"
                            name="est_nombre"
                            value={formData.est_nombre}
                            onChange={handleChange}
                            error={errors.est_nombre}
                            helperText={errors.est_nombre}
                            fullWidth
                        />
                        <Autocomplete
                            fullWidth
                            options={parroquias}
                            getOptionLabel={(option) => option.parr_nombre}
                            onChange={(event, value) => handleAutocompleteChange(event, value, 'parr_id')}
                            value={parroquias.find((parroquia) => parroquia.parr_id === formData.parr_id) || null}
                            renderInput={(params) => <TextField {...params} label="Parroquia" />}
                        />
                    </div>
                    <div className="gridCentraoButtons grid-2colum-equal-lessSpace">
                        <ColorButtonRed startIcon={<CloseIcon />} variant="contained" onClick={onClose}>Cancelar</ColorButtonRed>
                        <ColorButton startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit}>Guardar</ColorButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default PopupEstablecimiento