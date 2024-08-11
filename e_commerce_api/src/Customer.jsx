import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from "./NavigationBar";
import './customer.css';
import './App.css';

function Customer() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchCustomerData(id);
        }
    }, [id]);

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') setName(value);
        if (name === 'email') setEmail(value);
        if (name === 'phone') setPhone(value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Submitting form with state:', { name, email, phone });
    };

    const closeModal = () => {
        setShowSuccessModal(false);
    };

    return (
        <div className="container">
            <NavigationBar />
            <h1>Customer Details</h1>
            {isLoading && (
                <div className="alert alert-info">
                    Submitting customer data...
                </div>
            )}
            {error && (
                <div className="alert alert-danger">
                    Error: {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group" controlId="formGroupName">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.name && (
                        <div style={{ color: 'red' }}>{errors.name}</div>
                    )}
                </div>

                <div className="form-group" controlId="formGroupEmail">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.email && (
                        <div style={{ color: 'red' }}>{errors.email}</div>
                    )}
                </div>

                <div className="form-group" controlId="formGroupPhone">
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.phone && (
                        <div style={{ color: 'red' }}>{errors.phone}</div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>

            <div className={`modal ${showSuccessModal ? 'show' : ''}`} style={{ display: showSuccessModal ? 'block' : 'none' }} onClick={closeModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Success!</h5>
                            <button type="button" className="close" onClick={closeModal}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            The customer has been successfully {selectedCustomerId ? 'updated' : 'added'}.
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Customer;
