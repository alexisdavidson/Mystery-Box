import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'
import NftBoxAddress from '../contractsData/NftBox-address.json'
import NftEggAddress from '../contractsData/NftEgg-address.json'
import NftSneakerAddress from '../contractsData/NftSneaker-address.json'
import NftSneakerXAddress from '../contractsData/NftSneakerX-address.json'

const Inventory = ({ web3Handler, account, setMenu, setSelectedSneaker, setTransactionObjectId, setTransactionFinished,
                        items, nftBox, setEggLootMetadata, reveal, itemsWeb3RemoveRef, setItemsWeb3Remove, refreshListWeb3Web2,
                        setWaitingForBlockchain }) => {
    
    const clickOpenBox = async (boxIndex) => {
        console.log("clickOpenBox", items[boxIndex].token_id)
        // setSelectedSneaker(items[boxIndex].token_id)
    
        setTransactionFinished(false)
        setTransactionObjectId(1)
        setMenu(1)
    
        setEggLootMetadata(1);
        await(await nftBox.openBox(items[boxIndex].token_id)).wait()
        // setMenu(4)

        // Add Box to remove list
        let itemsTemp = itemsWeb3RemoveRef.current

        itemsTemp.push({
          contract: NftBoxAddress.address.toUpperCase(),
          name: "",
          token_id: items[boxIndex].token_id,
        //   image_url: "",
          creator: "",
          metadata: 0,
          web2: true
        })

        itemsTemp = [...itemsWeb3RemoveRef.current, ...itemsTemp]
        setItemsWeb3Remove(itemsTemp)
        refreshListWeb3Web2(true)
        setWaitingForBlockchain(true)
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
                                {item.contract.includes(NftSneakerAddress.address.toUpperCase()) ? (
                                    // <img src={item.image_url} className="nftListItem" />
                                    <video id="vid" loop autoPlay muted className="openingBoxNftListItem" >
                                        <source src={'Sneaker/32.webm'} type="video/webm"/>
                                    </video>
                                ) : (
                                    item.contract.includes(NftSneakerXAddress.address.toUpperCase()) ? (
                                        <video id="vid" loop autoPlay muted className="openingBoxNftListItem" >
                                            <source src={"Sneaker/"+ item.metadata + ".webm"} type="video/webm"/>
                                        </video>
                                    ) : (
                                        item.contract.includes(NftEggAddress.address.toUpperCase()) ? (
                                            <video id="vid" loop autoPlay muted className="openingBoxNftListItem" >
                                                <source src={"Egg/"+ item.metadata + ".webm"} type="video/webm"/>
                                            </video>
                                        ) : (
                                            item.contract.includes(NftBoxAddress.address.toUpperCase()) ? (
                                                <video id="vid" loop autoPlay muted className="openingBoxNftListItem" >
                                                    <source src={"Box/"+ item.metadata + ".mp4"} type="video/mp4"/>
                                                </video>
                                                // <></>
                                            ) : (
                                                // <img src={item.image_url} className="nftListItem" />
                                                <></>
                                            )
                                        )
                                    )
                                )}
                            </Row>
                            <Row className="itemDescDiv">
                                <Col className="col-12 col-lg-6 itemDescDivLeft">
                                    <div className="itemDescTitle">
                                        {item.name}
                                    </div>
                                    <div className="itemDescDesc">
                                        {item.contract.includes(NftBoxAddress.address.toUpperCase()) ? (
                                            <>
                                                What’s inside? 👀
                                            </>
                                        ) : (
                                            <>
                                                {item.contract.includes(NftSneakerAddress.address.toUpperCase()) ? (
                                                    <>
                                                        Ready to SWAG. ⛩️
                                                    </>
                                                ) : (
                                                    <>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        
                                    </div>
                                </Col>
                                <Col className="col-12 col-lg-6">
                                    {item.web2 ? (
                                        <div className="itemDescButtonWait" >
                                            Wait
                                        </div>
                                    ) : (
                                        item.contract.includes(NftBoxAddress.address.toUpperCase()) ? (
                                            <div className="itemDescButton" onClick={() => clickOpenBox(idx)} >
                                                Open
                                            </div>
                                        ) : (
                                            item.contract.includes(NftSneakerAddress.address.toUpperCase()) ? (
                                                <div className="itemDescButton" onClick={() => clickSneaker(idx)} >
                                                    Equip
                                                </div>
                                            ) : (
                                                <></>
                                            )
                                        )
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