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
import PopupEstablecimiento from './popups/PopupEstablecimiento';

function Establecimientos() {
    const [establecimientos, setEstablecimientos] = useState([]);
    const [filteredEstablecimientos, setFilteredEstablecimientos] = useState([]);
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

    const fetchEstablecimientos = async () => {
        try {
            const response = await invoke('get_all_establecimientos_list');
            setEstablecimientos(response);
            setFilteredEstablecimientos(response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchEstablecimientos();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        if (query === '') {
            setFilteredEstablecimientos(establecimientos);
        } else {
            const filtered = establecimientos.filter((establecimiento) =>
                establecimiento.est_nombre.toLowerCase().includes(query) ||
                establecimiento.parr_nombre.toLowerCase().includes(query)
            );
            setFilteredEstablecimientos(filtered);
        }
    };

    const handleSavePopup = async (data) => {
        try {
            if (data.est_id) {
                await invoke('handle_modify_establecimiento', { input: data });
            } else {
                await invoke('handle_add_establecimiento', { input: data });
            }
            handleClosePopup();
            invoke('get_all_establecimientos_list').then((response) => {
                setEstablecimientos(response);
                setFilteredEstablecimientos(response);
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='gridTop main-Conf'>
            <div>
                <h2>Establecimientos</h2>
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
                    {filteredEstablecimientos.map((establecimiento) => (
                        <div className='gridCentrao similarAccordion' key={establecimiento.est_id}>
                            <div className="gridCentrao grid-2colum-equal">
                                <h2>{establecimiento.est_nombre}</h2>
                                <p>{establecimiento.parr_nombre}</p>
                            </div>
                            <div className="establecimiento-actions">
                                <Tooltip title="Editar">
                                    <IconButton onClick={() => handleOpenPopup(establecimiento)}
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
            <PopupEstablecimiento
                isOpen={isPopupOpen}
                initialData={popupData}
                onSave={handleSavePopup}
                onClose={handleClosePopup}
            />
        </div>
    )
}

export default Establecimientos