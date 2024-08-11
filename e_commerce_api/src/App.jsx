import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { Form, Button, Alert, Container, Modal } from "react-bootstrap"; 
import Customer from './Customer';
import CustomerWrapper from './CustomerWrapper';
import UpdateCustomer from './UpdateCustomer';
import ProductList from './ProductList';
import UpdateProduct from './UpdateProduct';
import ProductDetails from './ProductDetails';
import PlaceOrder from './PlaceOrder';
import TrackOrder from './TrackOrder';
import Home from './Home';
import NotFound from './NotFound';
import './App.css';
import './customer.css';



function App() {
  return (
    <div className='app-container'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/customer' element={<Customer />} />
        <Route path="/customer/:id" element={<CustomerWrapper />} />
        <Route path='/update-customer' element={<UpdateCustomer />} />
        <Route path='/products' element={<ProductList />} />
        <Route path='/update-product' element={<UpdateProduct />} />
        <Route path='/product-details' element={<ProductDetails />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/track-order' element={<TrackOrder />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

export default App;