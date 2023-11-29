import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavAdmin.css';
import axios from 'axios';

function NavAdmin() {
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
        <h1>Admin</h1>
      </div>
        <div class="navbar-links">
          <Link to="/admin/editCategory">Управление категориями</Link>

          <Link to="/admin/changeOrders" >Управление доставкой</Link>
          <Link to="/admin/acceptSupplier">Принять поставщика</Link>
          <Link to="/admin/allSuppliers">Все поставщики</Link>
        </div>
        <div class="navbar-logout">
          <button onClick={logout}>выйти</button>
        </div>
    </div>
  );
}

export default NavAdmin;