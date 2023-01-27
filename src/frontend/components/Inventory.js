import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Inventory = ({ web3Handler, account, setMenu, setSelectedSneaker }) => {

    const clickSneaker = (sneakerIndex) => {
        console.log("clickSneaker", sneakerIndex)
        setSelectedSneaker(sneakerIndex)
        setMenu(3)
    }
    return (
        <Row className="home">
            <div className="openingBoxCongratulationsTitle">OPEN A ORIGIN BOX & EQUIP AN ORIGIN EGG</div>
            <div className="openingBoxCongratulationsDesc mb-5">We are the future. 🌐</div>
            {!account ? (
                <div className="mintButton" onClick={web3Handler}>Connect MetaMask</div>
            ) : (
                <Row className="nftList">
                    <Col className="m-0 p-0 col-6 col-lg-3">
                        <Row className="itemSlot">
                            <img src={homeBox} className="nftListItem" onClick={() => clickSneaker(0)} />
                        </Row>
                        <Row className="itemDescDiv">
                            <Col className="col-12 col-lg-6 itemDescDivLeft">
                                <div className="itemDescTitle">
                                    ORIGIN BOX
                                </div>
                                <div className="itemDescDesc">
                                    What’s inside? 👀
                                </div>
                            </Col>
                            <Col className="col-12 col-lg-6">
                                <div className="itemDescButton" onClick={() => clickSneaker(0)} >
                                    Open
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="p-0 col-6 col-lg-3">
                        <div className="itemSlot">
                        </div>
                    </Col>
                    <Col className="p-0 col-6 col-lg-3">
                        <div className="itemSlot">
                        </div>
                    </Col>
                    <Col className="p-0 col-6 col-lg-3">
                        <div className="itemSlot">
                        </div>
                    </Col>
                    <Col className="p-0 col-6 col-lg-3">
                        <div className="itemSlot">
                        </div>
                    </Col>
                </Row>
            )}
        </Row>
    );
}
export default Inventory