import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import coinLogo from './assets/Coin.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Scratch = ({ account, nft, togglePopup, web3Handler, items }) => {
    const [submenu, setSubmenu] = useState(1)
    const [loading, setLoading] = useState(true)
    const [currentItemIndex, setCurrentItemIndex] = useState(0)
    const [refresh, forceRefresh] = useState(0)

    const nextPage = (direction) => {
        setCurrentItemIndex(currentItemIndex + direction)
    }

    const scratch = async () => {
        let currentItemIndexTemp = currentItemIndex
        console.log("scratch", items[currentItemIndexTemp].token_id)

        try {
            await(await nft.scratch(items[currentItemIndexTemp].token_id)).wait()

            // Scratch GIF
            items[currentItemIndexTemp].isBeingScratched = true
            forceRefresh(refresh + 1)
        } catch (error) {
            console.error("Custom error handling: " + error);
        }
    }

    useEffect(async () => {
        if (!account)
            await web3Handler()
        setLoading(false)
      }, [])
    return (
        <Row className="m-0 p-0 mt-5">
            <div className="m-0 p-0 subNavbarRow">
                <div className={"subNavbarMenu " 
                    + (submenu == 1 ? "selectedSubmenu " : " ") 
                    + (submenu == 1 ? " " : "subNavbarMenuNotSelected ")}>
                    {!items || items.length == 0 ? (
                        <>No Genesis Scratchy Card</>
                    ) : (
                        <>{items[currentItemIndex].name}</>
                    )}
                </div>

                <div className="coinDiv" onClick={() => togglePopup(2)}>
                    <div><img src={coinLogo} className="logoNavbarImg" /></div>
                    <div className={"subCoinMenu"}>0</div>
                </div>
            </div>

            {loading ? (
                <>
                    <div className="scratchCardContainer">
                        <div className="scratchyCard scratchyCardEmpty">
                            <div>Loading...</div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {!items || items.length == 0 ? (
                        <div className="scratchCardContainer">
                            <div className="scratchyCard scratchyCardEmpty">
                                <div>You don't have any<br/>Scratchy Card</div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="scratchCardContainer">
                                {items[currentItemIndex].isScratched ? (
                                    <div className="scratchyCard scratchyCardGenesisAfter">
                                    </div>
                                ) : (
                                    items[currentItemIndex].isBeingScratched ? (
                                        <div className="scratchyCard scratchyCardGenesisDuring">
                                        </div>
                                    ) : (
                                        <div className="scratchyCard scratchyCardGenesisBefore scratchyCardScratchable" onClick={scratch}>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* PAGINATION ARROWS */}
                            <div className="arrowsDiv">
                                {currentItemIndex > 0 ? (
                                    <div className={"leftArrow"} onClick={() => nextPage(-1)}></div>
                                ) : ( <></> )}
                                {items && currentItemIndex < items.length - 1 ? (
                                    <div className={"rightArrow"} onClick={() => nextPage(1)}></div>
                                ) : ( <></> )}
                            </div>
                        </>
                    )}
                    
                </>
            )}


        </Row>
    );
}
export default Scratch