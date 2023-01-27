import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import videoPlaceholder from './assets/videoPlaceholder.png'
import eggItemEquip from './assets/eggItemEquip.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Equip = ({ web3Handler, account, mintButtonAllRarities, mintButtonIslands, setMenu }) => {
    const [subMenu, setSubMenu] = useState(0)
    const [chosenItemIndex, setChosenItemIndex] = useState(0)

    const clickBox = (itemIndex) => {
        console.log("clickBox", itemIndex)
        setChosenItemIndex(itemIndex)
        setMenu(5)
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
                            <img src={videoPlaceholder} className="homeBoxImage" />
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
                                    <Col className="col-12 col-lg-6 homeCol">
                                        <img src={videoPlaceholder} className="equipImage" />
                                    </Col>
                                    <Col className="col-12 col-lg-6 homeCol">
                                        <div className="m-0 equipPanel">
                                            <div className="m-0 openingBoxCongratulationsTitle">
                                                EQUIP ORIGIN EGG
                                            </div>
                                            <Row className="m-0 equipList">
                                                <Col className="m-0 p-0 col-6 col-lg-4">
                                                    <Row className="equipItemSlot">
                                                        <img src={eggItemEquip} className="equipListItem" onClick={() => clickBox(0)} />
                                                    </Row>
                                                    <Row className="equipItemDescDiv">
                                                            <div className="itemDescTitle">
                                                                CREATORS NAME
                                                            </div>
                                                            <div className="itemDescDesc">
                                                                ORIGIN EGG
                                                            </div>
                                                    </Row>
                                                </Col>
                                                <Col className="m-0 p-0 col-6 col-lg-4">
                                                    <Row className="equipItemSlot">
                                                        <img src={eggItemEquip} className="equipListItem" onClick={() => clickBox(0)} />
                                                    </Row>
                                                    <Row className="equipItemDescDiv">
                                                        <div className="itemDescTitle">
                                                            CREATORS NAME
                                                        </div>
                                                        <div className="itemDescDesc">
                                                            ORIGIN EGG
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col className="m-0 p-0 col-6 col-lg-4">
                                                    <Row className="equipItemSlot">
                                                        <img src={eggItemEquip} className="equipListItem" onClick={() => clickBox(0)} />
                                                    </Row>
                                                    <Row className="equipItemDescDiv">
                                                        <div className="itemDescTitle">
                                                            CREATORS NAME
                                                        </div>
                                                        <div className="itemDescDesc">
                                                            ORIGIN EGG
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col className="m-0 p-0 col-6 col-lg-4">
                                                    <Row className="equipItemSlot">
                                                    </Row>
                                                </Col>
                                                <Col className="m-0 p-0 col-6 col-lg-4">
                                                    <Row className="equipItemSlot">
                                                    </Row>
                                                </Col>
                                                <Col className="m-0 p-0 col-6 col-lg-4">
                                                    <Row className="equipItemSlot">
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </>,
                            '1':
                                <>
                                    <Col className="homeCol">
                                        <img src={videoPlaceholder} className="homeBoxImage" />
                                    </Col>
                                    <Col className="homeCol">
                                        <Row className="">
                                            <div>Equip this Skin?</div>
                                            <div><img src={eggItemEquip} className="homeBoxImage" /></div>
                                            <div className="mintButton" onClick={clickAgree}>Equip</div>
                                        </Row>
                                    </Col>
                                </>,
                            '2':
                                <>
                                    <Row className="">
                                        <div className="openingBoxWaiting">Waiting for MetaMask transaction...</div>
                                        <div className="">
                                            <div><img src={videoPlaceholder} className="openingBoxBackground" /></div>
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