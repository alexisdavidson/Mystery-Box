import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import homeBox from './assets/homeBox.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Home = ({  }) => {
    const [audioPlaying, setAudioPlaying] = useState(false)

    return (
        <Row className="home">
            <Col className="homeCol">
                <img src={homeBox} className="homeBoxImage" />
            </Col>
            <Col className="homeCol">
                <div className="enterTitle">ENTER</div>
                <div className="mintButton">Connect MetaMask</div>
            </Col>
        </Row>
    );
}
export default Home