import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import videoPlaceholder from './assets/videoPlaceholder.png'

const EquipResult = ({ reveal, chosenEggIndex, itemsEggs }) => {

    useEffect(() => {
        reveal()
    }, [])
    return (
        <Row className="m-0 p-0 reveal">
            <Row className="openingBoxCongratulationsTitle">
                <div>
                    Congratulations!
                </div>
            </Row>
            <Row className="openingBoxCongratulationsDesc">
                <div>
                    You already have your Metaverse Sneakers. ⛩️ We are the future. 🌐
                </div>
            </Row>
            <Row className="m-0 p-0">
                <div className="mt-5">
                    {/* <video id="vid" loop autoPlay muted className="equipImage" >
                        <source src={"https://ipfs.io/ipfs/QmY8ascXNak6Asqm6SSCe3p3zkiCWfTaGH5F7N1spmtj8x/" + metadataRef.current}
                        type="video/mp4"/>
                    </video> */}
                    {/* <img src={videoPlaceholder} className="equipImage" /> */}
                    <video id="vid" loop autoPlay muted className="equipImage" >
                        <source src={"Sneaker/"+ itemsEggs[chosenEggIndex].metadata + ".webm"} type="video/mp4"/>
                    </video>
                </div>
            </Row>
        </Row>
    );
}
export default EquipResult