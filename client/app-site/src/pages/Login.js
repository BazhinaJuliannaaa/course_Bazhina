import React from 'react';
import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Login() {
  const [login, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('login:', login);
    console.log('Password:', password);
  
    try {
      const response = await axios.post('/login', { login, password });
      const user_type = response.data.user_type;  
      console.log(user_type)    
      console.log('User logged in successfully');
      if (user_type === 'supplier')
      {
        navigate('/supplier/newCard')
      }
      else if (user_type === 'buyer')
      {
        navigate('/buyer/products')
      }
      else if (user_type === 'administrator')
      {
        navigate('/admin/acceptSupplier')
      } 

    } catch (error) {
      console.error('Error during login:', error);
      setLoginError(true);
    }
  };    

  return (
    <body>
      <div className="login-container">
        <h2>Вход</h2>
        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Войти</button>
        <Link to="/registration"className="registration-link">Зарегистрируйтесь</Link>
      </div>
    </body>
  );
}

export default Login;
