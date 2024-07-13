import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import '../App.css';
import PopupCiudad from './popups/PopupCiudad';

function Ciudades() {
    const [ciudades, setCiudades] = useState([]);
    const [filteredCiudades, setFilteredCiudades] = useState([]);
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

    const fetchCiudades = async () => {
        try {
            const response = await invoke('get_all_ciudades');
            setCiudades(response);
            setFilteredCiudades(response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchCiudades();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        if (query === '') {
            setFilteredCiudades(ciudades);
        } else {
            const filtered = ciudades.filter((ciudad) =>
                ciudad.ciudad_nombre.toLowerCase().includes(query)
            );
            setFilteredCiudades(filtered);
        }
    };

    const handleSavePopup = async (data) => {
        try {
            if (data.ciu_id) {
                await invoke('handle_modify_ciudad', { input: data });
            } else {
                await invoke('handle_add_ciudad', { input: data });
            }
            fetchCiudades();
            handleClosePopup();
        } catch (error) {
            console.error(error);
        }
    }
    const ColorButtonRed = styled(Fab)(({ theme }) => ({
        color: theme.palette.getContrastText(red[900]),
        backgroundColor: red[900],
        '&:hover': {
            backgroundColor: red[500],
        },
    }));

    return (
        <div className='gridTop main-Conf'>
            <div>
                <h2>Ciudades</h2>
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
                    {filteredCiudades.map((ciudad) => (
                        <div className='gridCentrao similarAccordion' key={ciudad.ciu_id}>
                            <div className="gridCentrao">
                                <h3>{ciudad.ciu_nom}</h3>
                            </div>
                            <div className="ciudad-actions">
                                <Tooltip title="Editar">
                                    <IconButton onClick={() => handleOpenPopup(ciudad)}
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
                    <ColorButtonRed color="error" aria-label="add" onClick={() => handleOpenPopup()}>
                        <AddIcon />
                    </ColorButtonRed >
                </Tooltip>
            </div>
            <PopupCiudad
                isOpen={isPopupOpen}
                initialData={popupData}
                onSave={handleSavePopup}
                onClose={handleClosePopup}
            />
        </div>

    );
}

export default Ciudades;