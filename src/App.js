// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://http://localhost:8000/Users/register', registerData);
      setMessage(response.data.message);
      setMessage('registro competado.');
    } catch (error) {
      setMessage('no es correcto.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/Users/token', loginData);
      setMessage(response.data.message);
      setMessage('iniciado sesion.');
    } catch (error) {
      setMessage('no es correcto.');
    }
  };

  return (
    <div>
      <h1>Veterinary App</h1>
      <div>
        <h2>Register</h2>
        <label>Username:
          <input type="text" value={registerData.username} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} />
        </label>
        <label>Email:
          <input type="email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
        </label>
        <label>Password:
          <input type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
        </label>
        <button onClick={handleRegister}>Register</button>
      </div>
      <div>
        <h2>Login</h2>
        <label>Username:
          <input type="text" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} />
        </label>
        <label>Password:
          <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
        </label>
        <button onClick={handleLogin}>Login</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default App;

