import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CardDetail.css';

function ProductDetails({product,handleBask}) {
  const [changeCost, setChangeCost] = useState(false)
  const [changeQuantity, setChangeQuantity] = useState(false)
  const [newCost, setNewCost] = useState(product.CostProduct)
  const [newQuantity, setNewQuantity] = useState(product.QuantityProductInStock)
  const [rewiews, setRewiews] = useState([]);

  const [Oneproduct, setProduct] = useState({
    id: product.id, 
    name: product.ProductName,
    image:product.PhotoProduct,
    category: product.CaregoryName,
    description: product.ProductDescription,
    price: product.CostProduct,
    quantity: product.QuantityProductInStock,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...Oneproduct, [name]: value });
  };

  useEffect(() => {
    axios.get('/rewiews', { params: { id: product.id } })
      .then(response => {
        console.log(response.data);
        setRewiews(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });

  }, [Oneproduct]);


  const Change = async () => {
    if (!changeCost){
      setChangeCost(true)
    }
    else{
 
      try {
        const response = await axios.post('/supplier/changeCost', [Oneproduct.id, Oneproduct.price]);
        if (response.status === 200) {
          setNewCost(Oneproduct.price);
          setChangeCost(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const ChangeQuantity = async () => {
    if (!changeQuantity){
      setChangeQuantity(true)
    }
    else{
 
      try {
        const response = await axios.post('/supplier/changeQuantity', [Oneproduct.id, Oneproduct.quantity]);
        if (response.status === 200) {
          setNewQuantity(Number(Oneproduct.quantity)+Number(newQuantity));
          setChangeQuantity(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }




  return (
               
    <div className="product-details-card" >
      <button class='change' onClick={() => handleBask()}>Назад</button>
      <div className="product-details-1">
        <img src={Oneproduct.image} className="product-details-image" />
        <div className="product-details-2" >
          <h2 className="product-details-name">{Oneproduct.name}</h2>
          <p className="product-details-info">{Oneproduct.description}</p>
          <label className="produc-detailst-info"><b>Категория:</b> {Oneproduct.category}</label>
          <div>
            <label class="product-details-label1"> <b>Стоимость:</b> {newCost} p.</label>
            <button class='change' onClick={Change} >{changeCost ? 'Применить' : 'Изменить стоимость товара'}</button>
            {changeCost && (
              <div>
              <label className="label-new-card">Новая стоимость:</label>
              <input className="input-cost-quantity"
                  type="number"
                  name="price"
                  value={Oneproduct.price}
                  onChange={handleChange}
              />
              </div>
            )}
          </div>
          <div>
            <label class="product-details-label"><b>Количество товара на складе:</b> {newQuantity}</label>
            <button class='change' onClick={ChangeQuantity}>{changeQuantity ? 'Применить' : 'Изменить количество товара'}</button>
            {changeQuantity && (
              <div>
              <label className="label-new-card">Введите объем поставки:</label>
              <input className="input-cost-quantity"
                  type="number"
                  name="quantity"
                  value={Oneproduct.quantity}
                  onChange={handleChange}
              />
              </div>
            )}
          </div>
        </div>
      </div>

      <h1>Отзывы</h1>
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

export default ProductDetails;
