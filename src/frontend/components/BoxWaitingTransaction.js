import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const BoxWaitingTransaction = ({ transactionFinished }) => {

    const checkNumber = () => {
        return transactionFinished ? "1" : "0"
    }

    return (
        <Row className="m-0 p-0">
            {transactionFinished ? (
                <>
                    <div className="openingBoxCongratulationsTitle">Congratulations!</div>
                    <div className="openingBoxCongratulationsDesc">Welcome to MUSURE world and our Verified Creators! ⛩️</div>
                </>
            ) : (
                <>
                </>
            )}
            <div className="">
                <div>
                    {/* <img src={homeBox} className="openingBoxBackground" /> */}
                    {/* <img src={homeBox} className="homeBoxImage" /> */}

                    <video id="vid" loop autoPlay muted className="homeBoxImage" >
                        <source src="/Cube.webm" type="video/webm"/>
                    </video>
                </div>
            </div>
            <div className="openingBoxWaitingDiv">
                <div className="openingBoxWaiting">{checkNumber()}/1 Waiting for MetaMask transaction</div>
            </div>
        </Row>
    );
}
export default BoxWaitingTransaction