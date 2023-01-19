import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const Menu = ({togglePopup, setMenu, setMobileMenu}) => {

    return (
        <Row className="popupBig">
            <Row className="m-0 p-0">
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => {setMenu(1); setMobileMenu(false);}}>MINT</div>
                </Row>
                <Row className="m-0 p-0 mb-5">
                    <div className="mobileMenuButton" onClick={() => {setMenu(2); setMobileMenu(false);}}>SCRATCH</div>
                </Row>
                <Row className="m-0 p-0 mt-5">
                    <div className="mobileMenuButton" onClick={() => togglePopup(1)}>DISCORD?</div>
                </Row>
                <Row className="m-0 p-0">
                    <a href="https://twitter.com/scratchygg" target="_blank" >TWITTER</a>
                </Row>
            </Row>
        </Row>
    );
}
export default Menu