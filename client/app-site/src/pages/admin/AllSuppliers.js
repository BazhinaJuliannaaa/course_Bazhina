import React, { useState, useEffect } from 'react';
import './AcceptSupplier.css';
import NavAdmin from './NavAdmin';
import axios from 'axios';

function AllSuppliers() {
  const [supplierData, setSupplierData] = useState([]);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    // Выполняем запрос к серверу при загрузке компонента
    axios.get('/admin/allSupplier')
      .then(response => {
        setSupplierData(response.data);
        setAccepted(false)
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });
  }, []); // Зависимость изменится после успешного принятия

 



  return (
    <div>
      <NavAdmin />
        <div className="all-accept">
            <table>
                <tr>
                    <th><label className="accept-name">Логин</label></th>
                    <th><label className="accept-name">Имя</label></th>
                    <th><label className="accept-name">Разрешение на продажу</label></th>
                </tr>
                {supplierData.map(supplier => {
                    return (
                        <tr key={supplier.id}>
                            <td><label className="accept-name">{supplier.login}</label></td>
                            <td><label className="accept-name">{supplier.name}</label></td>
                            <td><label className="accept-name">{(supplier.PermissionToTrade==1) ? 'Есть': (supplier.PermissionToTrade==-1) ? 'Отклонен':'ожидает подтверждения'}</label></td>
                        </tr>
                    )
                })}
            </table>
        </div>
    </div>
  );
}

export default AllSuppliers;
