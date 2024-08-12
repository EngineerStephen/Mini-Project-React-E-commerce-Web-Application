import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import NavigationBar from '../../NavigationBar';

const AddProductForm = ({ onAddProduct, onCancel }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddProduct({ name, price: parseFloat(price) });
    };

    return (
        <Container className="col-6 pt-5">
            <h3>Add a New Product</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Product name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Product price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                    />
                </Form.Group>

                <Button variant="success" type="submit">Submit</Button>
                <Button variant="secondary" className="ms-2" onClick={onCancel}>Cancel</Button>
            </Form>
        </Container>
    );
};

const UpdateProductForm = ({ product, onUpdateProduct, onCancel }) => {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateProduct({ name, price: parseFloat(price) });
    };

    return (
        <Container className="col-6 pt-5">
            <h3>Update Product</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                    />
                </Form.Group>

                <Button variant="primary" type="submit">Update Product</Button>
                <Button variant="secondary" className="ms-2" onClick={onCancel}>Cancel</Button>
            </Form>
        </Container>
    );
};


const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [view, setView] = useState('list'); 
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const loadProducts = async () => {
        try {
            const { data } = await axios.get('http://127.0.0.1:5000/products');
            setProducts(data);
            setIsLoading(false);
        } catch (err) {
            console.error('Error loading products:', err);
            setErrorMessage('Failed to load products. Please try again.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleAddProduct = async (newProduct) => {
        try {
            await axios.post('http://127.0.0.1:5000/products', newProduct);
            setModalMessage('Product has been successfully added.');
            setModalVisible(true);
            loadProducts();
            setView('list');
        } catch (err) {
            setModalMessage('Failed to add the product. Please try again.');
            setModalVisible(true);
        }
    };

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            await axios.put(`http://127.0.0.1:5000/products/${selectedProduct.id}`, updatedProduct);
            setModalMessage('Product update complete!');
            setModalVisible(true);
            loadProducts();
            setView('list');
        } catch (err) {
            setModalMessage('Failed to update the product. Please try again.');
            setModalVisible(true);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await axios.delete(`http://127.0.0.1:5000/products/${id}`);
            setModalMessage('Product has been deleted.');
            setModalVisible(true);
            loadProducts();
        } catch (err) {
            setModalMessage('Failed to delete the product. Please try again.');
            setModalVisible(true);
        }
    };

    const handleCloseModal = () => setModalVisible(false);

    const renderProductList = () => (
        <Container className="col-8 pt-5">
            <h3>Product List</h3>
            <Button variant="primary" onClick={() => setView('add')}>Add New Product</Button>
            <ListGroup className="mt-3">
                {products.map(({ product_id, name, price }) => (
                    <ListGroup.Item key={product_id} className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{name}</strong> - ${price}
                        </div>
                        <div>
                            <Button
                                variant="outline-primary"
                                className="me-2"
                                onClick={() => { setSelectedProduct({ id: product_id, name, price }); setView('update'); }}
                            >
                                Edit
                            </Button>
                            <Button variant="outline-danger" onClick={() => handleDeleteProduct(product_id)}>
                                Delete
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );

    if (isLoading) return <p>Loading products...</p>;
    if (errorMessage) return <p>{errorMessage}</p>;

    return (
        <div>
            <NavigationBar />
            {view === 'list' && renderProductList()}
            {view === 'add' && <AddProductForm onAddProduct={handleAddProduct} onCancel={() => setView('list')} />}
            {view === 'update' && selectedProduct && <UpdateProductForm product={selectedProduct} onUpdateProduct={handleUpdateProduct} onCancel={() => setView('list')} />}

            <Modal show={modalVisible} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductManagement;
