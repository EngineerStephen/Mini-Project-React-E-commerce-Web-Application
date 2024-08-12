import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Products from './components/Products/Products';
import Orders from './components/Orders/Orders';
import CustomerManagement from './components/customers/Customers';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<CustomerManagement />} />

            </Routes>
        </Router>
    );
}

export default App;