import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'
import sneakerItem from './assets/sneakerItem.png'

const Inventory = ({ web3Handler, account, setMenu, setSelectedSneaker, setTransactionObjectId, setTransactionFinished }) => {
    const clickOpenBox = async (boxIndex) => {
        console.log("clickOpenBox", boxIndex)
        setSelectedSneaker(boxIndex)
    
        setTransactionFinished(false)
        setTransactionObjectId(1)
        setMenu(1)
    
        await new Promise(r => setTimeout(r, 2000));
        setMenu(4)
    }
    const clickSneaker = (sneakerIndex) => {
        console.log("clickSneaker", sneakerIndex)
        setSelectedSneaker(sneakerIndex)
        setMenu(3)
    }
    return (
        <Row className="m-0">
            <div className="openingBoxCongratulationsTitle">INVENTORY</div>
            <div className="openingBoxCongratulationsDesc mb-5">Open an ORIGIN Box and equip your BLANK Sneaker with the ORIGIN Egg. We are the future. 🌐</div>
            {!account ? (
                <div className="mintButton" onClick={web3Handler}>Connect MetaMask</div>
            ) : (
                <Row className="nftList">
                    <Col className="m-0 p-0 col-6 col-lg-3">
                        <Row className="itemSlotFilled">
                            <img src={homeBox} className="nftListItem" />
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
                                <div className="itemDescButton" onClick={() => clickOpenBox(0)} >
                                    Open
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="p-0 col-6 col-lg-3">
                        <Row className="itemSlotFilled">
                            <img src={sneakerItem} className="nftListItem" />
                        </Row>
                        <Row className="itemDescDiv">
                            <Col className="col-12 col-lg-6 itemDescDivLeft">
                                <div className="itemDescTitle">
                                    BLANK Sneaker
                                </div>
                                <div className="itemDescDesc">
                                    Ready to SWAG. ⛩️
                                </div>
                            </Col>
                            <Col className="col-12 col-lg-6">
                                <div className="itemDescButton" onClick={() => clickSneaker(1)} >
                                    Equip
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="p-0 col-6 col-lg-3">
                        <Row className="itemSlot">
                        </Row>
                    </Col>
                    <Col className="p-0 col-6 col-lg-3">
                        <Row className="itemSlot">
                        </Row>
                    </Col>
                    <Col className="p-0 col-6 col-lg-3">
                        <Row className="itemSlot">
                        </Row>
                    </Col>
                    <Col className="p-0 col-6 col-lg-3">
                        <Row className="itemSlot">
                        </Row>
                    </Col>
                    <Col className="p-0 col-6 col-lg-3">
                        <Row className="itemSlot">
                        </Row>
                    </Col>
                    <Col className="p-0 col-6 col-lg-3">
                        <Row className="itemSlot">
                        </Row>
                    </Col>
                </Row>
            )}
        </Row>
    );
}
export default Inventory