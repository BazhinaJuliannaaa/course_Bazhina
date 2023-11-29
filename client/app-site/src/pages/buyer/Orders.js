import React from 'react';
import NavBuyer from './NavBuyer';
import OneCard from './OneCard';
import { useState,useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Orders() {

  const [oneCard, setOneCard] = useState(false);
  const [show, setShow] = useState({});
  const [orders, setOrders] = useState([]);
  const [action, setAction] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    // Выполняем запрос к серверу при загрузке компонента
    axios.get('/MyOrders')
      .then(response => {
        console.log(response.data);
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });

      
  }, []);

  const handleReturn = () => {
    setOneCard(false);
  }

  const ShowOneCard = async (id) => { 
    axios.get('/ShowOrder', { params: { id } })
      .then(response => {
        console.log(response.data);
        setShow(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });
    setOneCard(true);
  }

  const inFavorites = async (id, inFavorite) => {   
    setAction(false);
        try {
          const response = await axios.post('/inFavorite', {id, inFavorite});
          if (response.status === 200) {
            console.log('товар добавлен')
            setAction(false);
          }
        } catch (error) {
          console.error(error);
        }
  }

  const inShoppingCard = async (id, inShopping) => {
    if (inShopping){
      navigate('/buyer/shoppingCart')
    }else{
      setAction(false);
          try {
            const response = await axios.post('/inShoppingCard', {id});
            if (response.status === 200) {
              console.log('товар добавлен в корзину')
              setAction(true);
            }
          } catch (error) {
            console.error(error);
          }
      }
  }

  return (
    <div>
    <NavBuyer />
    {!oneCard && (
      <div>
        {orders.map(order => (
          <div key={order.numberOrder} className="shopping-cart">
            <h2>Заказ № {order.numberOrder}</h2>
            <h3>Статус заказа: {order.orderStatus==1?'оформлен':order.orderStatus==2 ? 'передан в доставку' : 'доставлен'}</h3>
            <h3>Дата заказа {order.dateOrder}</h3>
            <div className="cart-items">
              {order.products.map(product => (
                <div key={product.Name} className="cart-item">
                  <img src={product.image} alt={product.Name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{product.Name}</h3>
                    <p>Количество товара: {product.Quantity} шт.</p>
                    <p>Цена за все единицы товара: {product.Cost} руб.</p>
                  
                    <button className='btn-delete' onClick={() => ShowOneCard(product.id)}>Карточка товара</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
    {oneCard && (
      <OneCard card={show} handleBask={handleReturn}/>
    )}
  </div>
);
}

export default Orders;
