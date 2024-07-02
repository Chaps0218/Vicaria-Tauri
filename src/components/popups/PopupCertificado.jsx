import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import AssignmentIcon from '@mui/icons-material/Assignment';
import './popup.css';
import { useUser } from '../../UserContext';
import jsPDF from 'jspdf';
import { writeBinaryFile } from '@tauri-apps/api/fs';
import { documentDir } from '@tauri-apps/api/path';

function PopupCertificado({ isOpen, onClose, onGenerate, initialData }) {
    const { user } = useUser();
    const now = dayjs().locale('es');
    const [errors, setErrors] = useState({});
    const [parroquias, setParroquias] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [ministros, setMinistros] = useState([]);
    const [parroquiaEstable, setParroquiaEstable] = useState('');

    const mostrarParroquia = () => {
        parroquias.every((parroquia) => {
            if (parroquia.parr_id === formData.parr_id) {
                setParroquiaEstable(parroquia.parr_nombre);
                return false;
            } else return true
        })
    }

    useEffect(() => {
        const fetchCiudades = async () => {
            const response = await invoke('get_all_ciudades');
            setCiudades(response);
        };

        const fetchParroquias = async () => {
            const response = await invoke('get_all_parroquias');
            setParroquias(response);
            mostrarParroquia();
        };

        const fetchMinistros = async () => {
            const response = await invoke('get_all_ministros');
            setMinistros(response);
        };

        fetchCiudades();
        fetchMinistros();
        fetchParroquias();
    }, []);

    const [formData, setFormData] = useState({
        conf_nombres: '',
        usu_id: user.usu_id,
        min_nombre: '',
        est_nombre: '',
        parr_id: '',
        conf_apellidos: '',
        conf_fecha: now.format("YYYY-MM-DD"),
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

    const [formDataBau, setFormDataBau] = useState({
        bau_fecha: now,
        bau_tomo: '',
        bau_pagina: '',
        bau_numero: '',
        ciu_id: '',
        parr_id: '',
        min_id: '',
    });

    useEffect(() => {
        if (!isOpen) {
            setFormDataBau({
                bau_fecha: now,
                bau_tomo: '',
                bau_pagina: '',
                bau_numero: '',
                ciu_id: '',
                parr_id: '',
                min_id: '',
            });
            setErrors({});
        }
    }, [isOpen]);

    const handleDateChange = (date) => {
        setFormDataBau({ ...formData, conf_fecha: date });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormDataBau((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
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
        switch (field) {
            case "ciu_id":
                setFormDataBau((prevFormData) => ({
                    ...prevFormData,
                    [field]: value ? value.ciu_id : null,
                }));
                break
            case "parr_id":
                setFormDataBau((prevFormData) => ({
                    ...prevFormData,
                    [field]: value ? value.parr_id : null,
                }));
                break
            case "min_id":
                setFormDataBau((prevFormData) => ({
                    ...prevFormData,
                    [field]: value ? value.min_id : null,
                }));
                break
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formDataBau.bau_tomo) newErrors.bau_tomo = true;
        if (!formDataBau.bau_pagina) newErrors.bau_pagina = true;
        if (!formDataBau.bau_numero) newErrors.bau_numero = true;
        if (!formDataBau.parr_id) newErrors.parr_id = true;
        if (!formDataBau.ciu_id) newErrors.ciu_id = true;
        if (!formDataBau.min_id) newErrors.min_id = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
            });
            document.getElementById("padrinos").classList.add("grid-2row-equal");
        } else {
            setFormData({
                conf_nombres: '',
                usu_id: user.usu_id,
                min_nombre: '',
                est_nombre: '',
                parr_id: '',
                conf_apellidos: '',
                conf_fecha: now.format("YYYY-MM-DD"),
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

    async function generatePDF() {
        const doc = new jsPDF();

        doc.text(`Nombres: ${formData.conf_nombres} ${formData.conf_apellidos}`, 10, 10);
        doc.text(`No. Confirmación: ${formData.conf_num_confirmacion}`, 10, 20);
        doc.text(`Fecha de Confirmación: ${formData.conf_fecha}`, 10, 30);
        doc.text(`Tomo: ${formData.conf_tomo}`, 10, 40);
        doc.text(`Página: ${formData.conf_pagina}`, 10, 50);
        doc.text(`Número: ${formData.conf_numero}`, 10, 60);
        doc.text(`Padre: ${formData.conf_padre_nombre}`, 10, 70);
        doc.text(`Madre: ${formData.conf_madre_nombre}`, 10, 80);
        doc.text(`Padrino 1: ${formData.conf_padrino1_nombre} ${formData.conf_padrino1_apellido}`, 10, 90);
        if (formData.conf_padrino2_nombre) {
            doc.text(`Padrino 2: ${formData.conf_padrino2_nombre} ${formData.conf_padrino2_apellido}`, 10, 100);
        }
        doc.text(`Parroquia: ${parroquiaEstable}`, 10, 110);
        doc.text(`Ministro: ${formData.min_nombre}`, 10, 120);
        doc.text(`Establecimiento: ${formData.est_nombre}`, 10, 130);

        doc.text(`Fecha de Bautizo: ${formDataBau.bau_fecha}`, 10, 140);
        doc.text(`Tomo Bautizo: ${formDataBau.bau_tomo}`, 10, 150);
        doc.text(`Página Bautizo: ${formDataBau.bau_pagina}`, 10, 160);
        doc.text(`Número Bautizo: ${formDataBau.bau_numero}`, 10, 170);
        doc.text(`Ciudad: ${ciudades.find(c => c.ciu_id === formDataBau.ciu_id)?.ciu_nom || ''}`, 10, 180);
        doc.text(`Parroquia Bautizo: ${parroquias.find(p => p.parr_id === formDataBau.parr_id)?.parr_nombre || ''}`, 10, 190);
        doc.text(`Ministro Bautizo: ${ministros.find(m => m.min_id === formDataBau.min_id)?.min_nombre || ''}`, 10, 200);

        const pdfBytes = doc.output('arraybuffer');
        const fileName = `certificado_${formData.conf_nombres}_${formData.conf_apellidos}_${now.format("YYYY-MM-DD_HH_mm_ss")}.pdf`;
        const dirPath = await documentDir();
        const filePath = `${dirPath}\certificados\\${fileName}`;

        await writeBinaryFile(filePath, pdfBytes);
        invoke("open_file", { filepath: filePath });
    }

    const handleSubmit = () => {
        if (validateForm()) {
            formDataBau.bau_tomo = Number(formDataBau.bau_tomo);
            formDataBau.bau_pagina = Number(formDataBau.bau_pagina);
            formDataBau.bau_numero = Number(formDataBau.bau_numero);
            formData.conf_num_confirmacion = Number(formData.conf_num_confirmacion);
            formDataBau.bau_fecha = formDataBau.bau_fecha.format('YYYY-MM-DD')
            generatePDF();
            onGenerate(formDataBau);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className='gridCentrao grid-3row-center'>
                    <div className='gridCentrao info-per'>
                        <h4>Nombres: {formData.conf_nombres} {formData.conf_apellidos}</h4>
                        <h4>No. Confirmación: {formData.conf_num_confirmacion}</h4>
                    </div>
                    <div className='gridCentrao cartas grid-2colum-equal'>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <h2>Datos Confirmación</h2>
                                <div>
                                    <p><strong>Fecha:</strong> {formData.conf_fecha}</p>
                                    <div className='gridCentrao grid-3colum-equal'>
                                        <p>Tomo: {formData.conf_tomo}</p>
                                        <p>Página: {formData.conf_pagina}</p>
                                        <p>Número: {formData.conf_numero}</p>
                                    </div>
                                    <p>Padre: {formData.conf_padre_nombre}</p>
                                    <p>Madre: {formData.conf_madre_nombre}</p>
                                    <div id="padrinos" className='gridCentrao'>
                                        <p>Padrino 1: {formData.conf_padrino1_nombre} {formData.conf_padrino1_apellido}</p>
                                        {initialData ? <p>Padrino 2: {formData.conf_padrino2_nombre} {formData.conf_padrino2_apellido}</p> : null}
                                    </div>
                                    <p>Parroquia: {parroquiaEstable}</p>
                                    <p>Ministro: {formData.min_nombre}</p>
                                    <p>Establecimiento: {formData.est_nombre}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <h2>Datos Confirmación</h2>
                                <div >
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                        <DatePicker
                                            label="Fecha de Confirmación"
                                            value={dayjs(formDataBau.bau_fecha).locale('es')}
                                            onChange={handleDateChange}
                                            textField={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                    <div className='gridCentraoNoFull grid-3colum-equal'>
                                        <TextField
                                            fullWidth
                                            label="Tomo"
                                            name="bau_tomo"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formDataBau.bau_tomo}
                                            error={errors.bau_tomo}
                                            helperText={errors.bau_tomo ? 'Debe ser un número entero positivo' : ''}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Página"
                                            name="bau_pagina"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formDataBau.bau_pagina}
                                            error={errors.bau_pagina}
                                            helperText={errors.bau_pagina ? 'Debe ser un número entero positivo' : ''}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Número"
                                            name="bau_numero"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formDataBau.bau_numero}
                                            error={errors.bau_numero}
                                            helperText={errors.bau_numero ? 'Debe ser un número entero positivo' : ''}
                                        />
                                    </div>
                                    <Autocomplete
                                        fullWidth
                                        options={ciudades}
                                        getOptionLabel={(option) => option.ciu_nom}
                                        onChange={(event, value) => handleAutocompleteChange(event, value, 'ciu_id')}
                                        value={ciudades.find((ciu) => ciu.ciu_id === formDataBau.ciu_id) || null}
                                        renderInput={(params) => <TextField {...params} label="Ciudad" />}
                                    />
                                    <Autocomplete
                                        fullWidth
                                        options={parroquias.filter((parroquia) => parroquia.ciu_id == formDataBau.ciu_id)}
                                        getOptionLabel={(option) => option.parr_nombre}
                                        onChange={(event, value) => handleAutocompleteChange(event, value, 'parr_id')}
                                        value={parroquias.find((parr) => parr.parr_id === formDataBau.parr_id) || null}
                                        renderInput={(params) => <TextField {...params} label="Parroquia" />}
                                    />
                                    <Autocomplete
                                        fullWidth
                                        options={ministros}
                                        getOptionLabel={(option) => option.min_nombre}
                                        onChange={(event, value) => handleAutocompleteChange(event, value, 'min_id')}
                                        value={ministros.find((min) => min.min_id === formDataBau.min_id) || null}
                                        renderInput={(params) => <TextField {...params} label="Ministro" />}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='gridCentrao'>
                        <button id="cancelar" onClick={onClose}>Cancelar</button>
                        <Button variant="contained" startIcon={<AssignmentIcon />} onClick={handleSubmit}>
                            Generar Certificado
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopupCertificado