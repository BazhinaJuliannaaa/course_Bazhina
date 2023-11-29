import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes,Route, Link } from 'react-router-dom';

import Login from './pages/Login'; 
import Registration from './pages/Registration';

import MyCards from './pages/supplier/MyCards';
import NewCard from './pages/supplier/NewCard';
import Profit from './pages/supplier/Profit';

import Favorites from './pages/buyer/Favorites';
import Orders from './pages/buyer/Orders';
import Products from './pages/buyer/Products';
import ShoppingCart from './pages/buyer/ShoppingCart';


import AcceptSupplier from './pages/admin/AcceptSupplier';
import ChangeOrders from './pages/admin/ChangeOrders';
import EditCategory from './pages/admin/EditCategory';
import AllSuppliers from './pages/admin/AllSuppliers';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/registration" element={<Registration/>}/>

            <Route path="/admin/editCategory" element={<EditCategory/>}/>
            <Route path="/admin/acceptSupplier" element={<AcceptSupplier/>}/>
            <Route path="/admin/changeOrders" element={<ChangeOrders/>}/>
            <Route path="/admin/allSuppliers" element={<AllSuppliers/>}/>

            <Route path="/buyer/favorites" element={<Favorites/>}/>
            <Route path="/buyer/orders" element={<Orders/>}/>
            <Route path="/buyer/products" element={<Products/>}/>
            <Route path="/buyer/shoppingCart" element={<ShoppingCart/>}/>

            <Route path="/supplier/myCards" element={<MyCards/>}/>
            <Route path="/supplier/newCard" element={<NewCard/>}/>
            <Route path="/supplier/profit" element={<Profit/>}/>

          </Routes>
        </Router>
 
      </header>
    </div>
  );
}

export default App;