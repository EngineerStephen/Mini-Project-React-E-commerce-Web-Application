import React from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import NavigationBar from "./NavigationBar";


const ProductDetail = ({ product, onDelete }) => {

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Hey,only click OK if you are sure you want to delete this product!');
        if (!confirmDelete) return;

        try {
        const response = await axios.delete(`http://127.0.0.1:5000/products/${product.id}`);
        alert(response.data.message); 
        onDelete(product.id);
        } catch (error) {
        console.error('Oops! You got an error', error);
        alert('There was an error deleting the product.');
        }
    };

    return (
        <div>
        <h2>{product.name}</h2>
        <p>Price: ${product.price}</p>
        <p>Stock: {product.stock}</p>
        <Button variant="danger" onClick={handleDelete}>Delete Product</Button>
        </div>
    );
};

export default ProductDetail;
