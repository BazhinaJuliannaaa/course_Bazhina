import React, { useState, useEffect } from 'react';
import './EditCategory.css';
import NavAdmin from './NavAdmin';
import axios from 'axios';

function EditCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryNameEmpty, setCategoryNameEmpty] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = () => {
    axios.get('/Category')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (categoryName !== '') {
      try {
        const response = await axios.post('/addCategory', { categoryName });
        if (response.status === 200) {
          setCategoryName('');
          setIsAddingCategory(false);
          setCategoryNameEmpty(false);
          fetchCategories(); // Обновляем список категорий после успешного добавления
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setCategoryNameEmpty(true);
    }
  };

  const handleToggleAddCategory = () => {
    setIsAddingCategory(!isAddingCategory);
    setCategoryNameEmpty(false);
  };

  return (
    <div>
      <NavAdmin />
      <div className="all-edit">
        <button className="button-new" onClick={handleToggleAddCategory}>
          Новая категория
        </button>
        {isAddingCategory && (
          <div className="new-category">
            <input
              className="input-category"
              type="text"
              placeholder="Название категории"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button className="insert-button" onClick={handleAddCategory}>
              Добавить
            </button>
          </div>
        )}
        {categoryNameEmpty && (
          <div>
            <label className="incorrect-date">Введите название категории</label>
          </div>
        )}
        <div className="all-categories">
          {categories.map((category, index) => (
            <div key={index}>
              <label className="category-name">{category}</label>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EditCategory;
