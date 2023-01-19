import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import MintCard from './MintCard'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Mint = ({ account, nft, web3Handler, balance, setMenu }) => {
    const [submenu, setSubmenu] = useState(1)
    const [subpage, setSubpage] = useState(1)


    const nextPage = (direction) => {
        setSubpage(subpage + direction)
    }

    return (
        <Row className="m-0 p-0 mint">
            <div className="subNavbarMenuRow">
                <div className={"subNavbarMenu " 
                    + (submenu == 1 ? "selectedSubmenu " : " ") 
                    + (submenu == 1 ? " " : "subNavbarMenuNotSelected ")}
                    onClick={() => setSubmenu(1)} >
                    Genesis Scratchy Card
                </div>
                <div className={"subNavbarMenu " 
                    + (submenu == 2 ? "selectedSubmenu " : " ") 
                    + (submenu == 2 ? " " : "subNavbarMenuNotSelected ")}
                    onClick={() => setSubmenu(2)} >
                    Seasonal Scratchy Card
                </div>
            </div>
            {submenu == 1 ? (
                <MintCard account={account} web3Handler={web3Handler} nft={nft} balance={balance} setMenu={setMenu}
                    cardClass="scratchyCardGenesis" mintActivated={false}
                    infoPrice="FREE MINT (2 PER WALLET)" infoDate="21 JANUARY 2023" infoTime="12PM UTC"
                    infoTotal="10,000 CARDS" infoNetwork="ETHEREUM" infoWhitelist="NO / FCFS" infoUtility="PROOF OF SCRATCH"
                    infoPrize="FREE MINT SPOT FOR SEASONAL SCRATCHY CARD"
                    infoRoadmap="CLICK 'SEASONAL SCRATCHY CARD' BUTTON ABOVE" 
                    mobileTitle="GENESIS" />
            ) : (
                <>
                    {/* PAGINATION ARROWS */}
                    <div className="arrowsDiv displayDesktop">
                        {subpage > 1 ? (
                            <div className={"leftArrow"} onClick={() => nextPage(-1)}></div>
                        ) : ( <></> )}
                        {subpage < 4 ? (
                            <div className={"rightArrow"} onClick={() => nextPage(1)}></div>
                        ) : ( <></> )}
                    </div>

                    {/* CONTENT */}
                    {
                        {
                            '1': <MintCard account={account} web3Handler={web3Handler} setMenu={setMenu}
                                cardClass="scratchyCard1" mintActivated={false} nextPage={nextPage} subpage={subpage}
                                infoPrice="FREE MINT" infoType="SEASON 1 SCRATCHY CARD" infoDate="31 JANUARY 2023" infoTime="12PM UTC"
                                infoTotal="5,000 CARDS" infoNetwork="ETHEREUM" infoWhitelist="SCRATCH 2 GENESIS SCRATCHY CARD TO MINT 1 SEASON 1 SCRATCHY CARD"
                                infoUtility="SCRATCH & WIN $COIN"
                                infoPrize="UP TO 200 $COIN" 
                                mobileTitle="SEASON 1" />,
                            '2': <MintCard account={account} web3Handler={web3Handler} setMenu={setMenu}
                                cardClass="scratchyCard2" mintActivated={false} nextPage={nextPage} subpage={subpage}
                                infoPrice="FREE MINT" infoType="SEASON 2 SCRATCHY CARD" infoDate="11 FEBRUARY 2023" infoTime="12PM UTC"
                                infoTotal="2,500 CARDS" infoNetwork="ETHEREUM" infoWhitelist="SCRATCH 2 GENESIS SCRATCHY CARD & 2 SEASON 1 SCRATCHY CARD TO MINT 1 SEASON 2 SCRATCHY CARD"
                                infoUtility="SCRATCH & WIN PRIZE"
                                infoPrize="MYSTERIOUS" 
                                mobileTitle="SEASON 2" />,
                            '3': <MintCard account={account} web3Handler={web3Handler} setMenu={setMenu}
                                cardClass="scratchyCardQuestion" cardText="?" mintActivated={false} nextPage={nextPage} subpage={subpage}
                                infoPrice="FREE MINT" infoType="SEASON 3 SCRATCHY CARD" infoDate="21 FEBRUARY 2023" infoTime="12PM UTC"
                                infoTotal="1,250 CARDS" infoNetwork="ETHEREUM"
                                infoWhitelist="???"
                                infoUtility="???"
                                infoPrize="???" 
                                mobileTitle="SEASON 3" />,
                            '4': <MintCard account={account} web3Handler={web3Handler} setMenu={setMenu}
                                cardClass="scratchyCardQuestion" cardText="?" mintActivated={false} nextPage={nextPage} subpage={subpage}
                                infoPrice="FREE MINT" infoType="SEASON 4 ONWARDS" infoDate="???" infoTime="???"
                                infoTotal="???" infoNetwork="ETHEREUM"
                                infoWhitelist="AMOUNT OF MINT BASED ON THE ??? GENESIS SCRATCHY CARD???"
                                infoUtility="???"
                                infoPrize="???" 
                                mobileTitle="SEASON 4" />,
                        } [subpage]
                    }
                </>
            )}
        </Row>
    );
}
export default Mint