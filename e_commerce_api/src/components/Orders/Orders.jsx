import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavigationBar from '../../NavigationBar';

const PlaceOrder = ({ customerId, onOrderSubmit }) => {
    const [orderDate, setOrderDate] = useState('');
    const [products, setProducts] = useState([{ productName: '', quantity: 1 }]);
    const [customerName, setCustomerName] = useState('');

    const handleProductChange = (index, event) => {
        const updatedProducts = [...products];
        updatedProducts[index][event.target.name] = event.target.value;
        setProducts(updatedProducts);
    };

    const handleAddProduct = () => {
        setProducts([...products, { productName: '', quantity: 1 }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newOrder = { customerId, customerName, orderDate, products };
        onOrderSubmit(newOrder);
    };

    return (
        <div>
            <NavigationBar />
            <div className="OrderForm">
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
                        {products.map((product, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    name="productName"
                                    placeholder="Product Name"
                                    value={product.productName}
                                    onChange={(event) => handleProductChange(index, event)}
                                    required
                                />
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="Quantity"
                                    value={product.quantity}
                                    onChange={(event) => handleProductChange(index, event)}
                                    min="1"
                                    required
                                />
                                <button type="button" onClick={() => handleRemoveProduct(index)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddProduct}>
                            Add Product
                        </button>
                    </div>

                    <button type="submit">Place Order</button>
                </form>
            </div>
        </div>
    );
};

const RetrieveOrder = ({ orderId }) => {
    const [fetchedOrderDetails, setFetchedOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/orders/${orderId}`);
                setFetchedOrderDetails(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h3>Order Details</h3>
            <p>Order ID: {fetchedOrderDetails.id}</p>
            <p>Date: {fetchedOrderDetails.date}</p>
            <p>Customer Name: {fetchedOrderDetails.customerName}</p>
            <ul>
                {fetchedOrderDetails.products.map((product, index) => (
                    <li key={index}>
                        {product.productName} - Quantity: {product.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const TrackOrderStatus = ({ orderId }) => {
    const [orderStatus, setOrderStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (orderId) {
            const fetchOrderStatus = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:5000/orders/${orderId}`);
                    setOrderStatus(response.data);
                } catch (err) {
                    setError('Failed to retrieve order status.');
                } finally {
                    setLoading(false);
                }
            };

            fetchOrderStatus();
        }
    }, [orderId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!orderStatus) {
        return <div>No order found with ID: {orderId}</div>;
    }

    return (
        <div className="orderTracking">
            <h3>Track Your Order</h3>
            <p>Order ID: {orderStatus.id}</p>
            <p>Order Date: {orderStatus.orderDate}</p>
            <p>Status: {orderStatus.status}</p>
        </div>
    );
};

const OrderManagement = () => {
    const [currentView, setCurrentView] = useState('placeOrder');
    const [orderId, setOrderId] = useState('');
    const [submittedOrder, setSubmittedOrder] = useState(null);

    const handleViewChange = (view) => {
        setCurrentView(view);
        setSubmittedOrder(null);
    };

    const handleOrderSubmit = (order) => {
        setSubmittedOrder(order);
        setCurrentView('retrieveOrder');
    };

    return (
        <div>
            <NavigationBar />
            <h1>Order Management</h1>
            <div>
                <button onClick={() => handleViewChange('placeOrder')}>Place Order</button>
                <button onClick={() => handleViewChange('retrieveOrder')}>Retrieve Order</button>
                <button onClick={() => handleViewChange('trackOrderStatus')}>Track Order Status</button>
            </div>

            {currentView === 'placeOrder' && (
                <PlaceOrder customerId={1} onOrderSubmit={handleOrderSubmit} />
            )}

            {currentView === 'retrieveOrder' && (
                <div>
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                        <div>
                            <label>Order ID:</label>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                required
                            />
                            <button onClick={() => setCurrentView('retrieveOrder')}>
                                Retrieve Order
                            </button>
                        </div>
                    </form>
                    {submittedOrder && <RetrieveOrder orderId={submittedOrder.id} />}
                </div>
            )}

            {currentView === 'trackOrderStatus' && (
                <div>
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                        <div>
                            <label>Order ID:</label>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                required
                            />
                            <button onClick={() => setCurrentView('trackOrderStatus')}>
                                Track Order Status
                            </button>
                        </div>
                    </form>
                    {orderId && <TrackOrderStatus orderId={orderId} />}
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
