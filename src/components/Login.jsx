import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { FormControl, InputLabel, Input, InputAdornment } from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, errors } = useUser();

  const onLogin = async () => {
    await handleLogin({ usu_user: username, usu_password: password });
  };

  return (

    <div>

      <div className='gridCentrao'>
        <form onSubmit={handleLogin}>
          <FormControl variant="standard">
            <InputLabel htmlFor="input-with-icon-adornment">
              Usuario
            </InputLabel>
            <Input
              type="text"
              id="input-with-icon-adornment"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon />
                </InputAdornment>
              }
            />
          </FormControl>
          <br></br>
          <FormControl variant="standard">
            <InputLabel htmlFor="input-with-icon-adornment">
              Contraseña
            </InputLabel>
            <Input
              type="password"
              id="input-with-icon-adornment"
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
          <button onClick={onLogin}>Login</button>
          {errors.length > 0 && <div>{errors.join(', ')}</div>}
        </form>
      </div>


    </div>
  );
}

export default Login;
