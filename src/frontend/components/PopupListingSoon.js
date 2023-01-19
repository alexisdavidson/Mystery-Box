import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const PopupListingSoon = ({ closePopup }) => {

    return (
        <Row className="popup">
            <div>
                LISTING SOON
            </div>

            <div className="popupButtonClose" onClick={closePopup} >
                Close
            </div>
        </Row>
    );
}
export default PopupListingSoon