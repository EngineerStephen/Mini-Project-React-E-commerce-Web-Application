import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            <h1>Track Your Order</h1>
            <p>{orderStatus.id}</p>
            <p> {orderStatus.orderDate}</p>
            <p> {orderStatus.status}</p>
            
            <ul>
                
                ))
                
            </ul>
        </div>
    );
};

export default TrackOrderStatus;
