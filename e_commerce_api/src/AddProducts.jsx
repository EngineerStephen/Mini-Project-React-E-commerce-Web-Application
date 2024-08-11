import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Modal } from 'react-bootstrap';

const AddNewProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const submitForm = async (error) => {
        e.preventDefault();

        try {
            await axios.post('http://127.0.0.1:5000/products', {
                name,
                price: parseFloat(price),
            });

            setFeedbackMessage('Product has been successfully added.');
            setModalVisible(true);

            setName('');
            setPrice('');
        } catch (err) {
            setFeedbackMessage('Failed to add the product. Please try again.');
            setModalVisible(true);
        }
    };

    const closeModal = () => setModalVisible(false);

    return (
        <Container className="col-6 pt-5">
            <h3>Add a New Product</h3>
            <Form onSubmit={submitForm}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Product name"
                        value={name}
                        onChange={(error) => setName(error.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Product price"
                        value={price}
                        onChange={(error) => setPrice(error.target.value)}
                        required
                        min="0"
                        step="0.01"
                    />
                </Form.Group>

                <Button variant="success" type="submit">
                    Submit
                </Button>
            </Form>

            <Modal show={modalVisible} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>{feedbackMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AddNewProduct;
