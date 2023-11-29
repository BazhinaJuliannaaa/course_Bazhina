import { useState } from 'react';   
import './Card.css';  





function Cards({cards,ShowCard}) { 


   return ( 
     <div className="card-list">         
        {cards.map((card) => (
          
          <div onClick={() => ShowCard(card)} key={card.id} to={`/card/${card.id}`}className="product-card" >
              <img src={card.PhotoProduct} className="product-image" />
              <div className="product-details">
                <h2 className="product-name">{card.ProductName}</h2>
                <p className="product-info">{card.ProductDescription}</p>
                <label className="product-inf"><b>Категория:</b> {card.CaregoryName}</label>
                <label class="product-label1"> <b>Стоимость:</b> {card.CostProduct} p.</label>
                <label class="product-label"><b>Количество товара на складе:</b> {card.QuantityProductInStock}</label>
                </div>
          </div>
        ))}
     </div> 
     );
 } 


 export default Cards;


