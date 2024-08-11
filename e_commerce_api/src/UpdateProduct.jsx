import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Container } from 'react-bootstrap';

const UpdateProductForm = ({ product, onUpdate }) => {
    const [productName, setProductName] = useState(product.name);
    const [productPrice, setProductPrice] = useState(product.price);
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = validateForm();
        if (errors) {
        showModalMessage('Looks like something went wrong. Please try again.');
        return;
        }

        try {
        const response = await axios.put(`http://127.0.0.1:5000/products/${product.id}`, {
            name: productName,
            price: parseFloat(productPrice)
        });

        showModalMessage('Product update complete!');
        onUpdate(response.data);
        } catch (error) {
        showModalMessage('Looks like something went wrong. Please try again.');
        }
    };

    const validateForm = () => {
        if (!productName.trim()) return 'Product name cannot be empty';
        if (isNaN(productPrice) || productPrice <= 0) return 'Product price must be a positive number';
        return null;
    };

    const showModalMessage = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    return (
        <Container className="col-6 pt-5">
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(error) => setProductName(error.target.value)}
                required
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Product Price</Form.Label>
            <Form.Control
                type="number"
                placeholder="Enter product price"
                value={productPrice}
                onChange={(error) => setProductName(error.target.value)}
                required
                min="0"
                step="1.00"
            />
            </Form.Group>

            <Button variant="primary" type="submit">
            Update Product
            </Button>
        </Form>

        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMessage}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        </Container>
    );
};

export default UpdateProductForm;
