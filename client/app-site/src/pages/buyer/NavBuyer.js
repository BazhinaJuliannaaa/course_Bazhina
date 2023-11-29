import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './NavBuyer.css';
import axios from 'axios';

function NavBuyer() {

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
        <h1>Buyer</h1>
      </div>
        <div class="navbar-links">
          <Link to="/buyer/products">Все товары</Link>
          <Link to="/buyer/favorites" >Избранное</Link>
          <Link to="/buyer/orders">Мои заказы</Link>
          <Link to="/buyer/shoppingCart">Корзина</Link>
        </div>
        <div class="navbar-logout">
          <button onClick={logout}>выйти</button>
        </div>
    </div>
  );
}

export default NavBuyer;