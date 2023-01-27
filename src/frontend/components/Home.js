import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button, Form } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Home = ({ web3Handler, account, mintButtonAllRarities, mintButtonIslands }) => {
    return (
        <Row className="home">
            <Col className="homeCol">
                <img src={homeBox} className="homeBoxImage" />
            </Col>
            <Col className="homeCol">
                <div className="enterTitle topTitleTextEffect">
                    <div className="topDescriptionFirst">
                        <div className="topDescriptionFirst1">JOIN</div>
                        <div className="topDescriptionFirst2">the</div>
                    </div>
                    <div className="topDescriptionSecond">ORIGIN</div>
                </div>
                {!account ? (
                    <div className="mintButton" onClick={web3Handler}>Connect Metamask</div>
                ) : (
                    <div>
                        <div className="mintButton" onClick={mintButtonAllRarities}>MINT ALL RARITIES x1 $80</div>
                        <div className="mintButton" onClick={mintButtonIslands}>MINT ONLY 1% ISLANDS x1 $350</div>
                    </div>
                )}
                <div className="">Get yours on <a href="https://opensea.io" target="_blank">OpenSea</a> using your <span style={{fontWeight: "bold", color: "white", fontStyle: "italic"}}>credit card.</span></div>
                <div className="mt-3">
                    <Form.Check className="checkboxForm"
                        type="checkbox"
                        id="default-checkbox"
                        label={(<>I have read and accept the <a href="#">Terms & Conditions.</a></>)}
                    />
                    
                </div>
            </Col>
        </Row>
    );
}
export default Home