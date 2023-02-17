import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'
import Egg from './assets/egg.png'
import sneakerItem2 from './assets/sneakerItem.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const BoxOpenResult = ({ setMenu, reveal, eggLootMetadata, itemsEggs }) => {

    const clickInventory = () => {
        console.log("clickInventory")
        setMenu(2)
    }
    useEffect(() => {
        reveal()
    }, [])
    return (
        <Row className="m-0 p-0 reveal">
            <Row className="openingBoxCongratulationsTitle">
                <div>
                    Congratulations!
                </div>
            </Row>
            <Row className="m-0 p-0">
                <div className="openingBoxUnlockedDiv m-0 p-0">
                    <div className="openingBoxUnlocked">
                        You unlocked <span className="unlockedItemText">+1 Blank Sneaker</span> and <span className="unlockedItemText">+1 Origin Egg</span>
                         {/* and <span className="unlockedItemText">+1 Origin Box</span> */}
                    </div>
                </div>
            </Row>
            <Row className="openingBoxItems justify-content-center">
                <Col className="m-0 p-0 col-6 col-lg-3">
                    <Row className="openingBoxItemSlotFilled">
                        <img src={sneakerItem2} className="openingBoxNftListItem" />
                    </Row>
                </Col>
                <Col className="m-0 p-0 col-6 col-lg-3">
                    <Row className="openingBoxItemSlotFilled">
                        {/* <img src={Egg} className="openingBoxNftListItem" /> */}
                        <video id="vid" loop autoPlay muted className="openingBoxNftListItem" >
                            <source src={"Egg/"+ eggLootMetadata + ".webm"} type="video/mp4"/>
                        </video>
                    </Row>
                </Col>
                {/* <Col className="m-0 p-0 col-6 col-lg-3">
                    <Row className="openingBoxItemSlotFilled">
                        <img src={homeBox} className="openingBoxNftListItem" />
                    </Row>
                </Col> */}
            </Row>
            <Row className="openingBoxButtons">
                <div className="openingBoxButton" onClick={() => setMenu(0)}>Buy Another Box</div>
                <div className="openingBoxButton" onClick={clickInventory}>Go To Your Inventory</div>
            </Row>
        </Row>
    );
}
export default BoxOpenResult