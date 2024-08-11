import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            <h1>Order Details</h1>
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

export default RetrieveOrder;