import React from 'react';
import NavSupplier from './NavSupplier';
import DatePicker from 'react-datepicker';
import './Profit.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Profit() {
  const [selectedDateBefore, setSelectedDateBefore] = useState(null);
  const [selectedDateAfter, setSelectedDateAfter] = useState(null);
  const [isCalculate, setIsCalculate] = useState(false);
  const [Allprofit, setProfit] = useState({});
  const [correctDate, setcorrectDate] = useState(true);

  const ButtonCalculate = () => {
    if (selectedDateAfter > selectedDateBefore ){
    setIsCalculate(!isCalculate);
    setcorrectDate(true);
    }else
    {
      setcorrectDate(false);
    }
    axios.get('/profit', { params: { start:selectedDateBefore, end: selectedDateAfter } })
      .then(response => {
        console.log(response.data);
        setProfit(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error);
      });

  };


  return (
    <div>
    <NavSupplier/>
    <div class="profit-card">
    <label>Выберите дату:</label>
    <div class="date-picker-container">
      <DatePicker
        selected={selectedDateBefore}
        onChange={date => setSelectedDateBefore(date)}
        dateFormat="dd.MM.yyyy"
        isClearable
        showYearDropdown
        scrollableYearDropdown
      />
      <label class="profit-card-date"> - </label>
      <DatePicker
        selected={selectedDateAfter}
        onChange={date => setSelectedDateAfter(date)}
        dateFormat="dd.MM.yyyy"
        isClearable
        showYearDropdown
        scrollableYearDropdown
      />
      </div>
      <button class="go-profit" type="submit" onClick={ButtonCalculate}>Рассчитать</button>
      {isCalculate && correctDate && (
        <div>
            <label>Продано за выбранный период: {Allprofit.all} </label><br></br>
            <label>Комиссия магазину за выбранный период: {Allprofit.commission} </label><br></br>
            <label>Выручка за выбранный период: {Allprofit.profit} </label>
          </div>
      )}
      {!correctDate && (
        <div class='incorrect-date'>
          <label >Выбран некорректный период</label>
        </div>
      )}
      </div>
 
    </div>
  );
}

export default Profit;
