import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import NftSneakerAddress from '../contractsData/NftSneaker-address.json'
import NftSneakerXAddress from '../contractsData/NftSneakerX-address.json'
import NftEggAddress from '../contractsData/NftEgg-address.json'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Equip = ({ web3Handler, account, mintButtonAllRarities, mintButtonIslands, setMenu, 
        setTransactionFinished, setTransactionObjectId, itemsEggs, equip, items, selectedSneaker,
        reveal, chosenEggIndex, setChosenEggIndex, itemsWeb3RemoveRef, setItemsWeb3Remove, refreshListWeb3Web2,
        setItemsWeb2, itemsWeb2Ref, setWaitingForBlockchain }) => {
    const [subMenu, setSubMenu] = useState(0)
    const [eggClicked, setEggClicked] = useState(false)

    const clickEquip = (itemIndex) => {
        console.log("clickEquip", itemIndex)
        setChosenEggIndex(itemIndex)
        setEggClicked(true)

        console.log("metadata egg", itemsEggs[itemIndex].metadata)
        var video = document.getElementById('vid');
        video?.load();
        
        for(let i = 0; i < itemsEggs.length; i ++) {
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
        console.log("equipEgg", chosenEggIndex)
    
        setTransactionFinished(false)
        setTransactionObjectId(2)
        setMenu(1)
    
        await(await equip.equip(items[selectedSneaker].token_id, itemsEggs[chosenEggIndex].token_id)).wait()
        setMenu(5)

        // Add sneaker and egg to remove list
        let itemsTemp = itemsWeb3RemoveRef.current

        itemsTemp.push({
            contract: NftSneakerAddress.address.toUpperCase(),
            token_id: items[selectedSneaker].token_id,
            web2: true
        })
        itemsTemp.push({
            contract: NftEggAddress.address.toUpperCase(),
            token_id: itemsEggs[chosenEggIndex].token_id,
            web2: true
        })

        itemsTemp = [...itemsWeb3RemoveRef.current, ...itemsTemp]
        setItemsWeb3Remove(itemsTemp)

        // Add SneakerX to web2
        itemsTemp = []
        itemsTemp.push({
            contract: NftSneakerXAddress.address.toUpperCase(),
            name: "Sneaker X",
            metadata: itemsEggs[chosenEggIndex].metadata,
            web2: true
        })

        itemsTemp = [...itemsWeb2Ref.current, ...itemsTemp]
        setItemsWeb2(itemsTemp)

        refreshListWeb3Web2(true)
        setWaitingForBlockchain(true)
    }

    useEffect(() => {
        reveal()
    }, [])
    return (
        <Row className="home reveal">
                {!account ? (
                    <>
                        <Col className="homeCol">
                            {/* <img src={sneakerItem} className="equipImage" /> */}
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
                                        {!eggClicked ? (
                                            // <img src={sneakerItem} className="equipImage" />
                                            <video id="vid" loop autoPlay muted className="equipImage" >
                                                <source src={'Sneaker/32.webm'} type="video/mp4"/>
                                            </video>
                                        ) : (
                                            <video id="vid" loop autoPlay muted className="equipImage" >
                                                <source src={"Sneaker/"+ itemsEggs[chosenEggIndex].metadata + ".webm"} type="video/mp4"/>
                                            </video>
                                        )}
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
                                                            {/* <video id="vid" loop autoPlay muted className="equipImage" >
                                                                <source src={"https://ipfs.io/ipfs/QmY8ascXNak6Asqm6SSCe3p3zkiCWfTaGH5F7N1spmtj8x/" + metadataRef.current}
                                                                type="video/mp4"/>
                                                            </video> */}
                                                            <video id="vid" loop autoPlay muted  className="equipListItem" onClick={() => clickEquip(idx)} >
                                                                <source src={"Egg/"+ item.metadata + ".webm"} type="video/webm"/>
                                                            </video>
                                                            {/* <img src={item.image_url} className="equipListItem" onClick={() => clickEquip(idx)} /> */}
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
                                    {/* <Col className="homeCol">
                                        <img src={videoPlaceholder} className="homeBoxImage" />
                                    </Col>
                                    <Col className="homeCol">
                                        <Row className="">
                                            <div>Equip this Skin?</div>
                                            <div><img src={eggItemEquip} className="homeBoxImage" /></div>
                                            <div className="mintButton" onClick={clickAgree}>Equip</div>
                                        </Row>
                                    </Col> */}
                                </>,
                            '2':
                                <>
                                    {/* <Row className="">
                                        <div className="openingBoxWaiting">Waiting for MetaMask transaction...</div>
                                        <div className="">
                                            <div><img src={videoPlaceholder} className="openingBoxBackground" /></div>
                                        </div>
                                    </Row> */}
                                </>,
                        }[subMenu]
                    }
                    </>
                )}
        </Row>
    );
}
export default Equip