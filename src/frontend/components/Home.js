import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Home = ({ web3Handler, account }) => {
    return (
        <Row className="home">
            <Col className="homeCol">
                <img src={homeBox} className="homeBoxImage" />
            </Col>
            <Col className="homeCol">
                <div className="enterTitle">ENTER</div>
                {!account ? (
                    <div className="mintButton" onClick={web3Handler}>Connect MetaMask</div>
                ) : (
                    <div>
                        <div className="mintButton" >MINT ALL RARITIES x1 $80</div>
                        <div className="mintButton" >MINT ONLY 1% ISLANDS x1 $350</div>
                        <div className=""><a href="https://opensea.io">No Mystery Box? Get one on OpenSea</a></div>
                    </div>
                )}
            </Col>
        </Row>
    );
}
export default Home