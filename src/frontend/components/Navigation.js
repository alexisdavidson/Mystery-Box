import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button, Navbar, Nav, NavDropdown, Container } from 'react-bootstrap'
import logo from './assets/logo.png'
import mobileMenu from './assets/mobile/Menu.svg'

const Navigation = ({ menu, togglePopup, setMobileMenu, setMenu }) => {
    
    const buttonLinkOnClick = async (elementId) => {
        console.log("buttonLinkOnClick: " + elementId)
        var ex = document.getElementById(elementId);
        ex.click();
    }
    
    return (
        <Navbar collapseOnSelect fixed="top" expand="lg" bg="black" variant="dark" className="navbarCustom">
            <Container>
            <Navbar.Brand href="#home"><a href="/#top" className="logo"><img src={logo} className="logoNavbarImg" /></a></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                </Nav>
                <Nav>
                    <Nav.Link href="/inventory" className="navbarElement">Inventory</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default Navigation