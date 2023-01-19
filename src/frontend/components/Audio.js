import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Audio = ({  }) => {
    const [audioPlaying, setAudioPlaying] = useState(false)

    const clickAudio = () => {
        setAudioPlaying(!audioPlaying)

        if (!audioPlaying) {
            console.log("Start audio")
            document.getElementById('audio').play()
        }
        else {
            console.log("Pause audio")
            document.getElementById('audio').pause()
        }
    }
    return (
        <div className={"audioDiv"} onClick={clickAudio}>
            <div className={!audioPlaying ? "audioButtonPlay" : "audioButtonStop"} >
                <audio id="audio"><source src="audio.mp3" type="audio/mp3"></source></audio>
            </div>
        </div>
    );
}
export default Audio