import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import axios from 'axios';
import { ListGroup, Button, Container, Form } from 'react-bootstrap';
import NavigationBar from '../../NavigationBar';

function CustomerManagement() {
    const { id } = useParams();
    const [customers, setCustomers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [errors] = useState({});
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Separate state for form submission
    const [error, setError] = useState(null);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:5000/customers');
            setCustomers(response.data);
        } catch (error) {
            console.log("Oops! You have an error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCustomerData = async (id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/customers/${id}`);
            const { name, email, phone } = response.data;
            setName(name);
            setEmail(email);
            setPhone(phone);
            setSelectedCustomerId(id);
        } catch (error) {
            console.error('Error fetching customer data:', error);
            setError(error.toString());
        }
    };

    useEffect(() => {
        if (id) {
            fetchCustomerData(id);
        }
        fetchCustomers();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') setName(value);
        if (name === 'email') setEmail(value);
        if (name === 'phone') setPhone(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true); 

        try {
            if (selectedCustomerId) {
                await axios.put(`http://127.0.0.1:5000/customers/${selectedCustomerId}`, { name, email, phone });
            } else {
                await axios.post('http://127.0.0.1:5000/customers', { name, email, phone });
            }
            setShowSuccessModal(true);
            fetchCustomers();
        } catch (error) {
            console.error('Error submitting customer data:', error);
            setError(error.toString());
        } finally {
            setIsSubmitting(false); 
        }
    };

    const deleteCustomer = async (customer_id) => {
        const confirmed = window.confirm("Are you sure you want to delete this customer?");
        if (!confirmed) return;
        try {
            await axios.delete(`http://127.0.0.1:5000/customers/${customer_id}`);
            fetchCustomers();
        } catch (error) {
            console.log(`Error deleting customer ${customer_id}:`, error);
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false);
    };

    return (
        <div>
            <NavigationBar />
            <Container className="customer-management-container col-8 p-5">
                <h3>Customer Directory</h3>
                {isLoading ? (
                    <p>Loading customers...</p>
                ) : (
                    <ListGroup>
                        {customers.map((customer) => (
                            <ListGroup.Item key={customer.customer_id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="mb-0">
                                        <strong>ID:</strong> {customer.customer_id} | <strong>Name:</strong> {customer.name} | <strong>Email:</strong> {customer.email} | <strong>Phone:</strong> {customer.phone}
                                    </p>
                                </div>
                                <div>
                                    <Button variant="outline-primary" className="me-2">
                                        <Link to={`/customer/${customer.customer_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            View Details
                                        </Link>
                                    </Button>
                                    <Button variant="outline-danger" onClick={() => deleteCustomer(customer.customer_id)}>
                                        Remove
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
                
                {id && (
                    <div>
                        <h1>{selectedCustomerId ? 'Edit' : 'Add'} Customer</h1>
                        {isSubmitting && (
                            <div className="alert alert-info">
                                Submitting customer data...
                            </div>
                        )}
                        {error && (
                            <div className="alert alert-danger">
                                Error: {error}
                            </div>
                        )}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                                {errors.name && (
                                    <div style={{ color: 'red' }}>{errors.name}</div>
                                )}
                            </Form.Group>

                            <Form.Group controlId="formGroupEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                                {errors.email && (
                                    <div style={{ color: 'red' }}>{errors.email}</div>
                                )}
                            </Form.Group>

                            <Form.Group controlId="formGroupPhone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={phone}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                                {errors.phone && (
                                    <div style={{ color: 'red' }}>{errors.phone}</div>
                                )}
                            </Form.Group>

                            <Button type="submit" className="btn btn-primary">
                                {selectedCustomerId ? 'Update' : 'Submit'}
                            </Button>
                        </Form>

                        <div className={`modal ${showSuccessModal ? 'show' : ''}`} style={{ display: showSuccessModal ? 'block' : 'none' }} onClick={closeModal}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Success!</h5>
                                        <Button type="button" className="close" onClick={closeModal}>
                                            <span>&times;</span>
                                        </Button>
                                    </div>
                                    <div className="modal-body">
                                        The customer has been successfully {selectedCustomerId ? 'updated' : 'added'}.
                                    </div>
                                    <div className="modal-footer">
                                        <Button type="button" className="btn btn-secondary" onClick={closeModal}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
}

export default CustomerManagement;
