import React, { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import PopupConfirmado from './popups/PopupConfirmado';
import PopupCertificado from './popups/PopupCertificado';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import '../App.css';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';

function Confirmaciones() {
    const [confirmados, setConfirmados] = useState([]);
    const [filteredConfirmados, setFilteredConfirmados] = useState([]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState(null);
    const [isPopupOpenCert, setIsPopupOpenCert] = useState(false);
    const [popupDataCert, setPopupDataCert] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const searchTimeout = useRef(null);

    useEffect(() => {
        setLoading(true);
        invoke('get_confirmados_count')
            .then(setTotalCount)
            .finally(() => setLoading(false))
            .catch(console.error);
    }, []);

    const fetchConfirmados = async (pageNum = 1) => {
        setLoading(true);
        try {
            const offset = (pageNum - 1) * pageSize;
            const confirmados = await invoke('get_confirmados_paginated', { offset, limit: pageSize });
            setConfirmados(confirmados);
            setFilteredConfirmados(confirmados);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleOpenPopup = (data = null) => {
        setPopupData(data);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setPopupData(null);
    };

    const handleOpenPopupCert = (data = null) => {
        setPopupDataCert(data);
        setIsPopupOpenCert(true);
    };

    const handleClosePopupCert = () => {
        setIsPopupOpenCert(false);
        setPopupDataCert(null);
    };

    const handleSavePopup = async (data) => {
        try {
            if (data.conf_id) {
                console.log(data)
                await invoke('handle_modify_confirmado', { input: data });
            } else {
                await invoke('handle_add_confirmado', { input: data });
            }
            const updatedConfirmados = await invoke('get_confirmados_paginated', { offset: 0, limit: pageSize });
            setConfirmados(updatedConfirmados);
            setFilteredConfirmados(updatedConfirmados);
        } catch (error) {
            console.error(error);
        }
        handleClosePopup();
    };

    const handleSavePopupCert = async (data) => {
        try {
            if (data.conf_id) {
                await invoke('handle_modify_confirmado', { input: data });
            }
            const updatedConfirmados = await invoke('get_confirmados_paginated', { offset: 0, limit: pageSize });
            setConfirmados(updatedConfirmados);
            setFilteredConfirmados(updatedConfirmados);
        } catch (error) {
            console.error(error);
        }
        handleClosePopupCert();
    };

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setIsSearching(true);
        setPage(1); // Reset to first page on new search

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            if (query.trim() === '') {
                // No search, fetch normal paginated data
                invoke('get_confirmados_count').then(setTotalCount).catch(console.error);
                fetchConfirmados(1);
                setIsSearching(false);
            } else {
                // Search on backend
                invoke('search_confirmados_count', { query })
                    .then(setTotalCount)
                    .catch(console.error);

                invoke('search_confirmados', { query, offset: 0, limit: pageSize })
                    .then((results) => {
                        setConfirmados(results);
                        setFilteredConfirmados(results);
                        setIsSearching(false);
                    })
                    .catch(console.error);
            }
        }, 400); // 400ms debounce
    };

    const ColorButtonRed = styled(Fab)(({ theme }) => ({
        color: theme.palette.getContrastText(red[900]),
        backgroundColor: red[900],
        '&:hover': {
            backgroundColor: red[500],
        },
    }));

    useEffect(() => {
        if (searchQuery.trim() === '') {
            fetchConfirmados(page);
        } else {
            setIsSearching(true);
            const offset = (page - 1) * pageSize;
            invoke('search_confirmados', { query: searchQuery, offset, limit: pageSize })
                .then((results) => {
                    setConfirmados(results);
                    setFilteredConfirmados(results);
                })
                .finally(() => setIsSearching(false));
        }
        // eslint-disable-next-line
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <div className='gridTop main-Conf'>
            <div>
                <h2>Confirmaciones</h2>
                <TextField
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ marginBottom: '10px' }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                        style: {
                            padding: '3px 10px',
                            fontSize: '14px',
                        },
                    }}
                    placeholder='Buscar'

                />
                <div className='gridCentrao3 grid-header-conf'>
                    <p>Cédula</p>
                    <p>Nombres Apellidos </p>
                    <p>Fecha</p>
                    <p>Más</p>
                </div>
                {/* Contenido */}
                <div className='overflow2' style={{ minHeight: 200, position: 'relative' }}>
                    {(loading || isSearching) && (
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255,255,255,0.7)',
                            zIndex: 2
                        }}>
                            <CircularProgress />
                        </div>
                    )}

                    {!loading && !isSearching && filteredConfirmados.map((confirmado) => (
                        <Accordion key={confirmado.conf_id}>
                            <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                                <div className='gridCentrao grid-3colum'>
                                    <div>
                                        {confirmado.conf_num_confirmacion}
                                    </div>
                                    <div>
                                        {confirmado.conf_nombres} {confirmado.conf_apellidos}
                                    </div>
                                    <div>
                                        {confirmado.conf_fecha}
                                    </div>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className='gridCentrao2 grid2-colum '>
                                    <div className='gridCentrao info '>

                                        <div className='gridCentrao2  grid-2colum-datos'>
                                            <strong className=''>Padre: </strong>
                                            <div>
                                                {confirmado.conf_padre_nombre}
                                            </div>
                                            <strong className='input-separado-2'>Madre: </strong>
                                            <div className='input-separado-2'>
                                                {confirmado.conf_madre_nombre}
                                            </div>
                                            <strong className='input-separado-2'>Padrino/Madrina: </strong>
                                            <div className='input-separado-2'>
                                                {confirmado.conf_padrino1_nombre} {confirmado.conf_padrino1_apellido}
                                            </div>
                                            {/* <strong>Madrina: </strong>
                      <div>
                        {confirmado.conf_padrino2_nombre} {confirmado.conf_padrino2_apellido}
                      </div> */}
                                            <strong className='input-separado-2'>Ministro:</strong>
                                            <div className='input-separado-2'>
                                                {confirmado.min_nombre}
                                            </div>
                                            <strong className='input-separado-2'>Establecimiento: </strong>
                                            <div className='input-separado-2'>
                                                {confirmado.est_nombre}
                                            </div>
                                        </div>
                                        <div className='gridCentrao2 info-libro'>
                                            <strong className='input-separado-2'>Tomo: </strong>
                                            <strong className='input-separado-2'>Página: </strong>
                                            <strong className='input-separado-2'>Número: </strong>
                                            <div>
                                                {confirmado.conf_tomo}
                                            </div>
                                            <div>
                                                {confirmado.conf_pagina}
                                            </div>
                                            <div>
                                                {confirmado.conf_numero}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='acciones'>
                                        <Tooltip title="Editar">
                                            <IconButton
                                                aria-label="edit"
                                                color='success'
                                                fontSize='large'
                                                onClick={() => handleOpenPopup(confirmado)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Generar Reporte">
                                            <IconButton
                                                aria-label="Report"
                                                color="info"
                                                onClick={() => handleOpenPopupCert(confirmado)}
                                            >
                                                <AssignmentIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <div className='info-bautizo'>
                                            {confirmado.conf_bau_info === 1 ?
                                                <div className='gridCentrao2 noInfo'>
                                                    <div>Información de bautizo completa.</div>
                                                </div> : <div className='gridCentrao2 noInfo'>
                                                    <div>Falta información de bautizo.</div>
                                                </div>}
                                        </div>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
                <Pagination
                    count={Math.ceil(totalCount / pageSize)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    style={{ marginTop: 16, marginBottom: 16 }}
                />
            </div>
            <div className='fab-container'>
                <Tooltip title="Agregar Confirmado">
                    <ColorButtonRed color="error" aria-label="add" onClick={() => handleOpenPopup()}>
                        <AddIcon />
                    </ColorButtonRed >
                </Tooltip>
            </div>
            <PopupConfirmado
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                onSave={handleSavePopup}
                initialData={popupData}
            />

            <PopupCertificado
                isOpen={isPopupOpenCert}
                onClose={handleClosePopupCert}
                onGenerate={handleSavePopupCert}
                initialData={popupDataCert}
            />
        </div>
    );
}

export default Confirmaciones;
