import React, { useState, useEffect } from 'react';
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

function Confirmaciones() {
  const [confirmados, setConfirmados] = useState([]);
  const [filteredConfirmados, setFilteredConfirmados] = useState([]);
  // const [anchorEl, setAnchorEl] = useState(null);
  // const [popoverId, setPopoverId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [isPopupOpenCert, setIsPopupOpenCert] = useState(false);
  const [popupDataCert, setPopupDataCert] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // const handlePopoverOpen = (event, id) => {
  //   setAnchorEl(event.currentTarget);
  //   setPopoverId(id);
  // };

  // const handlePopoverClose = () => {
  //   setAnchorEl(null);
  //   setPopoverId(null);
  // };

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
      const updatedConfirmados = await invoke('get_all_confirmados');
      setConfirmados(updatedConfirmados);
      setFilteredConfirmados(updatedConfirmados);
    } catch (error) {
      console.error(error);
    }
    handleClosePopup();
  };

  const handleSavePopupCert = async (data) => {
    handleClosePopupCert();
  };


  const fetchConfirmados = async () => {
    try {
      const confirmados = await invoke('get_all_confirmados');
      setConfirmados(confirmados);
      setFilteredConfirmados(confirmados);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setFilteredConfirmados(confirmados);
    } else {
      const filtered = confirmados.filter((confirmado) =>
        confirmado.conf_nombres.toLowerCase().includes(query) ||
        confirmado.conf_apellidos.toLowerCase().includes(query) ||
        (confirmado.conf_fecha && confirmado.conf_fecha.toLowerCase().includes(query)) //||
        //confirmado.conf_num_confirmacion.toLowerCase().includes(query)
      );
      setFilteredConfirmados(filtered);
    }
  };

  const ColorButtonRed = styled(Fab)(({ theme }) => ({
    color: theme.palette.getContrastText(red[900]),
    backgroundColor: red[900],
    '&:hover': {
      backgroundColor: red[500],
    },
  }));

  useEffect(() => {
    fetchConfirmados();
  }, []);

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
              padding: '3px 10px',  // Ajusta el padding según sea necesario
              fontSize: '14px',  // Ajusta el tamaño de la fuente según sea necesario
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
        <div className='overflow'>

          {filteredConfirmados.map((confirmado) => (
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
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
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
