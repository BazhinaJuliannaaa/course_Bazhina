import React from 'react';
import NavSupplier from './NavSupplier';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './MyCards.css';
import ProductCard from './Card';
import ProductDetails from './CardDetail';

function MyCards() {
  const [cards, setCards]=useState([])
  const [oneCard, setOneCard] = useState(false)
  const [show, setShow] = useState({})

  useEffect(() => {
    // Выполняем запрос к серверу при загрузке компонента
    axios.get('/mycards')
      .then(response => {
        console.log(response.data);
        setCards(response.data)
        
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });
  }, []);

  const handleShowCard = (showcard) => { 
    setShow(showcard);
    setOneCard(true);
  }
  
  useEffect(() => {
    console.log(show); // Этот console.log будет выводить обновленное значение show
  }, [show]);

  const handleReturn = () => {
    setOneCard(false);
  }

  return (
    <div>
      <NavSupplier />
      {!oneCard &&(
      <div>
            <ProductCard
            cards={cards} ShowCard={handleShowCard}/>
      </div>
      )}
      {oneCard &&(
        <ProductDetails product={show} handleBask={handleReturn}/>
      )}
    </div>
    
  );
  
}

export default MyCards;
