import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import './popup.css';
import { useUser } from '../../UserContext';
import jsPDF from 'jspdf';
import { writeBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';
import { documentDir } from '@tauri-apps/api/path';

import { styled } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';
import { red } from '@mui/material/colors';

function PopupCertificado({ isOpen, onClose, onGenerate, initialData }) {
    const { user } = useUser();
    const now = dayjs().locale('es');
    const [errors, setErrors] = useState({});
    const [parroquias, setParroquias] = useState([]);

    const [formData, setFormData] = useState({
        conf_nombres: '',
        usu_id: user.usu_id,
        min_nombre: '',
        est_nombre: '',
        parr_id: '',
        parr_nombre: '',
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
        conf_bau_ciudad: '',
        conf_bau_parroquia: '',
        conf_bau_fecha: '',
        conf_bau_tomo: 0,
        conf_bau_pagina: 0,
        conf_bau_numero: 0,
        conf_bau_info: 0,
    });

    const handleDateChange = (date) => {
        console.log('date:', date);
        setFormData({ ...formData, conf_bau_fecha: date });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.conf_bau_tomo) newErrors.bau_tomo = true;
        if (!formData.conf_bau_pagina) newErrors.bau_pagina = true;
        if (!formData.conf_bau_numero) newErrors.bau_numero = true;
        if (!formData.conf_bau_parroquia) newErrors.parr_nombre = true;
        if (!formData.conf_bau_ciudad) newErrors.ciu_nombre = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (initialData) {
            console.log('initialData:', initialData);
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
                parr_nombre: '',
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
                conf_bau_ciudad: '',
                conf_bau_parroquia: '',
                conf_bau_fecha: '',
                conf_bau_tomo: 0,
                conf_bau_pagina: 0,
                conf_bau_numero: 0,
                conf_bau_info: 0,
            });
        }
    }, [initialData, isOpen]);

    async function generatePDF() {
        const doc = new jsPDF();

        var underline = new Image();
        underline.src = '/images/underline.png';


        doc.addFont("/fonts/georgiab.ttf", "georgia", "bold");
        doc.addFont("/fonts/georgiaz.ttf", "georgia", "bolditalic");
        doc.addFont("/fonts/VerdanaNow.ttf", "verdana", "normal");
        doc.addFont("/fonts/verdana-bold.ttf", "verdana", "bold");

        doc.setFont("georgia", "bold");
        doc.setTextColor(35, 46, 114);
        doc.setFontSize(20);
        doc.text(`CERTIFICADO DE CONFIRMACIÓN`, 105, 60, null, null, 'center');
        doc.addImage(underline, 'PNG', 80, 61, 50, 10);

        doc.setFont("georgia", "bolditalic");
        doc.text(`Partida de Confirmación`, 105, 98, null, null, 'center');

        ////verdana negrita
        doc.setFont("verdana", "bold");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        doc.text(`FECHA: `, 10, 115);
        doc.text(`NOMBRES: `, 10, 127);
        doc.text(`PADRE: `, 10, 139);
        doc.text(`MADRE: `, 10, 151);
        doc.text(`PADRINO/MADRINA: `, 10, 163);
        doc.text(`MINISTRO: `, 10, 175);
        doc.text(`LUGAR: `, 10, 187);

        doc.text(`Tomo: `, 10, 199);
        doc.text(`Página: `, 50, 199);
        doc.text(`Número: `, 90, 199);


        //BAUTIZO
        doc.text(`Tomo: `, 10, 223);
        doc.text(`Página: `, 50, 223);
        doc.text(`Número: `, 90, 223);

        // verdana normal
        doc.setFont("verdana", "normal");

        const currentDate = new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        doc.text(`Quito, ${currentDate}`, 200, 80, null, null, 'right');

        let fechaconfjs = dayjs(formData.conf_fecha, 'YYYY-MM-DD').locale('es');
        let fechaConfjsFormatted = fechaconfjs.format('DD [de] MMMM [de] YYYY');

        doc.text(`Quito, ${fechaConfjsFormatted}`, doc.internal.getFontSize() * 2.5, 115);
        doc.text(`${formData.conf_nombres} ${formData.conf_apellidos}`, doc.internal.getFontSize() * 3.3, 127);
        doc.text(`${formData.conf_padre_nombre}`, doc.internal.getFontSize() * 2.5, 139);
        doc.text(`${formData.conf_madre_nombre}`, doc.internal.getFontSize() * 2.5, 151);

        doc.text(`${formData.conf_padrino1_nombre} ${formData.conf_padrino1_apellido}`, doc.internal.getFontSize() * 5.3, 163);
        // if (formData.conf_padrino2_nombre) {
        //     doc.text(`   ${formData.conf_padrino2_nombre} ${formData.conf_padrino2_apellido}`, doc.internal.getFontSize() * 2.5, 150);
        // }

        doc.text(`${formData.min_nombre}`, doc.internal.getFontSize() * 3.5, 175);
        doc.text(`${formData.parr_nombre}, ${formData.est_nombre}`, doc.internal.getFontSize() * 2.5, 187);

        doc.text(`${formData.conf_tomo}`, doc.internal.getFontSize() * 2.4, 199);
        doc.text(`${formData.conf_pagina}`, doc.internal.getFontSize() * 6, 199);
        doc.text(`${formData.conf_numero}`, doc.internal.getFontSize() * 9.5, 199);

        ///////////BAUTIZO/////////
        let fechabaujs = dayjs(formData.conf_bau_fecha, 'YYYY-MM-DD').locale('es');
        //let fechabaujs = dayjs(formData.conf_bau_fecha).locale('es');
        let fechaBaufjsFormatted = fechabaujs.format('DD [de] MMMM [de] YYYY');

        doc.text(`Bautizado en ${formData.conf_bau_ciudad}, ${formData.conf_bau_parroquia}, ${fechaBaufjsFormatted}`, 10, 211);
        // doc.text(`Ministro Bautizo: ${formData.conf_min_nombre}`, 10, 210);

        doc.text(`${formData.conf_bau_tomo}`, doc.internal.getFontSize() * 2.54, 223);
        doc.text(`${formData.conf_bau_pagina}`, doc.internal.getFontSize() * 6, 223);
        doc.text(`${formData.conf_bau_numero}`, doc.internal.getFontSize() * 9.5, 223);


        doc.setFont("verdana", "bold");
        doc.text(`Son datos tomados fielmente del original.`, 10, 235);

        doc.setFont("helvetica", "bold");
        doc.text(`F. ______________________________`, 150, 250, null, null, 'center');
        doc.text(`P. Marco Gualoto Sotalín`, 150, 255, null, null, 'center');
        doc.text(`Vicario Episcopal`, 150, 259, null, null, 'center');

        const pdfBytes = doc.output('arraybuffer');
        const fileName = `certificado_${formData.conf_nombres}_${formData.conf_apellidos}_${now.format("YYYY-MM-DD_HH_mm_ss")}.pdf`;
        const dirPath = await documentDir();
        const filePath = `${dirPath}\\certificados\\${fileName}`;

        await writeBinaryFile({ path: filePath, contents: pdfBytes }, { dir: BaseDirectory.Document });
        await invoke("open_file", { filepath: filePath });
    }

    const handleSubmit = () => {
        if (validateForm()) {
            formData.conf_bau_tomo = Number(formData.conf_bau_tomo);
            formData.conf_bau_pagina = Number(formData.conf_bau_pagina);
            formData.conf_bau_numero = Number(formData.conf_bau_numero);
            formData.conf_num_confirmacion = Number(formData.conf_num_confirmacion);
            if (formData.conf_bau_info === 0) {
                formData.conf_bau_info = 1;
            }

            generatePDF();
            onGenerate(formData);
        } else {
            console.log('Form validation failed:', errors);
        }
    };



    if (!isOpen) return null;

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
                <div className='gridCentrao grid-3row-center'>
                    <div className='gridCentrao info-per'>
                        <div><strong>Nombres: {formData.conf_nombres} {formData.conf_apellidos}</strong></div>
                        <div><strong>No. Confirmación: {formData.conf_num_confirmacion}</strong></div>
                        <br></br>
                    </div>
                    <div className='gridTop cartas grid-2colum-equal'>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <h2>Datos Confirmación</h2>
                                <div>
                                    <p><strong>Fecha:</strong> {formData.conf_fecha}</p>
                                    <div className='gridCentrao2 grid-3colum-equal'>
                                        <div><strong>Tomo:</strong></div>
                                        <div><strong>Página:</strong></div>
                                        <div><strong>Número:</strong></div>
                                        <div>{formData.conf_tomo}</div>
                                        <div>{formData.conf_pagina}</div>
                                        <div>{formData.conf_numero}</div>
                                    </div>
                                    <p><strong>Padre:</strong> {formData.conf_padre_nombre}</p>
                                    <p><strong>Madre:</strong> {formData.conf_madre_nombre}</p>
                                    <div id="padrinos" className='gridCentrao2'>
                                        <div><strong>Padrino/Madrina:</strong> {formData.conf_padrino1_nombre} {formData.conf_padrino1_apellido}</div>
                                    </div>
                                    {/* <div id="padrinos" className='gridCentrao2'>
                                        <div><strong>Padrino:</strong> {formData.conf_padrino1_nombre} {formData.conf_padrino1_apellido}</div>
                                        {initialData ? <div><strong>Madrina:</strong> {formData.conf_padrino2_nombre} {formData.conf_padrino2_apellido}</div> : null}
                                    </div> */}
                                    <p><strong>Parroquia:</strong> {formData.parr_nombre}</p>
                                    <p><strong>Ministro:</strong> {formData.min_nombre}</p>
                                    <p><strong>Establecimiento:</strong> {formData.est_nombre}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <h2>Datos Bautizo</h2>
                                <div >
                                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                        <DatePicker
                                            label="Fecha de Bautizo"
                                            value={dayjs(formData.conf_bau_fecha).locale('es')}
                                            onChange={handleDateChange}
                                            textField={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                    <div className='gridCentraoNoFull grid-3colum-equal input-separado'>
                                        <TextField
                                            fullWidth
                                            label="Tomo"
                                            name="conf_bau_tomo"
                                            defaultValue="Small"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formData.conf_bau_tomo}
                                            error={errors.bau_tomo}
                                            helperText={errors.bau_tomo ? 'Debe ser un número entero positivo' : ''}
                                            autoComplete='one-time-code'
                                        />
                                        <TextField
                                            fullWidth
                                            label="Página"
                                            name="conf_bau_pagina"
                                            defaultValue="Small"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formData.conf_bau_pagina}
                                            error={errors.bau_pagina}
                                            helperText={errors.bau_pagina ? 'Debe ser un número entero positivo' : ''}
                                            autoComplete='one-time-code'
                                        />
                                        <TextField
                                            fullWidth
                                            label="Número"
                                            name="conf_bau_numero"
                                            defaultValue="Small"
                                            size="small"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={formData.conf_bau_numero}
                                            error={errors.bau_numero}
                                            helperText={errors.bau_numero ? 'Debe ser un número entero positivo' : ''}
                                            autoComplete='one-time-code'
                                        />
                                    </div>
                                    <div className='input-separado'>
                                        <TextField
                                            label="Ciudad de Bautizo"
                                            name="conf_bau_ciudad"
                                            defaultValue="Small"
                                            size="small"
                                            value={formData.conf_bau_ciudad}
                                            onChange={handleChange}
                                            error={errors.ciu_nombre}
                                            helperText={errors.ciu_nombre}
                                            fullWidth
                                            autoComplete='one-time-code'
                                        />
                                    </div>
                                    <div className='input-separado'>
                                        <TextField
                                            label="Parroquia de Bautizo"
                                            name="conf_bau_parroquia"
                                            defaultValue="Small"
                                            size="small"
                                            value={formData.conf_bau_parroquia}
                                            onChange={handleChange}
                                            error={errors.parr_nombre}
                                            helperText={errors.parr_nombre}
                                            fullWidth
                                            autoComplete='one-time-code'
                                        />
                                    </div>
                                    {/* <div className='input-separado'>
                                        <TextField
                                            label="Ministro de Bautizo"
                                            name="min_nombre"
                                            defaultValue="Small"
                                            size="small"
                                            value={formDataBau.min_nombre}
                                            onChange={handleChange}
                                            error={errors.min_nombre}
                                            helperText={errors.min_nombre}
                                            fullWidth
                                        />
                                    </div> */}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <br></br>
                    <div className="gridCentraoButtons grid-2colum-equal-lessSpace">
                        <ColorButton startIcon={<AssignmentIcon />} variant="contained" onClick={handleSubmit}>Generar</ColorButton>
                        <ColorButtonRed startIcon={<CloseIcon />} variant="contained" onClick={onClose}>Cancelar</ColorButtonRed>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopupCertificado