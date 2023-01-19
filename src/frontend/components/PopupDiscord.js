import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const PopupDiscord = ({ closePopup }) => {

    return (
        <Row className="popup">
            <div>
                NO DISCORD, NO CONCORD. <br/>
                MAYBE, HUH?
            </div>

            <div className="popupButtonClose" onClick={closePopup} >
                Close
            </div>
        </Row>
    );
}
export default PopupDiscord