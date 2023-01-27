import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button, Navbar, Nav, NavDropdown, Container } from 'react-bootstrap'
import logo from './assets/logo.png'

const Navigation = ({ setMenu }) => {
    
    const buttonLinkOnClick = async (elementId) => {
        console.log("buttonLinkOnClick: " + elementId)
        var ex = document.getElementById(elementId);
        ex.click();
    }
    
    return (
        <Row className="navbarCustom">
            <Col className="navbarLogoDiv">
                <img src={logo} className="logo logoNavbarImg" onClick={() => setMenu(0)}/>
            </Col>
            <Col className="navbarLinksDiv">
                <div onClick={() => setMenu(2)} className="inventoryButton">Inventory</div>
            </Col>
        </Row>
        // <Navbar collapseOnSelect fixed="top" variant="dark" className="navbarCustom">
        //     <Container>
        //         <Navbar.Brand onClick={() => setMenu(0)} ><img src={logo} className="logo logoNavbarImg" /></Navbar.Brand>
        //         <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        //         <Navbar.Collapse id="responsive-navbar-nav">
        //             <Nav className="me-auto">
        //             </Nav>
        //             <Nav className="displayDesktop">
        //                 <Nav.Link onClick={() => setMenu(1)} className="navbarElement">Open Mystery Box</Nav.Link>
        //                 <Nav.Link onClick={() => setMenu(2)} className="navbarElement">Inventory</Nav.Link>
        //             </Nav>
        //         </Navbar.Collapse>
        //     </Container>
        // </Navbar>
    );
}
export default Navigation