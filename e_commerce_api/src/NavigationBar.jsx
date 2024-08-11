import React from "react";
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from "react-bootstrap";



function NavigationBar() {
    return (
        <Navbar bg='light' expand="lg">
            <Navbar.Brand href="/">E-Commerce App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={NavLink} to="/">
                        Home
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/customers">
                        Customers
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/customer-details">
                        Customer Details
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/products">
                        Products
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/product-details/:id">
                        Product Details
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/delete-product/:id">
                        Delete Product
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/place-order">
                        Place Order
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/retrieve-order/:id">
                        Retrieve Order
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/track-order/:id">
                        Track Order
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavigationBar;
