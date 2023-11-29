import React from 'react';
import './ShoppingCart.css';
import NavBuyer from './NavBuyer';
import { useState , useEffect} from 'react';
import axios from 'axios';


function ShoppingCart() {

  const [cartItems, setCartItems] = useState([]);
  const [action, setAction] = useState(false);
  const [adressAndCost, setAdressAndCost] = useState([]);
  const [isChange, setIsChange] = useState(false)
  const [newAdress, setNewAdress] = useState('')


  useEffect(() => {
    // Выполняем запрос к серверу при загрузке компонента
    axios.get('/shoppingCart')
      .then(response => {
        console.log(response.data);
        setCartItems(response.data)
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });

      axios.get('/adressAndCost')
      .then(response => {
        console.log(response.data);
        setAdressAndCost(response.data)
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });

  }, [action]);


  const removeFromCart = async (id) => {   
    setAction(false);
        try {
          const response = await axios.post('/removeFromCart', {id});
          if (response.status === 200) {
            console.log('товар удален из корзины')
            setAction(true);
          }
        } catch (error) {
          console.error(error);
        }
  }

  const changeCost = async (op, QuantityInOrder,id ) => {
    setAction(false);
        try {
          const response = await axios.post('/changeCost', {op,QuantityInOrder,id});
          if (response.status === 200) {
            console.log('количество изменено')
            setAction(true);
          }
        } catch (error) {
          console.error(error);
        }
  }

  const changeAdress = async () => {
    if (!isChange){
      setIsChange(true)
    }
    else{
      try {
        setAction(false);
        const response = await axios.post('/changeAdress', {newAdress});
        if (response.status === 200) {
          setIsChange(false);
          setAction(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleChange = (e) => {
    const adr = e.target.value
    setNewAdress(adr);
  };

  const placeOrder = async () => {
    setAction(false);
    const response = await axios.post('/placeOrder');
        if (response.status === 200) {;
          setAction(true);
        }
  }

  return (
    <div>
      <NavBuyer />
      <div className="shopping-cart">
        <h2>Корзина товаров</h2>
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.PhotoProduct} alt={item.ProductName} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.ProductName}</h3>
                <p>Цена: {item.CostInOrder} руб.</p>
                { item.in_stock == 'yes' && (
                <div className='count'>
                  <button className='num' onClick={() => changeCost('dec',item.QuantityInOrder, item.id )} disabled={item.QuantityInOrder<=1}>-</button>
                  <label>{item.QuantityInOrder}</label>
                  <button className='num' onClick={() => changeCost('inc',item.QuantityInOrder, item.id )} disabled={item.QuantityInOrder>item.AllQuantity}>+</button>
                </div>
                ) }
                { item.in_stock == 'no' && (
                  <div>нет в наличии</div>
                )}
                <button className='btn-delete' onClick={() => removeFromCart(item.id)}>Удалить из корзины</button>
              </div>
            </div>
          ))}
        </div>
        <div className="total-price">
          <h3>Общая стоимость: {adressAndCost.Cost} руб.</h3>
          <label>Aдрес доставки:   </label>
          <label>{adressAndCost.Adress}</label>
          <button class='change-adr' onClick={changeAdress}>{isChange ? 'Сохранить' : 'Изменить'}</button>
          <br></br>
          {isChange &&(
          <input className='adr'
          type="text"
          name="adr"
          value={newAdress}
          onChange={handleChange}
          />
          
          )}
          <br></br>
          <button className='btn-reg' onClick={placeOrder}>Оформить заказ</button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;