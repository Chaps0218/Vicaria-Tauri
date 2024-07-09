import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import '../App.css';

import PopupParroquia from './popups/PopupParroquia';

function Parroquia() {
    const [parroquias, setParroquias] = useState([]);
    const [filteredParroquias, setFilteredParroquias] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState(null);

    const handleOpenPopup = (data = null) => {
        setPopupData(data);
        setIsPopupOpen(true);
    }

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setPopupData(null);
    }

    const fetchParroquias = async () => {
        try {
            const response = await invoke('get_all_parroquias');
            setParroquias(response);
            setFilteredParroquias(response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchParroquias();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        if (query === '') {
            setFilteredParroquias(parroquias);
        } else {
            const filtered = parroquias.filter((parroquia) =>
                parroquia.parr_nombre.toLowerCase().includes(query)
            );
            setFilteredParroquias(filtered);
        }
    }

    const handleSavePopup = async (data) => {
        try {
            if (data.parr_id) {
                await invoke('handle_modify_parroquia', { input: data });
            } else {
                await invoke('handle_add_parroquia', { input: data });
            }
            fetchParroquias();
            handleClosePopup();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='gridTop main-Conf'>
            <div>
                <h2>Parroquias</h2>
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
                    {filteredParroquias.map((parroquia) => (
                        <div className='gridCentrao similarAccordion' key={parroquia.parr_id}>
                            <div className="gridCentrao grid-2colum-equal">
                                <h2>{parroquia.parr_nombre}</h2>
                                <p>{parroquia.ciu_nom}</p>
                            </div>
                            <div className="parroquia-actions">
                                <Tooltip title="Editar">
                                    <IconButton onClick={() => handleOpenPopup(parroquia)}
                                        aria-label="edit"
                                        color='success'>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
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
            <PopupParroquia
                isOpen={isPopupOpen}
                initialData={popupData}
                onSave={handleSavePopup}
                onClose={handleClosePopup}
            />
        </div>
    );
}

export default Parroquia;