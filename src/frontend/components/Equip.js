import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import videoPlaceholder from './assets/videoPlaceholder.png'
import eggItemEquip from './assets/eggItemEquip.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Equip = ({ web3Handler, account, mintButtonAllRarities, mintButtonIslands, setMenu, 
        setTransactionFinished, setTransactionObjectId, itemsEggs, equip, items, selectedSneaker }) => {
    const [subMenu, setSubMenu] = useState(0)
    const [chosenItemIndex, setChosenItemIndex] = useState(0)

    const clickEquip = (itemIndex) => {
        console.log("clickEquip", itemIndex)
        setChosenItemIndex(itemIndex)
        
        for(let i = 0; i < 3; i ++) {
            var element = document.getElementById('equipItem-' + i);
            if (element != null)
                element.classList.remove('equipItemSlotSelected');
        }

        var elementResult = document.getElementById('equipItem-' + itemIndex);
        if (elementResult != null)
            elementResult.classList.add('equipItemSlotSelected');

    }

    const clickAgree = () => {
        console.log("clickAgree")
        setSubMenu(2)
        equipEgg()
    }

    const equipEgg = async () => {
        console.log("equipEgg", chosenItemIndex)
    
        setTransactionFinished(false)
        setTransactionObjectId(2)
        setMenu(1)
    
        await(await equip.equip(items[selectedSneaker].token_id, itemsEggs[chosenItemIndex].token_id)).wait()
        await new Promise(r => setTimeout(r, 2000));
        setMenu(5)
    }

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
                                                {itemsEggs.map((item, idx) => (
                                                    <Col key={idx} className="m-0 p-0 col-6 col-lg-4">
                                                        <Row id={"equipItem-" + idx} className="equipItemSlotFilled">
                                                            <img src={eggItemEquip} className="equipListItem" onClick={() => clickEquip(idx)} />
                                                        </Row>
                                                        <Row className="equipItemDescDiv">
                                                                <div className="itemDescTitle">
                                                                    {item.creator}
                                                                </div>
                                                                <div className="itemDescDesc">
                                                                    ORIGIN EGG
                                                                </div>
                                                        </Row>
                                                    </Col>
                                                ))}
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
                                            <Row>
                                                <div className="equipButton" onClick={() => equipEgg()} >
                                                    Equip
                                                </div>
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