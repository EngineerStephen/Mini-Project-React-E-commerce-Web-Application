import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import NavigationBar from './NavigationBar';

function UpdateCustomer() {
    const { id } = useParams();
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`http://127.0.0.1:5000/customers/${id}`, {
                name: customerName,
                email: customerEmail,
                phone: customerPhone
            });
            console.log('Customer updated successfully:', response.data);

            setCustomerName('');
            setCustomerEmail('');
            setCustomerPhone('');
        } catch (error) {
            console.error('There was an error updating the customer!', error);
        }
    };

    return (
        <>
        <NavigationBar/>
        <Container className='col-6 p-5'>

        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Customer Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter customer email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Customer Phone</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter customer phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit Change
            </Button>
        </Form>
    </Container>
</>
    );
};

export default UpdateCustomer;
