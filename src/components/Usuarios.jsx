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
import PopupUsuario from './popups/PopupUsuario';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
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

    const fetchUsuarios = async () => {
        try {
            const response = await invoke('get_all_users');
            setUsuarios(response);
            setFilteredUsuarios(response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        if (query === '') {
            setFilteredUsuarios(usuarios);
        } else {
            const filtered = usuarios.filter((usuario) =>
                usuario.usu_nombre.toLowerCase().includes(query) ||
                usuario.usu_apellido.toLowerCase().includes(query) ||
                usuario.usu_user.toLowerCase().includes(query) ||
                usuario.usu_rol.toLowerCase().includes(query)
            );
            setFilteredUsuarios(filtered);
        }
    };

    const handleSavePopup = async (data) => {
        try {
            if (data.usu_id) {
                await invoke('handle_modify_usuario', { input: data });
            } else {
                await invoke('handle_add_usuario', { input: data });
            }
            fetchUsuarios();
            handleClosePopup();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='gridTop main-Conf'>
            <div>
                <h2>Usuarios Registrados</h2>
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
                    {filteredUsuarios.map((usuario) => (
                        <div className='gridCentrao similarAccordionTaller' key={usuario.usu_id}>
                            <div className="gridCentrao grid-3row-equal">
                                <div>
                                    <h2>{usuario.usu_nombre} {usuario.usu_apellido}</h2>
                                </div>
                                <div className='gridCentraoNoFull grid-2colum-equal'>
                                    <p>{usuario.usu_rol}</p>
                                    <p>{usuario.usu_user}</p>
                                </div>
                                <div>
                                    <p>{usuario.est_nombre}</p>
                                </div>
                            </div>
                            <div className="usuario-actions">
                                <Tooltip title="Editar">
                                    <IconButton onClick={() => handleOpenPopup(usuario)}
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
            <PopupUsuario
                isOpen={isPopupOpen}
                initialData={popupData}
                onSave={handleSavePopup}
                onClose={handleClosePopup}
            />
        </div>
    )
}

export default Usuarios