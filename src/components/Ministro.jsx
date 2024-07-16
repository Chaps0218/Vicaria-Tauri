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
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import '../App.css';
import PopupMinistro from './popups/PopupMinistro';

function Ministro() {
    const [ministros, setMinistros] = useState([]);
    const [filteredMinistros, setFilteredMinistros] = useState([]);
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

    const fetchMinistros = async () => {
        try {
            const response = await invoke('get_all_ministros');
            setMinistros(response);
            setFilteredMinistros(response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchMinistros();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        if (query === '') {
            setFilteredMinistros(ministros);
        } else {
            const filtered = ministros.filter((ministro) =>
                ministro.min_nombre.toLowerCase().includes(query)
            );
            setFilteredMinistros(filtered);
        }
    }

    const handleSavePopup = async (data) => {
        try {
            if (data.min_id) {
                await invoke('handle_modify_ministro', { input: data });
            } else {
                await invoke('handle_add_ministro', { input: data });
            }
            fetchMinistros();
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
                <h2>Ministros</h2>
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
                <div className='gridCentrao3 grid-header-min'>
                    <p>Nombre Ministro</p>
                    <p> Editar </p>
                </div>
                <div className='overflow'>
                    <div className='gridCentrao-lista'>
                        {filteredMinistros.map((ministro) => (
                            <div className='gridCentrao3 similarAccordion' key={ministro.min_id}>
                                <div className="gridCentrao">
                                    <h3>{ministro.min_nombre}</h3>
                                </div>
                                <div className="ministro-actions">
                                    <Tooltip title="Editar">
                                        <IconButton onClick={() => handleOpenPopup(ministro)}
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
            </div>
            <div className='fab-container'>
                <Tooltip title="Agregar Confirmado">
                    <ColorButtonRed color="error" aria-label="add" onClick={() => handleOpenPopup()}>
                        <AddIcon />
                    </ColorButtonRed >
                </Tooltip>
            </div>
            <PopupMinistro
                isOpen={isPopupOpen}
                initialData={popupData}
                onSave={handleSavePopup}
                onClose={handleClosePopup}
            />
        </div>
    )
}

export default Ministro