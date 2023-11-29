import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Registration.css';
import axios from 'axios';


function Registration() {
  const [login, setLogin] = useState('');
  const [firstname, setFirstname] = useState('');
  const [password, setPassword] = useState('');
  // Состояние для выбора типа пользователя
  const [userType, setUserType] = useState('buyer');

  // Функция для перенаправления на другую страницу
  const navigate = useNavigate();

  // Обработчик изменения типа пользователя
  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  // Обработчик отправки формы
  const handleRegistration = async () => {
    console.log('login:', login);
    console.log('firstname:', firstname);
    console.log('Password:', password);
    // Ваш код обработки регистрации здесь

    try {
      const response = await axios.post('/registration', { login, firstname,password , userType});
      const token = response.data.token;
      localStorage.setItem('token', token);
      console.log('User registration in successfully');
      console.log(token);
    } catch (error) {
      console.error('Error during registration:', error);
      //setLoginError(true);
    }
  
    navigate('/login');
    
  };

  return (
    <div>
      
      <form className="registration-form">
      <h2 className="registration-title">Регистрация</h2>
        <select value={userType} onChange={handleUserTypeChange}>
          <option value="buyer">Покупатель</option>
          <option value="supplier">Поставщик</option>
        </select>
        <label className="registration-label" htmlFor="email">
            Логин:
          </label>
          <input className="registration-input" type="email" id="email" name="email"
           onChange={(e) => setLogin(e.target.value)}/>

          <label className="registration-label" htmlFor="email">
            Имя:
          </label>
          <input className="registration-input" type="firstname" id="firstname" name="firstname"
           onChange={(e) => setFirstname(e.target.value)} />

          <label className="registration-label" htmlFor="password">
            Пароль:
          </label>
          <input className="registration-input" type="password" id="password" name="password" 
          onChange={(e) => setPassword(e.target.value)}/>

        <button className="registration-button" onClick={handleRegistration}>
          Зарегистрироваться
        </button>
      
      <p className="login-link">
        <Link to="/" className="login-link">
          Войти
        </Link>
      </p>
      </form>
    </div>
  );
}
export default Registration;