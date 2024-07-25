import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { FormControl, InputLabel, Input, InputAdornment } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Button from '@mui/material/Button';
import '../App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, errors } = useUser();

  const onLogin = async () => {
    await handleLogin({ usu_user: username, usu_password: password });
  };

  return (
    <div className='gridCentrao bg_login'>

      <div className='grid-2col-unido'>
        <div className='logo'>
          <img src="/images/logo_6x.png" alt="Logo Vicaria"></img>
        </div>
        <div className='login'>
          <form onSubmit={handleLogin}>
            <FormControl variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">
                Usuario
              </InputLabel>
              <Input
                type="text"
                id="input_user"
                className='input_login'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">
                Contraseña
              </InputLabel>
              <Input
                type="password"
                id="input_password"
                className='input_login'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
            <br></br>
            <Button variant="contained" color="error" size="medium"
              onClick={onLogin}>
              Iniciar Sesión
            </Button>
            {errors.length > 0 && <div>{errors.join(', ')}</div>}
          </form>
        </div>

      </div>


    </div>
  );
}

export default Login;
