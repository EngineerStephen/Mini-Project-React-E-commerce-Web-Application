import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
        const [products, setProducts] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [errorMessage, setErrorMessage] = useState('');

        const loadProducts = async () => {
            try {
            const { data } = await axios.get('http://127.0.0.1:5000/products');
            setProducts(data);
            setIsLoading(false);
            } catch (err) {
            console.error('Oops! You have and error:', err);
            setErrorMessage('Looks like something went wrong. Please try again.');
            setIsLoading(false);
            }
        };

        useEffect(() => {
            loadProducts();
        }, []);

        const handleDelete = async (id) => {
            if (!window.confirm('Do you really want to delete this product?')) return;

            try {
            await axios.delete(`http://127.0.0.1:5000/products/${id}`);
            loadProducts()
            } catch (err) {
            console.error('Error deleting product:', err);
            }
        };

        if (isLoading) return <p>Loading products...</p>;
        if (errorMessage) return <p>{errorMessage}</p>;

        return (
            <Container className="col-8 pt-5">
            <h3>Product List</h3>
            <ListGroup>
                {products.map(({ product_id, name, price }) => (
                <ListGroup.Item key={product_id} className="d-flex justify-content-between align-items-center">
                    <div>
                    <strong>{name}</strong> - ${price}
                    </div>
                    <div>
                    <Button
                        variant="outline-primary"
                        className="me-2"
                        as={Link}
                        to={`/product-edit/${product_id}`}
                    >
                        Edit
                    </Button>
                    <Button variant="outline-danger" onClick={() => handleDelete(product_id)}>
                        Delete
                    </Button>
                    </div>
                </ListGroup.Item>
                ))}
            </ListGroup>
            </Container>
        );
};

export default ProductList;
