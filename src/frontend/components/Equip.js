import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Equip = ({ web3Handler, account, mintButtonAllRarities, mintButtonIslands }) => {
    const [subMenu, setSubMenu] = useState(0)
    const [chosenItemIndex, setChosenItemIndex] = useState(0)

    const clickBox = (itemIndex) => {
        console.log("clickBox", itemIndex)
        setChosenItemIndex(itemIndex)
        setSubMenu(1)
    }

    const clickAgree = () => {
        console.log("clickAgree")
        setSubMenu(2)
        equipEgg()
    }

    const equipEgg = async () => {
        console.log("equipEgg", chosenItemIndex)
        await new Promise(r => setTimeout(r, 2000));
        setSubMenu(0)
    }

    useEffect(async () => {
        setSubMenu(0)
      }, [])

    return (
        <Row className="home">
                {!account ? (
                    <>
                        <Col className="homeCol">
                            <img src={homeBox} className="homeBoxImage" />
                        </Col>
                        <Col className="homeCol">
                            <Row className="mintButton" onClick={web3Handler}>Connect MetaMask</Row>
                        </Col>
                    </>
                ) : (
                    <>
                    {
                        {
                            '0': 
                                <>
                                    <Col className="homeCol">
                                        <img src={homeBox} className="homeBoxImage" />
                                    </Col>
                                    <Col className="homeCol">
                                        <Row className="openBoxTitle">Select Egg to Equip</Row>
                                        <Row className="nftList">
                                            <Col onClick={() => clickBox(0)} ><img src={homeBox} className="nftListItem" /></Col>
                                            <Col onClick={() => clickBox(1)} ><img src={homeBox} className="nftListItem" /></Col>
                                            <Col onClick={() => clickBox(2)} ><img src={homeBox} className="nftListItem" /></Col>
                                            <Col onClick={() => clickBox(3)} ><img src={homeBox} className="nftListItem" /></Col>
                                            <Col onClick={() => clickBox(4)} ><img src={homeBox} className="nftListItem" /></Col>
                                            <Col></Col>
                                        </Row>
                                    </Col>
                                </>,
                            '1':
                                <>
                                    <Col className="homeCol">
                                        <img src={homeBox} className="homeBoxImage" />
                                    </Col>
                                    <Col className="homeCol">
                                        <Row className="">
                                            <div>Equip this Skin?</div>
                                            <div><img src={homeBox} className="homeBoxImage" /></div>
                                            <div className="mintButton" onClick={clickAgree}>Equip</div>
                                        </Row>
                                    </Col>
                                </>,
                            '2':
                                <>
                                    <Row className="">
                                        <div className="openingBoxWaiting">Waiting for MetaMask transaction...</div>
                                        <div className="">
                                            <div><img src={homeBox} className="openingBoxBackground" /></div>
                                        </div>
                                    </Row>
                                </>,
                        }[subMenu]
                    }
                    </>
                )}
        </Row>
    );
}
export default Equip