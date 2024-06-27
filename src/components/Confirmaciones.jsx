import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import Popover from '@mui/material/Popover';
import PopupConfirmado from './popups/PopupConfirmado';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import '../App.css';

function Confirmaciones() {
  const [confirmados, setConfirmados] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverId, setPopoverId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const handlePopoverOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setPopoverId(id);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverId(null);
  };

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
        await invoke('update_confirmado', { data });
      } else {
        await invoke('add_confirmado', { data });
      }
      setConfirmados(await invoke('get_all_confirmados'));
    } catch (error) {
      console.error('Error saving confirmado:', error);
    }
    handleClosePopup();
  };

  useEffect(() => {
    async function fetchConfirmados() {
      try {
        const response = await invoke('get_all_confirmados');
        setConfirmados(response);
      } catch (error) {
        console.error('Error fetching confirmados:', error);
      }
    }

    fetchConfirmados();
  }, [confirmados]);

  return (
    <div className='gridTop main-Conf'>
      <div>
        <h1>Confirmados</h1>
        <div className='overflow'>
          {confirmados.map((confirmado) => (
            <Accordion key={confirmado.conf_id}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls={`panel-${confirmado.conf_id}-content`}
                id={`panel-${confirmado.conf_id}-header`}
              >
                <div className='gridCentrao grid-3colum'>
                  <div>
                    {confirmado.conf_id}
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
                    <IconButton
                      aria-label="edit"
                      color='success'
                      aria-owns={popoverId === `edit-${confirmado.conf_id}` ? `mouse-over-popoverEdit-${confirmado.conf_id}` : undefined}
                      aria-haspopup="true"
                      onMouseEnter={(event) => handlePopoverOpen(event, `edit-${confirmado.conf_id}`)}
                      onMouseLeave={handlePopoverClose}
                      onClick={() => handleOpenPopup(confirmado)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Report"
                      color='secondary'
                      aria-owns={popoverId === `report-${confirmado.conf_id}` ? `mouse-over-popoverReport-${confirmado.conf_id}` : undefined}
                      aria-haspopup="true"
                      onMouseEnter={(event) => handlePopoverOpen(event, `report-${confirmado.conf_id}`)}
                      onMouseLeave={handlePopoverClose}
                    >
                      <AssignmentIcon />
                    </IconButton>
                    <Popover
                      id={`mouse-over-popoverEdit-${confirmado.conf_id}`}
                      sx={{ pointerEvents: 'none' }}
                      open={popoverId === `edit-${confirmado.conf_id}` && Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                      onClose={handlePopoverClose}
                      disableRestoreFocus
                    >
                      <Typography sx={{ p: 1 }}>Editar</Typography>
                    </Popover>
                    <Popover
                      id={`mouse-over-popoverReport-${confirmado.conf_id}`}
                      sx={{ pointerEvents: 'none' }}
                      open={popoverId === `report-${confirmado.conf_id}` && Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                      onClose={handlePopoverClose}
                      disableRestoreFocus
                    >
                      <Typography sx={{ p: 1 }}>Generar Reporte</Typography>
                    </Popover>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
        <PopupConfirmado
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onSave={handleSavePopup}
          initialData={popupData}
        />
      </div>
      <div className='fab-container'>
        <Fab color="primary" aria-label="add"
          aria-owns={popoverId === 'add' ? 'mouse-over-popoverAdd' : undefined}
          aria-haspopup="true"
          onMouseEnter={(event) => handlePopoverOpen(event, 'add')}
          onMouseLeave={handlePopoverClose}
          onClick={() => handleOpenPopup()}
        >
          <AddIcon />
        </Fab>
        <Popover
          id="mouse-over-popoverAdd"
          sx={{ pointerEvents: 'none' }}
          open={popoverId === 'add' && Boolean(anchorEl)}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{ p: 1 }}>Añadir</Typography>
        </Popover>
      </div>
    </div>
  );
}

export default Confirmaciones;
