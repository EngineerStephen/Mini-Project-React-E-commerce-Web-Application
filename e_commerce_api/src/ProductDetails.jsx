import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductDetails = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/products/${productId}`)
        .then(response => {
            setProduct(response.data);
            setLoading(false);
        })
        .catch(error => {
            setError('Error fetching product details.');
            setLoading(false);
        });
    }, [productId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>No product found.</div>;
    }

    return (
        <div className="product-details">
        <h2>{product.name}</h2>
        <p>Price: ${product.price.toFixed(2)}</p>
        <p>Stock: {product.stock}</p>
        </div>
    );
};

export default ProductDetails;
