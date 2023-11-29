import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OneCard.css';

function OneCard({ card, handleBask }) {
  const [action, setAction] = useState(card.inFavorite);
  const [shopping, setShopping] = useState(card.inShoppingCard);
  const [rewiews, setRewiews] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isFeedback, setIsFeedback] = useState({});
  const [onClickChange, setOnClickChange] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setAction(card.inFavorite);
    setShopping(card.inShoppingCard);

    axios.get('/rewiews', { params: { id: card.id } })
      .then(response => {
        console.log(response.data);
        setRewiews(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });

    axios.get('/isRewiews', { params: { id: card.id } })
      .then(response => {
        console.log(response.data);
        setIsFeedback(response.data);
        setFeedback(isFeedback.thereFeedback);
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });

  }, [card]);

  useEffect(() => {
    setFeedback(isFeedback.thereFeedback);
  }, [isFeedback.thereFeedback]);

  const inShoppingCard = async (id, inShopping) => {
    if (inShopping) {
      navigate('/buyer/shoppingCart');
    } else {
      try {
        const response = await axios.post('/inShoppingCard', { id });
        if (response.status === 200) {
          console.log('товар добавлен в корзину');
          setShopping(!shopping);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const inFavorites = async (id, inFavorite) => {
    try {
      const response = await axios.post('/inFavorite', { id, inFavorite });
      if (response.status === 200) {
        console.log('товар добавлен');
        setAction(!action);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const r = e.target.value;
    setFeedback(r);
    
  };

  const handleButtonClick =async () => {
    // Обработка клика на кнопку сохранения или изменения отзыва
    setOnClickChange(!onClickChange);
    if (onClickChange){
      try {
        const response = await axios.post('/newRewiew', { id: card.id, feedback: feedback});
        if (response.status === 200) {
          console.log('Отзыв сохранен');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="product-details-card">
      <button className='change' onClick={() => handleBask()}>Назад</button>
      <div className="product-details-1">
        <img src={card.PhotoProduct} className="product-details-image" />
        <div className="product-details-2">
          <h2 className="product-details-name">{card.ProductName}</h2>
          <p className="product-details-info">{card.ProductDescription}</p>
          <label className="produc-detailst-inf"><b>Категория:</b> {card.CaregoryName}</label>
          <div>
            <label className="product-details-label1"> <b>Стоимость:</b> {card.CostProduct} p.</label>
          </div>
        </div>
      </div>
      <button className='change' onClick={() => inShoppingCard(card.id, card.inShoppingCard)}>
        {shopping ? 'Товар в корзине' : 'Добавить в корзину'}
      </button>
      <button className="change" onClick={() => inFavorites(card.id, card.inFavorite)}>
        {action ? 'Удалить из избранного' : 'В избранное'}
      </button>

      <h1>Отзывы</h1>
      {isFeedback.can && (
        <div>
          <button className="change" onClick={handleButtonClick}>
            {onClickChange ? 'сохранить' : isFeedback.thereFeedback !== ' ' ? 'изменить свой отзыв' : 'написать отзыв'}
          </button>
          {onClickChange && (
          <input
            className='adr'
            type="text"
            name="feedback"
            value={feedback}
            onChange={handleChange}
          />
          )}
        </div>
      )}

      {rewiews.map(rewiew => (
        <div className="shopping-cart"key={rewiew.date}>
          <p>Имя пользователя: {rewiew.BuyerLogin}</p>
          <p>Дата: {rewiew.date}</p>
          <p>{rewiew.ContentFeedback}</p>
          <hr></hr>
        </div>
      ))}
    </div>
  );
}

export default OneCard;
