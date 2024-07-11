import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FormControl, InputLabel, Input, InputAdornment } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './popup.css';
import { useUser } from '../../UserContext';
import '../../App.css';


const PopupUsuario = ({ isOpen, onClose, onSave, initialData }) => {
    const { user } = useUser();
    const [newPass, setNewPass] = useState('');
    const [formData, setFormData] = useState({
        usu_nombre: '',
        usu_apellido: '',
        usu_user: '',
        usu_password: '',
        usu_rol: '',
        est_id: '',
    });

    const roles = [{ rol: 'admin' }, { rol: 'superadmin' }, { rol: 'usuario' }];

    const [errors, setErrors] = useState({});
    const [establecimientos, setEstablecimientos] = useState([]);

    useEffect(() => {
        const fetchEstablecimientos = async () => {
            try {
                const response = await invoke('get_all_establecimientos');
                setEstablecimientos(response);
            } catch (error) {
                console.error(error);
            }
        }
        fetchEstablecimientos();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData, isOpen])

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                usu_nombre: '',
                usu_apellido: '',
                usu_user: '',
                usu_password: '',
                usu_rol: '',
                est_id: '',
            });
            setErrors({});
            setNewPass('');
        }
    }, [isOpen]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    const handleAutocompleteChange = (event, value, field) => {
        switch (field) {
            case "est_id":
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [field]: value ? value.est_id : null,
                }));
                break;
            case "usu_rol":
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    [field]: value ? value.rol : null,
                }));
        }
    }

    const validateForm = () => {
        const newErrors = {};
        if (!formData.usu_nombre || formData.usu_nombre.length < 3) {
            newErrors.usu_nombre = 'El nombre es requerido';
        }
        if (!formData.usu_apellido) {
            newErrors.usu_apellido = 'El apellido es requerido';
        }
        if (!formData.usu_rol) {
            newErrors.usu_rol = 'El rol es requerido';
        }
        if (!formData.est_id) {
            newErrors.est_id = 'El establecimiento es requerido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            if (!initialData) {
                let firsttwo = formData.usu_nombre.substring(0, 2).toLowerCase();

                const response = await invoke('check_username', { input: firsttwo + formData.usu_apellido.toLowerCase() });
                if (response > 0) {
                    formData.usu_user = firsttwo + formData.usu_apellido.toLowerCase() + response;
                } else {
                    formData.usu_user = firsttwo + formData.usu_apellido.toLowerCase();
                }
                formData.usu_password = newPass;
            }
            formData.est_id = Number(formData.est_id);

            onSave(formData);
        }
    }

    const handleChangePass = (event) => {
        setNewPass(event.target.value);
    }

    const saveContraseña = async () => {
        let response = await invoke('handle_save_password', { input: newPass, input2: formData.usu_id });
        if (response) {
            console.log('Contraseña cambiada');
            const cambioEElement = document.getElementById('cambioE');
            cambioEElement.classList.remove('escondio');

            setTimeout(() => {
                cambioEElement.classList.add('escondio');
            }, 5000);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2 className='h2-est'>{initialData ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
                <div className="gridCentraoNoFull grid-4row-equal">
                    <div className='gridCentraoNoFull grid-2column-equal'>
                        <TextField
                            label="Nombre del Usuario"
                            name="usu_nombre"
                            value={formData.usu_nombre}
                            onChange={handleChange}
                            error={errors.usu_nombre}
                            helperText={errors.usu_nombre}
                            fullWidth
                        />
                        <TextField
                            label="Apellido del Usuario"
                            name="usu_apellido"
                            value={formData.usu_apellido}
                            onChange={handleChange}
                            error={errors.usu_apellido}
                            helperText={errors.usu_apellido}
                            fullWidth
                        />
                    </div>
                    <div className='gridCentraoNoFull grid-2column-equal'>
                        <Autocomplete
                            fullWidth
                            options={roles}
                            getOptionLabel={(option) => option.rol}
                            onChange={(event, value) => handleAutocompleteChange(event, value, 'usu_rol')}
                            value={roles.find((rol) => rol.rol === formData.usu_rol) || null}
                            renderInput={(params) => <TextField {...params} label="Rol" />}
                        />
                        <Autocomplete
                            fullWidth
                            options={establecimientos}
                            getOptionLabel={(option) => option.est_nombre}
                            onChange={(event, value) => handleAutocompleteChange(event, value, 'est_id')}
                            value={establecimientos.find((est) => est.est_id === formData.est_id) || null}
                            renderInput={(params) => <TextField {...params} label="Establecimiento" />}
                        />
                    </div>
                    {initialData ? null : <div className='gridCentraoNoFull'>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="input-with-icon-adornment">
                                Contraseña
                            </InputLabel>
                            <Input
                                type="password"
                                id="input_password"
                                name="usu_pass"
                                value={newPass}
                                onChange={handleChangePass}
                                error={errors.usu_pass}
                                helpertext={errors.usu_pass}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </div>}
                    {initialData ? (user.usu_rol === "superadmin" ? <div className='gridCentraoNoFull grid-2colum-equal'>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="input-with-icon-adornment">
                                Contraseña
                            </InputLabel>
                            <Input
                                type="password"
                                id="superadmin_changepass"
                                name="usu_pass"
                                value={newPass}
                                onChange={handleChangePass}
                                error={errors.usu_pass}
                                helpertext={errors.usu_pass}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <button onClick={saveContraseña}>Guardar Contraseña</button>
                        <p id="cambioE" className='escondio'>Contraseña cambiada</p>
                    </div>
                        :
                        <div className='gridCentraoNoFull'>
                            <p>Se necesitan permisos avanzados para cambiar la contraseña de un usuario</p>
                        </div>) : null}
                    <div className="form-buttons">
                        <button id="cancelar" onClick={onClose}>Cancelar</button>
                        <button onClick={handleSubmit}>Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopupUsuario