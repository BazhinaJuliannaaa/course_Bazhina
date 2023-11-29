import React, { useState, useEffect } from 'react';
import './NewCard.css';
import NavSupplier from './NavSupplier';
import axios from 'axios';

function AddProductForm() {
  const [product, setProduct] = useState({
    name: '',
    image: '',
    category: '',
    description: '',
    price: 0,
    quantity: 0,
  });

  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [permission, setPermission] = useState(true);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('image', product.image);
    formData.append('category', product.category);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('quantity', product.quantity);

    axios.post('/add_product', formData)
      .then(response => {
        setSuccessMessage('Товар успешно добавлен.');
        setProduct({
          name: '',
          image: '',
          category: '',
          description: '',
          price: 0,
          quantity: 0,
        });
      })
      .catch(error => {
        console.error('Ошибка при добавлении товара: ', error);
        setErrorMessage('Произошла ошибка при добавлении товара.');
      });
  };

  useEffect(() => {
    axios.get('/Category')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });

    axios.get('/permission')
      .then(response => {
        setPermission(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });
  
  }, []);

  return (
    <div>     
      <NavSupplier/>
      {permission && (
      <form className="new-card" onSubmit={handleSubmit}>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div>
          <label className="label-new-card">Название товара:</label>
          <input className="input-new-card"
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label-new-card">Фотография товара:</label>
          <input className="input-new-card"
            type="file"
            name="image"
            onChange={(e) => setProduct({ ...product, image: e.target.files[0] })}
          />
        </div>
        <div>
          <label className="label-new-card">Выберите категорию:</label>
          <select
            className="input-new-card"
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="">-</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-new-card">Описание товара:</label>
          <textarea className="text-new-card"
            name="description"
            value={product.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label-new-card">Стоимость:</label>
          <input className="input-cost-quantity"
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label-new-card">Количество товара:</label>
          <input className="input-cost-quantity"
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
          />
        </div>
        <div className='btn-add'>
          <button className="add-new-card" type="submit">Добавить</button>
        </div>
      </form>
      )}
      {!permission && (
        <div class ='no'>
        <label >Вы не можете добавлять свои товары, обратитесь к администратору</label>
        </div>
      )}
    </div>
  );
}

export default AddProductForm;
