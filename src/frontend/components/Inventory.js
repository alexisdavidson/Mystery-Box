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
                    <Col className="p-0 col-6 col-lg-3">
                        <div className="itemSlot">
                            <img src={homeBox} className="nftListItem" onClick={() => clickSneaker(0)} />
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