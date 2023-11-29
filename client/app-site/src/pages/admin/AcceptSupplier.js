import React, { useState, useEffect } from 'react';
import './AcceptSupplier.css';
import NavAdmin from './NavAdmin';
import axios from 'axios';

function AcceptSupplier() {
  const [supplierData, setSupplierData] = useState([]);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    // Выполняем запрос к серверу при загрузке компонента
    axios.get('/admin/acceptSupplier')
      .then(response => {
        setSupplierData(response.data);
        setAccepted(false)
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });
  }, [accepted]); // Зависимость изменится после успешного принятия

  const hadleAccept = async (login) => {
    try {
      const response = await axios.post('/supplier/accept', { login });
      if (response.status === 200) {
        // После успешного принятия устанавливаем флаг accepted в true
        setAccepted(true);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const hadleDeny = async (login) => {
    try {
      const response = await axios.post('/supplier/deny', { login });
      if (response.status === 200) {
        // После успешного принятия устанавливаем флаг accepted в true
        setAccepted(true);
      }
    } catch (error) {
      console.error(error);
    }
  }




  return (
    <div>
      <NavAdmin />
      <div className="all-accept">
        <table>
          <tr>
            <th><label className="accept-name">Логин</label></th>
            <th><label className="accept-name">Имя</label></th>
          </tr>
        {Array.isArray(supplierData) && supplierData.map(supplier => {
           return (
          <tr key={supplier.id}>
            <td><label className="accept-name">{supplier.login}</label></td>
            <td><label className="accept-name">{supplier.name}</label></td>
            <td><button className="accept-yes" onClick={() => hadleAccept(supplier.login)}>Принять</button></td>
            <td><button className="accept-no" onClick={() => hadleDeny(supplier.login)}>Отклонить</button></td>
          </tr>
        
      )})}
        </table>
      </div>
    </div>
  );
}

export default AcceptSupplier;
