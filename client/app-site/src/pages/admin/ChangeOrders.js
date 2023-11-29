import React, { useState, useEffect } from 'react';
import './ChangeOrders.css';
import NavAdmin from './NavAdmin';
import axios from 'axios';

function ChangeOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [allDelivery, setAllDelivery] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [action, setAction] = useState(false);

  useEffect(() => {
    // Выполняем запрос к серверу при загрузке компонента
    axios.get('/AllOrders')
      .then(response => {
        console.log(response.data);
        setAllDelivery(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });
  }, [action]);

  const handleToggleMore = async (number,status) => {
    setOrderStatus(status);
    // Если выбран тот же заказ, что и до этого, скрываем подробную информацию
    if (selectedOrder === number) {
      setSelectedOrder(null);
      setAllProducts([]);
    } else {
      setAction(false);
      // Выполняем запрос к серверу для получения информации о продуктах выбранного заказа
      axios.get('/productsInAllOrders', { params: { number } })
        .then(response => {
          console.log(response.data);
          setSelectedOrder(number);
          setAllProducts(response.data);
          setAction(true);
        })
        .catch(error => {
          console.error('Ошибка при получении данных о продуктах: ', error);
        });
    }
  };

  const handlesetOrderStatus = (e) => {
    const value = e.target.value;
    setOrderStatus(value);
  }

  const handlePlaceStatusOrdere = async (number, status) => {
    setAction(false);
    axios.post('/placeStatusOrder', { number, status })
      .then(response => {
        console.log(response.data);
        // Обновляем локальный статус заказа
        setAction(true);
        setSelectedOrder(null);
      setAllProducts([]);
      })
      .catch(error => {
        console.error('Ошибка при обновлении статуса заказа: ', error);
      });
  };

  return (
    <div>
      <NavAdmin />
      <div className="all-orders">
        {allDelivery.map(delivery => (
          <div key={delivery.number}>
            <label className='order'>Заказ №{delivery.number}</label>
            <label className='order'>{delivery.loginBuyer}</label>
            <label className='order'>{delivery.adress}</label>
            <button className='button-new' onClick={() => handleToggleMore(delivery.number,delivery.status)}>Подробнее</button>

            {selectedOrder === delivery.number && (
              <div className="info-order">
                <label>Cодержимое заказа:</label>
                <ul>
                  {allProducts.map(product => (
                    <li key={product.ProductName}>
                      <ul>{product.ProductName} - Количество: {product.Quantity}</ul>
                      
                      <ul>Стоимость:  {product.Cost}</ul>
                    </li>
                  ))}
                </ul>
                <label>Cтатус заказа:</label>
                <div>
                  <select className="status" value={orderStatus} onChange={handlesetOrderStatus}>
                    <option value="1">Оформлен</option>
                    <option value="2">Передан в доставку</option>
                    <option value="3">Доставлен</option>
                  </select>
                  <button className='button-new' onClick={() => handlePlaceStatusOrdere(delivery.number,orderStatus)}>Применить</button>

                </div>
                
              </div>
            )}
            <hr className='hr-delivery'></hr>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChangeOrders;
