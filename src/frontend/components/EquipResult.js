import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import videoPlaceholder from './assets/videoPlaceholder.png'

const EquipResult = ({ transactionFinished, setMenu }) => {

    return (
        <Row className="m-0 p-0">
            <Row className="openingBoxCongratulationsTitle">
                <div>
                    Congratulations!
                </div>
            </Row>
            <Row className="openingBoxCongratulationsDesc">
                <div>
                    You already have your Metaverse Sneakers. ⛩️ We are the future. 🌐
                </div>
            </Row>
            <Row className="m-0 p-0">
                <div className="mt-5">
                    <img src={videoPlaceholder} className="equipImage" />
                </div>
            </Row>
        </Row>
    );
}
export default EquipResult