import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button, Form } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Home = ({ web3Handler, account, mintButton, reveal, setDidntAcccept, didntAccept }) => {
    const [quantities, setQuantities] = useState([1, 1])
    const [forcerender, setForceRender] = useState(0)

    const clickArrow = (direction, selectorId) => {
        console.log("clickArrow", direction, selectorId)
        if (quantities[selectorId] + direction > 0) {
            let tempQuantities = quantities
            tempQuantities[selectorId] = tempQuantities[selectorId] + direction
            setQuantities(tempQuantities)
            setForceRender(forcerender + 1)
        }
    }

    const clickConnect = () => {
        console.log("clickConnect")
        var element = document.getElementById('default-checkbox');
        console.log(element.checked)

        if (element.checked)
            web3Handler()
        else {
            element.classList.add('checkboxRed');
            setDidntAcccept(true)
        }
    }

    useEffect(() => {
        reveal()
    }, [])
    return (
        <Row className="home reveal">
            <Col className="homeCol">
                {/* <img src={homeBox} className="homeBoxImage" /> */}
                <video id="vid" loop autoPlay muted className="homeBoxImage" >
                    <source src="/Cube.webm" type="video/webm"/>
                </video>
            </Col>
            <Col className="homeCol">
                <div className="enterTitle topTitleTextEffect">
                    <div className="topDescriptionFirst">
                        <div className="topDescriptionFirst1">JOIN</div>
                        <div className="topDescriptionFirst2">the</div>
                    </div>
                    <div className="topDescriptionSecond">ORIGIN</div>
                </div>
                {!account ? (
                    <div>
                        {didntAccept ? (
                            <div className="acceptTCAlertMobile">Accept T&C</div>
                        ) : (
                            <></>
                        )}
                        <div className="connectButton" onClick={clickConnect}>Connect Metamask</div>
                    </div>
                ) : (
                    <div className="mintButtonsDiv">
                        <div className="mintButtonDiv">
                            <div className="mintQuantitySelector">
                                <div id="selector-0" className="mintQuantitySelectorValue">
                                    {quantities[0]}
                                </div>
                                <div className="mintQuantitySelectorArrows">
                                    <div className="mintQuantitySelectorArrowUp" onClick={() => clickArrow(1,0)} >
                                    </div>
                                    <div className="mintQuantitySelectorArrowDown" onClick={() => clickArrow(-1,0)} >
                                    </div>
                                </div>
                            </div>
                            <div className="mintButton" onClick={() => mintButton(quantities[0], 0, 80)}>
                                <div className="mintButtonText">Buy Origin Box</div>
                                <div className="mintButtonPrice">$80</div>
                            </div>
                        </div>
                        <div className="mintButtonDiv">
                            <div className="mintQuantitySelector">
                                <div id="selector-1" className="mintQuantitySelectorValue">
                                    {quantities[1]}
                                </div>
                                <div className="mintQuantitySelectorArrows">
                                    <div className="mintQuantitySelectorArrowUp" onClick={() => clickArrow(1,1)} >
                                    </div>
                                    <div className="mintQuantitySelectorArrowDown" onClick={() => clickArrow(-1,1)} >
                                    </div>
                                </div>
                            </div>
                            <div className="mintButton" onClick={() => mintButton(quantities[1], 1, 350)}>
                                <div className="mintButtonText">Buy Origin Box Islands</div>
                                <div className="mintButtonPrice">$350</div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="homeBelowButton">
                    <div className="">Get yours on <a href="https://testnets.opensea.io/collection/mystery-box-20" target="_blank">OpenSea</a> using your <span style={{fontWeight: "bold", color: "white", fontStyle: "italic"}}>credit card.</span></div>
                    {!account ? (
                        <div className="mt-3">
                            <Form.Check className="checkboxForm"
                                type="checkbox"
                                id="default-checkbox"
                                label={(<>I have read and accept the <a href="https://www.musure.world/en/terms-and-conditions">Terms & Conditions.</a></>)}
                            />
                            
                        </div>
                    ) : (
                        <div className="mt-2" style={{fontSize: "0.7rem"}}>
                            Verified Creators Creations are in all the boxes.
                            <br/>Islands Box only Opens the Origin Lands Creations.
                        </div>
                    )}
                </div>
            </Col>
            <div className="homeEffect1"></div>
            <div className="homeEffect2"></div>
        </Row>
    );
}
export default Home