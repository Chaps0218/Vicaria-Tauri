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
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import '../App.css';

function Confirmaciones() {
  const [confirmados, setConfirmados] = useState([]);
  const [filteredConfirmados, setFilteredConfirmados] = useState([]);
  // const [anchorEl, setAnchorEl] = useState(null);
  // const [popoverId, setPopoverId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
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
        (confirmado.conf_fecha && confirmado.conf_fecha.toLowerCase().includes(query)) ||
        confirmado.conf_num_confirmacion.toLowerCase().includes(query)
      );
      setFilteredConfirmados(filtered);
    }
  };

  useEffect(() => {
    fetchConfirmados();
  }, []);

  // const open = Boolean(anchorEl);
  // const id = open ? 'simple-popover' : undefined;

  return (
    <div className='gridTop main-Conf'>
      <div>
        <h2>Confirmados</h2>
        <TextField
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: '20px' }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
        />
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
                <div className='gridCentrao grid2-colum border-top'>
                  <div className='gridCentrao info'>
                    <div className='gridCentrao2 info-libro'>
                      <strong>Tomo: </strong>
                      <div>
                        {confirmado.conf_tomo}
                      </div>
                      <strong>Página: </strong>
                      <div>
                        {confirmado.conf_pagina}
                      </div>
                      <strong>Número: </strong>
                      <div>
                        {confirmado.conf_numero}
                      </div>
                    </div>
                    <div className='gridCentrao2 info-familiares'>
                      <strong>Padre: </strong>
                      <div>
                        {confirmado.conf_padre_nombre}
                      </div>
                      <strong>Madre: </strong>
                      <div>
                        {confirmado.conf_madre_nombre}
                      </div>
                      <strong>Padrino 1: </strong>
                      <div>
                        {confirmado.conf_padrino1_nombre} {confirmado.conf_padrino1_apellido}
                      </div>
                      <strong>Padrino 2: </strong>
                      <div>
                        {confirmado.conf_padrino2_nombre} {confirmado.conf_padrino2_apellido}
                      </div>
                    </div>
                    <div className='gridCentrao2 info-lugar'>
                      <strong>Ministro:</strong>
                      <div>
                        {confirmado.min_nombre}
                      </div>
                      <strong>Establecimiento: </strong>
                      <div>
                        {confirmado.est_nombre}
                      </div>
                    </div>
                  </div>
                  <div className='acciones'>
                    <Tooltip title="Editar">
                      <IconButton
                        aria-label="edit"
                        color='success'
                        onClick={() => handleOpenPopup(confirmado)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generar Reporte">
                      <IconButton
                        aria-label="Report"
                        color='secondary'
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
          <Fab color="primary" aria-label="add" onClick={() => handleOpenPopup()}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </div>
      <PopupConfirmado
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSave={handleSavePopup}
        initialData={popupData}
      />
    </div>
  );
}

export default Confirmaciones;
