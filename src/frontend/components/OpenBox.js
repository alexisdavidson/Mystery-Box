import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const OpenBox = ({ web3Handler, account, mintButtonAllRarities, mintButtonIslands }) => {
    return (
        <Row className="home">
            <Col className="homeCol">
                <img src={homeBox} className="homeBoxImage" />
            </Col>
            <Col className="homeCol">
                <div className="enterTitle">SELECT A MISTERY BOX</div>
                {!account ? (
                    <div className="mintButton" onClick={web3Handler}>Connect MetaMask</div>
                ) : (
                    <div>
                    </div>
                )}
            </Col>
        </Row>
    );
}
export default OpenBox