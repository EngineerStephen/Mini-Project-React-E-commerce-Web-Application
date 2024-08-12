import React from "react";
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from "react-bootstrap";

function NavigationBar() {
    return (
        <Navbar bg='light' expand="lg">
            <Navbar.Brand href="/">E-Commerce App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={NavLink} exact="true" to="/">
                        Home
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/customers">
                        Customers
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/products">
                        Products
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/order">
                        <Orders></Orders>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavigationBar;
