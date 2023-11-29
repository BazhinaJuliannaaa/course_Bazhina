import React from 'react';
import NavBuyer from './NavBuyer';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OneCard from './OneCard';

function Favorites() {
  const [cards, setCards]=useState([])
  const [action, setAction] = useState(false)
  const [oneCard, setOneCard] = useState(false)
  const [show, setShow] = useState({})
  const navigate = useNavigate();

  
  useEffect(() => {
     // Выполняем запрос к серверу при загрузке компонента
     axios.get('/FavoriteCards')
       .then(response => {
         console.log(response.data);
         setCards(response.data)
         
       })
       .catch(error => {
         console.error('Ошибка при получении данных: ', error);
       });
   }, [action]);
 
  const inFavorites = async (id, inFavorite) => {   
    setAction(false);
    try {
      const response = await axios.post('/inFavorite', {id, inFavorite});
      if (response.status === 200) {
        setAction(true);
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


  const ShowOneCard = (showcard) => { 
    setShow(showcard);
    setOneCard(true);
    setAction(false);
  }
  const handleReturn = () => {
    setOneCard(false);
    setAction(true);
  }
   return (
     <div>
     <NavBuyer/>
     <div>
     {!oneCard && (
     <div className="card-list">         
         {cards.map((card) => (
             <div key={card.id} className="product-card">
               <img src={card.PhotoProduct} onClick={() => ShowOneCard(card)} className="product-image" />
               <div className="product-details">
                 <h2 className="product-name">{card.ProductName}</h2>
                 <p className="product-info">{card.ProductDescription}</p>
                 <div className="product-inf">Категория: {card.CaregoryName}</div>
                   <label class="product-label1">Стоимость: {card.CostProduct} p.</label>
 
                 <div className="product-quantity">
                     <button class="change" onClick={() => inShoppingCard(card.id,card.inShoppingCard)} > {card.inShoppingCard ? 'Товар в корзине' : 'Добавить в корзину' }  </button>
                     <button class="change"onClick={() => inFavorites(card.id,card.inFavorite)} >удалить из избранного </button>
                   </div>
               </div>
             </div>
         ))}
      </div> 
            )}
            {oneCard && (
        <OneCard card={show} handleBask={handleReturn} inFavorite={inFavorites} inShopping={inShoppingCard}/>
      )}
       </div>
     </div>
   );
 }
 

export default Favorites;
