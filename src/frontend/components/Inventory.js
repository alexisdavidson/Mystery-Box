import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'
import sneakerItem from './assets/sneakerItem.png'
import NftBoxAddress from '../contractsData/NftBox-address.json'
import NftEggAddress from '../contractsData/NftEgg-address.json'
import NftSneakerAddress from '../contractsData/NftSneaker-address.json'

const Inventory = ({ web3Handler, account, setMenu, setSelectedSneaker, setTransactionObjectId, setTransactionFinished,
                        items, nftBox, setMetadata, reveal}) => {
    
    const clickOpenBox = async (boxIndex) => {
        console.log("clickOpenBox", boxIndex)
        setSelectedSneaker(boxIndex)
    
        setTransactionFinished(false)
        setTransactionObjectId(1)
        setMenu(1)
    
        setMetadata(0);
        await(await nftBox.openBox(items[boxIndex].token_id)).wait()
        setMenu(4)
    }
    const clickSneaker = (sneakerIndex) => {
        console.log("NftBoxAddress.address", NftBoxAddress.address)
        console.log("item.contract", items[sneakerIndex].contract)
        console.log("clickSneaker", sneakerIndex)
        setSelectedSneaker(sneakerIndex)
        setMenu(3)
    }
    
    useEffect(() => {
        reveal()
    }, [])
    return (
        <Row className="m-0 reveal">
            <div className="openingBoxCongratulationsTitle">INVENTORY</div>
            <div className="openingBoxCongratulationsDesc mb-5">Open an ORIGIN Box and equip your BLANK Sneaker with the ORIGIN Egg. We are the future. 🌐</div>
            {!account ? (
                <div className="mintButton" onClick={web3Handler}>Connect MetaMask</div>
            ) : (
                <Row className="nftList">
                    {items.map((item, idx) => (
                        <Col key={idx} className="m-0 p-0 col-6 col-lg-3">
                            <Row className="itemSlotFilled">
                                <img src={item.image_url} className="nftListItem" />
                            </Row>
                            <Row className="itemDescDiv">
                                <Col className="col-12 col-lg-6 itemDescDivLeft">
                                    <div className="itemDescTitle">
                                        item.name {item.name}
                                    </div>
                                    <div className="itemDescDesc">
                                        {item.contract.includes(NftBoxAddress.address.toUpperCase()) ? (
                                            <>
                                                What’s inside? 👀
                                            </>
                                        ) : (
                                            <>
                                                Ready to SWAG. ⛩️
                                            </>
                                        )}
                                        
                                    </div>
                                </Col>
                                <Col className="col-12 col-lg-6">
                                    {item.contract.includes(NftBoxAddress.address.toUpperCase()) ? (
                                        <div className="itemDescButton" onClick={() => clickOpenBox(idx)} >
                                            Open
                                        </div>
                                    ) : (
                                        <div className="itemDescButton" onClick={() => clickSneaker(idx)} >
                                            Equip
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    ))}
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