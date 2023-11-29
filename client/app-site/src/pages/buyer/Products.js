import React from 'react';
import NavBuyer from './NavBuyer';
import OneCard from './OneCard';
import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AllCards.css'

function Products() {
  const [cards, setCards]=useState([])
  const [action, setAction] = useState(false)
  const [oneCard, setOneCard] = useState(false)
  const [show, setShow] = useState({})
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [SearchText,setSearchText]=useState('');
  const [SearchCategory,setSearchCategory]=useState('все товары');
  const [isSearch, setIsSearch] = useState(false)
  useEffect(() => {
    // Выполняем запрос к серверу при загрузке компонента
    axios.get('/allCards', { params: { category:SearchCategory, text:SearchText } })
      .then(response => {
        console.log(response.data);
        setCards(response.data)
        setIsSearch(false)
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });
  }, [action, isSearch]);
  useEffect(() => {
    axios.get('/Category')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });
    }, []);
  const inFavorites = async (id, inFavorite) => {   
    setAction(false);
        try {
          const response = await axios.post('/inFavorite', {id, inFavorite});
          if (response.status === 200) {
            console.log('товар добавлен')
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
  const handleSearchText = (e) => {
    const search  = e.target.value;
    setSearchText(search);
  };
  const handleSearchCategory = (e) => {
    const value  = e.target.value;
    setSearchCategory(value);
  };
  const handleSearch = (e) => {
    setIsSearch(true);
  };
  return (
    <div>
      <NavBuyer/>
      <div>
        {!oneCard && (
        <div> 
          <div className='search'>
            <select  
             value={SearchCategory}
             onChange={handleSearchCategory}
            >
              <option>все товары</option>
              {categories.map((categoryValue, index) => (
                  <option key={index} value={categoryValue}>
                    {categoryValue}
                  </option>
              ))}
            </select>
            <input
            type="text"
            name="search"
            value={SearchText}
            onChange={handleSearchText}
          />
          <button onClick={()=>handleSearch(SearchCategory,SearchText)}>поиск</button>
          </div>
        <div className="card-list">         
          {cards.map((card) => (
              <div key={card.id} className="product-card">
                <img  onClick={() => ShowOneCard(card)} src={card.PhotoProduct} className="product-image" />
                <div className="product-details">
                  <h2 className="product-name">{card.ProductName}</h2>
                  <p className="product-info">{card.ProductDescription}</p>
                  <label className="product-inf">Категория: {card.CaregoryName}</label>
                    <label class="product-label1">Стоимость: {card.CostProduct} p.</label>

                  <div className="product-quantity">
                      <button class="change" onClick={() => inShoppingCard(card.id,card.inShoppingCard)} > {card.inShoppingCard ? 'Товар в корзине' : 'Добавить в корзину' } </button>
                      <button class="change"onClick={() => inFavorites(card.id,card.inFavorite)} >{card.inFavorite ? 'удалить из избранного' : 'в избранное'} </button>
                    </div>
                </div>
              </div>
              
          ))}
        </div> 
      </div>
      )}
      {oneCard && (

        <OneCard card={show} handleBask={handleReturn} inFavorite={inFavorites} inShopping={inShoppingCard}/>

      )}
        </div>
    </div>
  );
}

export default Products;
