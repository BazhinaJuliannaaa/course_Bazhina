import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './NavSupplier.css';
import axios from 'axios';

function NavSupplier() {

  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await axios.post('/logout');
      if (response.status === 200) {
        // Обработка успешного выхода
        console.log('Выход выполнен успешно');
        navigate('/login')
      }
    } catch (error) {
      // Обработка ошибок
      console.error('Ошибка при выходе:', error);
    }
  };

  return (
    <div class="navbar">
      <div class="navbar-type">
        <h1>Supplier</h1>
      </div>
        <div class="navbar-links">
          <Link to="/supplier/myCards">Мои карточки</Link>

          <Link to="/supplier/newCard" >Добавить карточку</Link>
          <Link to="/supplier/profit">Выручка</Link>
        </div>
        <div class="navbar-logout">
          <button onClick={logout}>выйти</button>
        </div>
    </div>
  );
}

export default NavSupplier;