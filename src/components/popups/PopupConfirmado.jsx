import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { invoke } from '@tauri-apps/api/tauri';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useUser } from '../../UserContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import './popup.css';
import '../../App.css';

const PopupConfirmado = ({ isOpen, onClose, onSave, initialData }) => {
    const { user } = useUser();
    const now = dayjs().locale('es');
    const [formData, setFormData] = useState({
        conf_nombres: '',
        usu_id: user.usu_id,
        min_id: 1,
        est_id: 1,
        conf_apellidos: '',
        conf_fecha: now,
        conf_tomo: '',
        conf_pagina: '',
        conf_numero: '',
        conf_padre_nombre: '',
        conf_madre_nombre: '',
        conf_padrino1_nombre: '',
        conf_padrino1_apellido: '',
        conf_padrino2_nombre: '',
        conf_padrino2_apellido: '',
        conf_num_confirmacion: '',
    });
    const [errors, setErrors] = useState({});
    const [establecimientos, setEstablecimientos] = useState([]);
    const [ministros, setMinistros] = useState([]);

    useEffect(() => {
        const fetchEstablecimientos = async () => {
            const response = await invoke('get_all_establecimientos');
            setEstablecimientos(response);
        };

        const fetchMinistros = async () => {
            const response = await invoke('get_all_ministros');
            setMinistros(response);
        };

        fetchEstablecimientos();
        fetchMinistros();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
            });
        } else {
            setFormData({
                conf_nombres: '',
                usu_id: user.usu_id,
                min_id: 1,
                est_id: 1,
                conf_apellidos: '',
                conf_fecha: now,
                conf_tomo: '',
                conf_pagina: '',
                conf_numero: '',
                conf_padre_nombre: '',
                conf_madre_nombre: '',
                conf_padrino1_nombre: '',
                conf_padrino1_apellido: '',
                conf_padrino2_nombre: '',
                conf_padrino2_apellido: '',
                conf_num_confirmacion: '',
            });
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                conf_nombres: '',
                usu_id: user.usu_id,
                min_id: 1,
                est_id: 1,
                conf_apellidos: '',
                conf_fecha: now,
                conf_tomo: '',
                conf_pagina: '',
                conf_numero: '',
                conf_padre_nombre: '',
                conf_madre_nombre: '',
                conf_padrino1_nombre: '',
                conf_padrino1_apellido: '',
                conf_padrino2_nombre: '',
                conf_padrino2_apellido: '',
                conf_num_confirmacion: '',
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

    const handleDateChange = (date) => {
        setFormData({ ...formData, conf_fecha: date.format('YYYY-MM-DD') });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
            setErrors({ ...errors, [name]: true });
        } else {
            setErrors({ ...errors, [name]: false });
        }
    };

    const handleAutocompleteChange = (event, value, field) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: value ? value.id : null,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.conf_nombres) newErrors.conf_nombres = true;
        if (!formData.conf_apellidos) newErrors.conf_apellidos = true;
        if (!formData.conf_padre_nombre) newErrors.conf_padre_nombre = true;
        if (!formData.conf_madre_nombre) newErrors.conf_madre_nombre = true;
        if (!formData.conf_padrino1_nombre) newErrors.conf_padrino1_nombre = true;
        if (!formData.conf_padrino1_apellido) newErrors.conf_padrino1_apellido = true;
        if (!formData.est_id) newErrors.est_id = true;
        if (!formData.min_id) newErrors.min_id = true;
        if (!formData.conf_tomo) newErrors.conf_tomo = true;
        if (!formData.conf_pagina) newErrors.conf_pagina = true;
        if (!formData.conf_numero) newErrors.conf_numero = true;
        if (!formData.conf_num_confirmacion) newErrors.conf_num_confirmacion = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            formData.conf_tomo = Number(formData.conf_tomo);
            formData.conf_pagina = Number(formData.conf_pagina);
            formData.conf_numero = Number(formData.conf_numero);
            formData.conf_num_confirmacion = Number(formData.conf_num_confirmacion);
            if (!initialData) {
                formData.conf_fecha = formData.conf_fecha.format('YYYY-MM-DD')
            }
            onSave(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{initialData ? 'Editar Confirmado' : 'Agregar Confirmado'}</h2>
                <div className="gridCentraoNoFull form">
                    <div className='gridCentraoNoFull grid-2colum-equal'>
                        <TextField
                            fullWidth
                            label="Cédula de Confirmación"
                            type="number"
                            name="conf_num_confirmacion"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formData.conf_num_confirmacion}
                            error={errors.conf_num_confirmacion}
                            helperText={errors.conf_num_confirmacion ? 'Debe ser un número entero positivo' : ''}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                            <DatePicker
                                label="Fecha de Confirmación"
                                value={dayjs(formData.conf_fecha).locale('es')}
                                onChange={handleDateChange}
                                textField={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className='gridCentraoNoFull grid-2colum-equal'>
                        <TextField
                            fullWidth
                            label="Nombres del Confirmado"
                            name="conf_nombres"
                            onChange={handleChange}
                            onBlur={handleChange}
                            value={formData.conf_nombres}
                            error={errors.conf_nombres}
                            helperText={errors.conf_nombres ? 'Campo obligatorio' : ''}
                        />
                        <TextField
                            fullWidth
                            label="Apellidos del Confirmado"
                            name="conf_apellidos"
                            onChange={handleChange}
                            onBlur={handleChange}
                            value={formData.conf_apellidos}
                            error={errors.conf_apellidos}
                            helperText={errors.conf_apellidos ? 'Campo obligatorio' : ''}
                        />
                    </div>
                    <div className='gridCentraoNoFull grid-2colum-equal'>
                        <TextField
                            fullWidth
                            label="Padre del Confirmado"
                            name="conf_padre_nombre"
                            onChange={handleChange}
                            onBlur={handleChange}
                            value={formData.conf_padre_nombre}
                            error={errors.conf_padre_nombre}
                            helperText={errors.conf_padre_nombre ? 'Campo obligatorio' : ''}
                        />
                        <TextField
                            fullWidth
                            label="Madre del Confirmado"
                            name="conf_madre_nombre"
                            onChange={handleChange}
                            onBlur={handleChange}
                            value={formData.conf_madre_nombre}
                            error={errors.conf_madre_nombre}
                            helperText={errors.conf_madre_nombre ? 'Campo obligatorio' : ''}
                        />
                    </div>
                    <div className='gridCentraoNoFull grid-2colum-equal'>
                        <TextField
                            fullWidth
                            label="Nombres Padrino 1"
                            name="conf_padrino1_nombre"
                            onChange={handleChange}
                            onBlur={handleChange}
                            value={formData.conf_padrino1_nombre}
                            error={errors.conf_padrino1_nombre}
                            helperText={errors.conf_padrino1_nombre ? 'Campo obligatorio' : ''}
                        />
                        <TextField
                            fullWidth
                            label="Apellidos Padrino 1"
                            name="conf_padrino1_apellido"
                            onChange={handleChange}
                            onBlur={handleChange}
                            value={formData.conf_padrino1_apellido}
                            error={errors.conf_padrino1_apellido}
                            helperText={errors.conf_padrino1_apellido ? 'Campo obligatorio' : ''}
                        />
                    </div>
                    <div className='gridCentraoNoFull grid-2colum-equal'>
                        <TextField
                            fullWidth
                            label="Nombres Padrino 2"
                            name="conf_padrino2_nombre"
                            onChange={handleChange}
                            onBlur={handleChange}
                            value={formData.conf_padrino2_nombre}
                        />
                        <TextField
                            fullWidth
                            label="Apellidos Padrino 2"
                            name="conf_padrino2_apellido"
                            onChange={handleChange}
                            onBlur={handleChange}
                            value={formData.conf_padrino2_apellido}
                        />
                    </div>
                    <div className='gridCentraoNoFull grid-2colum-equal'>
                        <Autocomplete
                            fullWidth
                            options={ministros}
                            getOptionLabel={(option) => option.min_nombre}
                            onChange={(event, value) => handleAutocompleteChange(event, value, 'min_id')}
                            value={ministros.find((ministro) => ministro.min_id === formData.min_id) || null}
                            renderInput={(params) => <TextField {...params} label="Ministro" />}
                        />
                        <Autocomplete
                            fullWidth
                            options={establecimientos}
                            getOptionLabel={(option) => option.est_nombre}
                            onChange={(event, value) => handleAutocompleteChange(event, value, 'est_id')}
                            value={establecimientos.find((est) => est.est_id === formData.est_id) || null}
                            renderInput={(params) => <TextField {...params} label="Establecimiento" />}
                        />
                    </div>
                    <div className='gridCentraoNoFull grid-3colum-equal trioNum'>
                        <TextField
                            fullWidth
                            label="Tomo"
                            name="conf_tomo"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formData.conf_tomo}
                            error={errors.conf_tomo}
                            helperText={errors.conf_tomo ? 'Debe ser un número entero positivo' : ''}
                        />
                        <TextField
                            fullWidth
                            label="Página"
                            name="conf_pagina"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formData.conf_pagina}
                            error={errors.conf_pagina}
                            helperText={errors.conf_pagina ? 'Debe ser un número entero positivo' : ''}
                        />
                        <TextField
                            fullWidth
                            label="Número"
                            name="conf_numero"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formData.conf_numero}
                            error={errors.conf_numero}
                            helperText={errors.conf_numero ? 'Debe ser un número entero positivo' : ''}
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
};

export default PopupConfirmado;
