import React, { useState } from 'react';
import { useUser } from '../UserContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, errors } = useUser();

  const onLogin = async () => {
    await handleLogin({ usu_user: username, usu_password: password });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={onLogin}>Login</button>
      {errors.length > 0 && <div>{errors.join(', ')}</div>}
    </div>
  );
}

export default Login;
