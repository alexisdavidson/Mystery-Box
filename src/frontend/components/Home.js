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
                    <div className="connectButton" onClick={web3Handler}>Connect Metamask</div>
                ) : (
                    <div className="mintButtonsDiv">
                        <div className="mintButtonDiv">
                            <Form.Control className="mintQuantitySelector"
                                type="number"
                                id="mintQuantitySelector-1"
                                defaultValue="1"
                                label={(<>
                                
                                </>)}
                            />
                            <div className="mintButton" onClick={mintButtonAllRarities}>
                                <div className="mintButtonText">Buy Origin Box</div>
                                <div className="mintButtonPrice">$80</div>
                            </div>
                        </div>
                        <div className="mintButtonDiv">
                            <Form.Control className="mintQuantitySelector"
                                type="number"
                                id="mintQuantitySelector-2"
                                defaultValue="1"
                            />
                            <div className="mintButton" onClick={mintButtonIslands}>
                                <div className="mintButtonText">Buy Origin Box Islands</div>
                                <div className="mintButtonPrice">$350</div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="homeBelowButton">
                    <div className="">Get yours on <a href="https://opensea.io" target="_blank">OpenSea</a> using your <span style={{fontWeight: "bold", color: "white", fontStyle: "italic"}}>credit card.</span></div>
                    {!account ? (
                        <div className="mt-3">
                            <Form.Check className="checkboxForm"
                                type="checkbox"
                                id="default-checkbox"
                                label={(<>I have read and accept the <a href="#">Terms & Conditions.</a></>)}
                            />
                            
                        </div>
                    ) : (
                        <div className="mt-2" style={{fontSize: "0.7rem"}}>
                            Verified Creators Creations are in all the boxes.
                            <br/>Islands Box always Opens the rarest Creations.
                        </div>
                    )}
                </div>
            </Col>
            <div className="homeEffect1"></div>
            <div className="homeEffect2"></div>
        </Row>
    );
}
export default Home