import React, { useState } from 'react';
import NavigationBar from './NavigationBar';

const PlaceOrder = ({ customerId, onOrderSubmit }) => {
    const [orderDate, setOrderDate] = useState('');
    const [products, setProducts] = useState([{ productName: '', quantity: 1 }]);
    const [customerName, setCustomerName] = useState('');

    const handleProductChange = (order, event) => {
        const updatedProducts = [...products];
        updatedOrder[order][event.target.name] = event.target.value;handleAddOrder
        setProducts(updatedProducts);
    };

    const handleAddOrder = () => {
        setProducts([...products, { productName: '', quantity: 1 }]);
    };

    const handleRemoveProduct = (order) => {
        const updatedProducts = [...products];
        updatedProducts.splice(order, 1);
        setProducts(updatedProducts);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newOrder = { customerId, customerName, orderDate, products };
        onOrderSubmit(newOrder);
    };

    return (
    
        <div className="OrderForm">
            <NavigationBar />
            <h3>Place New Order</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Customer Name:</label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Order Date:</label>
                    <input
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Products:</label>
                    {products.map((product, order) => (
                        <div key={order} style={{ marginBottom: '10px' }}>
                            <input
                                type="text"
                                name="productName"
                                placeholder="Product Name"
                                value={product.productName}
                                onChange={(event) => handleProductChange(order, event)}
                                required
                            />
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={product.quantity}
                                onChange={(event) => handleProductChange(order, event)}
                                min="1"
                                required
                            />
                            <button type="button" onClick={() => handleRemoveProduct(order)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddOrder}>
                        Add Product
                    </button>
                </div>

                <button type="submit">Place Order</button>
            </form>
        </div>
    );
};

export default PlaceOrder;
