import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import logo from './assets/Logo.png'
import mobileMenu from './assets/mobile/Menu.svg'

const Navbar = ({ menu, togglePopup, setMobileMenu, setMenu }) => {
    
    const buttonLinkOnClick = async (elementId) => {
        console.log("buttonLinkOnClick: " + elementId)
        var ex = document.getElementById(elementId);
        ex.click();
    }
    
    return (
        <Row className="navigationRow">
            {/* MOBILE */}
            <div className="navbarMobileDiv displayMobile"> 
                <Row className="menuMobileCol">
                    <Col className="col-6">
                        <div className="homeMobileCol" onClick={() => setMenu(0)}>
                            <Image src={logo} className="homeMobileImage" />
                        </div>
                    </Col>
                    <Col className="col-6 menuMobileCol">
                        <Image src={mobileMenu} className="menuMobileImage" onClick={() => setMobileMenu(true)} />
                    </Col>
                </Row>
            </div>

            {/* DESKTOP */}
            <div className="displayDesktop">
                <Col className="logoCol col-1">
                    <div className="logo" onClick={() => setMenu(0)}>
                        <img src={logo} className="logoNavbarImg" />
                    </div>
                </Col>
                <Col className="navigation m-0 p-0 col-11">
                    <Row className="navigationLinksRow">
                        <Col className="navigationLinksColLeft col-6">
                            <div className="m-0 p-0 navbarLinkElement" onClick={() => setMenu(1)}>
                                {menu == 1 ? (
                                    <span className='selectedMenu'>Mint</span>
                                ) : (
                                    <>Mint</>
                                )}
                            </div>
                            <div className="m-0 p-0 navbarLinkElement" onClick={() => setMenu(2)}>
                                {menu == 2 ? (
                                    <span className='selectedMenu'>Scratch</span>
                                ) : (
                                    <>Scratch</>
                                )}
                            </div>
                        </Col>
                        <Col className="navigationLinksColRight col-6">
                            <div className="m-0 p-0 popupButton" onClick={() => togglePopup('1')} >
                                Discord?
                            </div>
                            <div className="m-0 p-0">
                                <a href="https://twitter.com/scratchygg" target="_blank" className="navbarElement">Twitter</a>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </div>
        </Row>
    );
}
export default Navbar