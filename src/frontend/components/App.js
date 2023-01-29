import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';
import Navigation from './Navigation';
import Home from './Home'
import Inventory from './Inventory'
import BoxWaitingTransaction from './BoxWaitingTransaction'
import BoxOpenResult from './BoxOpenResult'
import Equip from './Equip'
import EquipResult from './EquipResult'

import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'

import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import configContract from "./configContract.json";

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const totalSupply = 5000

function App() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [supplyLeft, setSupplyLeft] = useState(totalSupply)
  const [price, setPrice] = useState(0.01)
  const [nft, setNFT] = useState({})
  const [mobileMenu, setMobileMenu] = useState(false)
  const [menu, setMenu] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [amountMinted, setAmountMinted] = useState(0)
  const [provider, setProvider] = useState({})
  const [items, setItems] = useState(null)
  const [transactionFinished, setTransactionFinished] = useState(false)

  const providerRef = useRef();
  providerRef.current = provider;
  const quantityRef = useRef();
  quantityRef.current = quantity;
  const balanceRef = useRef();
  balanceRef.current = balance;
  const supplyLeftRef = useRef();
  supplyLeftRef.current = supplyLeft;
  const amountMintedRef = useRef();
  amountMintedRef.current = amountMinted;
  const nftRef = useRef();
  nftRef.current = nft;
  const accountRef = useRef();
  accountRef.current = account;

  const zeroPad = (num, places) => String(num).padStart(places, '0')

  const buttonLinkOnClick = async (elementId) => {
    console.log("buttonLinkOnClick: " + elementId)
    var ex = document.getElementById(elementId);
    ex.click();
  }

  const clickQuitMenu = () => {
    console.log("clickQuitMenu")
    setMobileMenu(false)
  }

  const changeQuantity = (direction) => {
      if (quantity + direction < 1)
          setQuantity(1)
      else if (quantity + direction > 2)
          setQuantity(2)
      else
          setQuantity(quantity + direction)
  }

  const web3Handler = async () => {
    setAccount("123")
    return
    
    const providerTemp = new ethers.providers.Web3Provider(window.ethereum)
    const { chainId } = await providerTemp.getNetwork()
    console.log("chainId", chainId)
    if (chainId != 5) { // Goerli Chain ID: 5
      await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x5' }], // chainId must be in HEX with 0x in front
      });
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    await loadContracts(accounts[0])
    
    setAccount(accounts[0])
    loadOpenSeaItems(accounts[0], nftRef.current)
  }

  const loadOpenSeaItems = async (acc, nft) => {
    let itemsOpenSea = await fetch(`${configContract.OPENSEA_API_TESTNETS}/assets?owner=${acc}&asset_contract_address=${nft.address}&format=json`)
    .then((res) => res.json())
    .then((res) => {
      console.log("OS length:", res?.assets?.length)
      return res.assets
    })
    .catch((e) => {
      console.error(e)
      console.error('Could not talk to OpenSea')
      return null
    })

    let itemsScratched = await nft.getScratched(acc)
    let items = []
    for(let i = 0; i < itemsScratched.length; i ++) {
      items.push({})
      items[i].name = "GENESIS SCRATCHY CARD #" + zeroPad(parseInt(itemsScratched[i]), 4);
      items[i].token_id = parseInt(itemsScratched[i]);
      items[i].isScratched = true;
    }

    for(let i = 0; i < itemsOpenSea?.length; i ++) {
      let alreadyInList = false
      for(let j = 0; j < itemsScratched.length; j ++) {
        if (parseInt(itemsOpenSea[i].token_id) == parseInt(itemsScratched[j]))
          alreadyInList = true
      }

      if (!alreadyInList) {
        items.push({
          name: itemsOpenSea[i].name,
          token_id: itemsOpenSea[i].token_id,
          isScratched: false
        })
      }
    }
    

    function compare( a, b ) {
      if ( a.token_id < b.token_id ){
        return -1;
      }
      if ( a.token_id > b.token_id ){
        return 1;
      }
      return 0;
    }

    items.sort(compare)
    console.log(items)
    setItems(items)
  }

  const mintFinished = async (nft) => {
      console.log("mintFinished: " + quantityRef.current)
      setSupplyLeft(supplyLeftRef.current - quantityRef.current)
      setBalance(balanceRef.current + quantityRef.current)
      // setBeanToUse(amountMintedRef.current)
  }

  const loadContracts = async (acc) => {
    console.log("loadContracts")
    const providerTemp = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(providerTemp)
    const signer = providerTemp.getSigner()

    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    const amountMintedTemp = parseInt(await nft.totalSupply())/* + parseInt(await nft.burnAmount())*/
    setAmountMinted(amountMintedTemp)
    const supplyLeftTemp = totalSupply - amountMintedTemp
    console.log("tickets left: " + supplyLeftTemp)
    setSupplyLeft(supplyLeftTemp)
    setPrice(fromWei(await nft.getPrice(0)))
    const balanceTemp = parseInt(await nft.balanceOf(acc))
    console.log("balance", balanceTemp)
    setBalance(balanceTemp)
    setNFT(nft)
    nft.on("MintSuccessful", (user) => {
        console.log("MintSuccessful");
        console.log(user);
        console.log(acc);
        if (user.toLowerCase() == acc.toLowerCase()) {
          mintFinished(nft);
        }
    });

    console.log("nft address: " + nft.address)
  }
  
  const mintButtonAllRarities = async () => {
    console.log("mintButtonAllRarities")

    setTransactionFinished(false)
    setMenu(1)

    await new Promise(r => setTimeout(r, 2000));
    setTransactionFinished(true)
  }
  
  const mintButtonIslands = async () => {
    console.log("mintButtonIslands")
    
    setTransactionFinished(false)
    setMenu(1)

    await new Promise(r => setTimeout(r, 2000));
    setTransactionFinished(true)
  }

  const setSelectedSneaker = async (selectedSneaker) => {
    console.log("setSelectedSneaker", selectedSneaker)
    
    // setMenu(1)
  }

  useEffect(async () => {
    return () => {
      nft?.removeAllListeners("MintSuccessful");
    };
  }, [])

  return (
    <BrowserRouter>
      <div className="App" id="wrapper">
        <div className="m-0 p-0 container-fluid">
            <Navigation account={account} setMobileMenu={setMobileMenu} setMenu={setMenu} />
            {account ? (
              <div className="menuMobile">
                <div onClick={() => setMenu(2)} className="inventoryButton">Inventory</div>
              </div>
            ) : (
              <></>
            )}
            {
              {
              '0': <Home web3Handler={web3Handler} account={account} mintButtonAllRarities={mintButtonAllRarities}
                    mintButtonIslands={mintButtonIslands} />,
              '1': <BoxWaitingTransaction transactionFinished={transactionFinished} />,
              '2': <Inventory web3Handler={web3Handler} account={account} nft={nft} balance={balance} setMenu={setMenu} 
                    setSelectedSneaker={setSelectedSneaker}/>,
              '3': <Equip web3Handler={web3Handler} account={account} nft={nft} balance={balance} setMenu={setMenu} />,
              '4': <BoxOpenResult setMenu={setMenu} transactionFinished={transactionFinished} />,
              '5': <EquipResult setMenu={setMenu} transactionFinished={transactionFinished} />,
              }[menu]
            }
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
