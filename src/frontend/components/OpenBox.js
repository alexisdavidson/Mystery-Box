import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const OpenBox = ({ web3Handler, account, mintButtonAllRarities, mintButtonIslands }) => {
    const clickBox = () => {
        console.log("clickBox")
    }

    return (
        <Row className="home">
            <Col className="homeCol">
                <img src={homeBox} className="homeBoxImage" />
            </Col>
            <Col className="homeCol">
                <Row className="enterTitle">SELECT A MISTERY BOX</Row>
                {!account ? (
                    <Row className="mintButton" onClick={web3Handler}>Connect MetaMask</Row>
                ) : (
                    <Row className="nftList">
                        <Col onClick={clickBox} ><img src={homeBox} className="nftListItem" /></Col>
                        <Col onClick={clickBox} ><img src={homeBox} className="nftListItem" /></Col>
                        <Col onClick={clickBox} ><img src={homeBox} className="nftListItem" /></Col>
                        <Col onClick={clickBox} ><img src={homeBox} className="nftListItem" /></Col>
                        <Col onClick={clickBox} ><img src={homeBox} className="nftListItem" /></Col>
                    </Row>
                )}
            </Col>
        </Row>
    );
}
export default OpenBox