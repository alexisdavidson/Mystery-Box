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

import NftBoxAbi from '../contractsData/NftBox.json'
import NftBoxAddress from '../contractsData/NftBox-address.json'
import NftEggAbi from '../contractsData/NftEgg.json'
import NftEggAddress from '../contractsData/NftEgg-address.json'
import NftSneakerAbi from '../contractsData/NftSneaker.json'
import NftSneakerAddress from '../contractsData/NftSneaker-address.json'
import NftSneakerXAbi from '../contractsData/NftSneakerX.json'
import NftSneakerXAddress from '../contractsData/NftSneakerX-address.json'
import EquipAbi from '../contractsData/Equip.json'
import EquipAddress from '../contractsData/Equip-address.json'
import Erc20UsdcAbi from '../contractsData/Erc20Usdc.json'
import Erc20UsdcAddress from '../contractsData/Erc20Usdc-address.json'
import configContract from "./configContract.json";

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const totalSupply = 5000

function App() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [supplyLeft, setSupplyLeft] = useState(totalSupply)
  const [price, setPrice] = useState(0.01)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [menu, setMenu] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [amountMinted, setAmountMinted] = useState(0)
  const [provider, setProvider] = useState({})
  const [items, setItems] = useState([])
  const [itemsEggs, setItemsEggs] = useState([])
  const [transactionFinished, setTransactionFinished] = useState(false)
  const [transactionObjectId, setTransactionObjectId] = useState(0)
  const [selectedSneaker, setSelectedSneaker] = useState(0)
  const [metadata, setMetadata] = useState(0)
  
  const [nftEgg, setNftEgg] = useState({})
  const [nftSneaker, setNftSneaker] = useState({})
  const [nftSneakerX, setNftSneakerX] = useState({})
  const [nftBox, setNftBox] = useState({})
  const [equip, setEquip] = useState({})
  const [usdc, setUsdc] = useState({})

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
  const nftBoxRef = useRef();
  nftBoxRef.current = nftBox;
  const nftEggRef = useRef();
  nftEggRef.current = nftEgg;
  const nftSneakerRef = useRef();
  nftSneakerRef.current = nftSneaker;
  const nftSneakerXRef = useRef();
  nftSneakerXRef.current = nftSneakerX;
  const accountRef = useRef();
  accountRef.current = account;
  const metadataRef = useRef();
  metadataRef.current = metadata;

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
    loadAllItems(accounts[0])
  }

  const loadAllItems = async (acc) => {
    const boxes = await loadOpenSeaItems(acc, nftBoxRef.current)
    await new Promise(r => setTimeout(r, 1000));
    const sneakers = await loadOpenSeaItems(acc, nftSneakerRef.current)
    await new Promise(r => setTimeout(r, 1000));
    const eggs = await loadOpenSeaItems(acc, nftEggRef.current)
    let itemsTemp = []
    itemsTemp = [...itemsTemp, ...compactOpenSeaList(boxes)]
    itemsTemp = [...itemsTemp, ...compactOpenSeaList(sneakers)]
    // itemsTemp = [...itemsTemp, ...compactOpenSeaList(eggs)]

    console.log(itemsTemp)
    setItems(itemsTemp)
    setItemsEggs(compactOpenSeaList(eggs))
  }

  const compactOpenSeaList = (list) => {
    let compactList = []
    for(let i = 0; i < list.length; i++) {
      compactList.push({
        contract: list[i].asset_contract.address.toUpperCase(),
        name: list[i].name,
        token_id: list[i].token_id,
        image_url: list[i].image_url,
        creator: "CREATORS NAME"
      })
    }
    return compactList
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
    console.log("itemsOpenSea", itemsOpenSea)
    return itemsOpenSea
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

    const nftBox = new ethers.Contract(NftBoxAddress.address, NftBoxAbi.abi, signer)
    const nftEgg = new ethers.Contract(NftEggAddress.address, NftEggAbi.abi, signer)
    const nftSneaker = new ethers.Contract(NftSneakerAddress.address, NftSneakerAbi.abi, signer)
    const nftSneakerX = new ethers.Contract(NftSneakerXAddress.address, NftSneakerXAbi.abi, signer)
    const equip = new ethers.Contract(EquipAddress.address, EquipAbi.abi, signer)
    const usdc = new ethers.Contract(Erc20UsdcAddress.address, Erc20UsdcAbi.abi, signer)

    setNftEgg(nftEgg)
    setNftSneaker(nftSneaker)
    setNftSneakerX(nftSneakerX)
    setNftBox(nftBox)
    setEquip(equip)
    setUsdc(usdc)
    console.log("nftEgg address: " + nftEgg.address)
    console.log("nftSneaker address: " + nftSneaker.address)
    console.log("nftSneakerX address: " + nftSneakerX.address)
    console.log("nftBox address: " + nftBox.address)
    console.log("equip address: " + equip.address)
    console.log("usdc address: " + usdc.address)
    
    nftEgg.on("MintSuccessful", (user, metadata) => {
      console.log("Egg MintSuccessful", metadata, user, acc);
      if (user.toLowerCase() == acc.toLowerCase()) {
        setMetadata(metadata);
        metadataRef.current = metadata
        setMenu(4)
      }
    });
    nftSneakerX.on("MintSuccessful", (user, metadata) => {
      console.log("SneakerX MintSuccessful", metadata, user, acc);
      if (user.toLowerCase() == acc.toLowerCase()) {
        setMetadata(metadata);
        metadataRef.current = metadata
        setMenu(5)
      }
    });
  }
  
  const mintButtonAllRarities = async (quantity) => {
    console.log("mintButtonAllRarities", quantity)

    setTransactionFinished(false)
    setTransactionObjectId(0)
    setMenu(1)

    await(await nftBox.mint(0, quantity)).wait()
    
    setTransactionFinished(true)
  }
  
  const mintButtonIslands = async (quantity) => {
    console.log("mintButtonIslands", quantity)
    
    setTransactionFinished(false)
    setTransactionObjectId(0)
    setMenu(1)

    await(await nftBox.mint(1, quantity)).wait()

    setTransactionFinished(true)
  }

  useEffect(async () => {
    return () => {
      // nft?.removeAllListeners("MintSuccessful");
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
              '1': <BoxWaitingTransaction transactionFinished={transactionFinished} transactionObjectId={transactionObjectId} />,
              '2': <Inventory web3Handler={web3Handler} account={account} balance={balance} setMenu={setMenu} 
                    setSelectedSneaker={setSelectedSneaker} setTransactionObjectId={setTransactionObjectId} 
                    setTransactionFinished={setTransactionFinished} items={items} nftBox={nftBox} 
                    setMetadata={setMetadata} />,
              '3': <Equip web3Handler={web3Handler} account={account} balance={balance} setMenu={setMenu} 
                    setTransactionObjectId={setTransactionObjectId} setTransactionFinished={setTransactionFinished} 
                    itemsEggs={itemsEggs} items={items} equip={equip} selectedSneaker={selectedSneaker} 
                    setMetadata={setMetadata} />,
              '4': <BoxOpenResult setMenu={setMenu} />,
              '5': <EquipResult metadataRef={metadataRef} />,
              }[menu]
            }
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
