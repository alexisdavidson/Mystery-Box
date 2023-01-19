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
            <Row className="inventoryTitle">Inventory</Row>
            {!account ? (
                <div className="mintButton" onClick={web3Handler}>Connect MetaMask</div>
            ) : (
                <Row className="nftList">
                    <Col onClick={() => clickSneaker(0)} ><img src={homeBox} className="nftListItem" /></Col>
                    <Col onClick={() => clickSneaker(1)} ><img src={homeBox} className="nftListItem" /></Col>
                    <Col onClick={() => clickSneaker(2)} ><img src={homeBox} className="nftListItem" /></Col>
                    <Col onClick={() => clickSneaker(3)} ><img src={homeBox} className="nftListItem" /></Col>
                    <Col></Col>
                </Row>
            )}
        </Row>
    );
}
export default Inventory