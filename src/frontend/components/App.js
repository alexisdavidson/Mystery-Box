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
const refreshRate = 60000

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
  const [itemsWeb2, setItemsWeb2] = useState([])
  const [itemsWeb3, setItemsWeb3] = useState([])
  const [itemsWeb3Remove, setItemsWeb3Remove] = useState([])
  const [transactionFinished, setTransactionFinished] = useState(false)
  const [transactionObjectId, setTransactionObjectId] = useState(0)
  const [selectedSneaker, setSelectedSneaker] = useState(0)
  const [eggLootMetadata, setEggLootMetadata] = useState(1)
  const [chosenEggIndex, setChosenEggIndex] = useState(0)
  
  const [nftEgg, setNftEgg] = useState({})
  const [nftSneaker, setNftSneaker] = useState({})
  const [nftSneakerX, setNftSneakerX] = useState({})
  const [nftBox, setNftBox] = useState({})
  const [equip, setEquip] = useState({})
  const [usdc, setUsdc] = useState({})
  const [intervalVariable, setIntervalVariable] = useState(null)
  const [didntAccept, setDidntAcccept] = useState(false)
  const [waitingForBlockchain, setWaitingForBlockchain] = useState(false)

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
  metadataRef.current = eggLootMetadata;
  const intervalRef = useRef();
  intervalRef.current = intervalVariable;
  const menuRef = useRef();
  menuRef.current = menu;
  const itemsRef = useRef();
  itemsRef.current = items;
  const itemsWeb2Ref = useRef();
  itemsWeb2Ref.current = itemsWeb2;
  const itemsWeb3Ref = useRef();
  itemsWeb3Ref.current = itemsWeb3;
  const itemsWeb3RemoveRef = useRef();
  itemsWeb3RemoveRef.current = itemsWeb3Remove;

  const zeroPad = (num, places) => String(num).padStart(places, '0')

  function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
      reveals[i].classList.add("active");
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 0;
      if (elementTop < windowHeight - elementVisible || true) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }

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
    refreshListWeb3Web2()

    setIntervalVariable(setInterval(() => {
      refreshListWeb3Web2()
    }, refreshRate))
  }

  const loadWeb3Items = async () => {
    const boxes = await loadOpenSeaItems(accountRef.current, nftBoxRef.current)
    await new Promise(r => setTimeout(r, 1000));
    const sneakers = await loadOpenSeaItems(accountRef.current, nftSneakerRef.current)
    await new Promise(r => setTimeout(r, 1000));
    const eggs = await loadOpenSeaItems(accountRef.current, nftEggRef.current)
    await new Promise(r => setTimeout(r, 1000));
    const sneakerXs = await loadOpenSeaItems(accountRef.current, nftSneakerXRef.current)
    let itemsTemp = []
    itemsTemp = [...itemsTemp, ...compactOpenSeaList(boxes)]
    itemsTemp = [...itemsTemp, ...compactOpenSeaList(sneakers)]
    itemsTemp = [...itemsTemp, ...compactOpenSeaList(eggs)]
    itemsTemp = [...itemsTemp, ...compactOpenSeaList(sneakerXs)]

    setItemsEggs(compactOpenSeaList(eggs))

    setItemsWeb3(itemsTemp)
  }

  function getFilename (url) {
    return url?.split('/')?.pop()?.replace('.json', '') ?? "1";
  }

  const compactOpenSeaList = (list) => {
    let compactList = []
    for(let i = 0; i < list.length; i++) {
      compactList.push({
        contract: list[i].asset_contract.address.toUpperCase(),
        name: list[i].name,
        token_id: list[i].token_id,
        image_url: list[i].image_url,
        creator: list[i].traits.filter(e => e.trait_type == "CREATOR")[0]?.value ?? "",
        metadata: getFilename(list[i].token_metadata),
        web2: false
      })
      console.log("getFilename", getFilename(list[i].token_metadata))
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
      console.log("Egg MintSuccessful", parseInt(metadata), user, acc);
      if (user.toLowerCase() == acc.toLowerCase()) {
        setEggLootMetadata(parseInt(metadata))
        metadataRef.current = parseInt(metadata)
        setMenu(4)
        menuRef.current = 4

        // Add Blank sneaker and Egg 
        let itemsTemp = []

        itemsTemp.push({
          contract: NftEggAddress.address.toUpperCase(),
          name: "Egg",
          token_id: -1,
          image_url: "",
          creator: "",
          metadata: metadata,
          web2: true
        })

        itemsTemp.push({
          contract: NftSneakerAddress.address.toUpperCase(),
          name: "Blank Sneaker",
          token_id: -1,
          image_url: "https://i.seadn.io/gcs/files/d9ec2e22bc9ee479fb510b74f1ad6c60.png?w=500&auto=format",
          creator: "",
          metadata: 0,
          web2: true
        })

        itemsTemp = [...itemsWeb2Ref.current, ...itemsTemp]
        setItemsWeb2(itemsTemp)
        refreshListWeb3Web2(itemsTemp)
      }
    });
  }

  const refreshListWeb3Web2 = async (ignoreWeb3) => {
    const lastItemsWeb3Length = itemsWeb3Ref.current.length
    console.log("lastItemsWeb3Length", lastItemsWeb3Length)

    if (ignoreWeb3 == null)
      await loadWeb3Items()

    console.log("refreshListWeb3Web2 start:")
    console.log("itemsTempWeb2")
    console.log(itemsWeb2Ref.current)
    console.log("itemsRef.current")
    console.log(itemsRef.current)
    console.log("itemsWeb3Ref.current")
    console.log(itemsWeb3Ref.current)
    let itemsTemp = [...itemsWeb3Ref.current]

    // Remove all items that have been opened / consumed
    let itemsRemoved = itemsWeb3RemoveRef.current
    for(let i = 0; i < itemsRemoved.length; i++) {
      for(let j = 0; j < itemsTemp.length; j++) {
        // Same contract and same Id
        if (itemsRemoved[i].contract == itemsTemp[j].contract
            && itemsRemoved[i].token_id == itemsTemp[j].token_id) {
              itemsTemp.splice(j, 1)
              j--
            }
      }
    }

    // If we got new items coming in, remove all web2 items
    if (itemsWeb2Ref.current.length > 0) {
      if (itemsWeb3Ref.current.length > lastItemsWeb3Length) {
        setItemsWeb2([])
        setWaitingForBlockchain(false)
      } else { // Otherwise keep them and append them
        itemsTemp = [...itemsWeb2Ref.current, ...itemsTemp]
        setWaitingForBlockchain(true)
      }
    } else {
      setItemsWeb2([])
      setWaitingForBlockchain(false)
    }

    setItems(itemsTemp)

    console.log("refreshListWeb3Web2 result:")
    console.log(itemsTemp)
  }
  
  const mintButton = async (quantity, boxId, price) => {
    console.log("mintButton", quantity, boxId, price)

    setTransactionFinished(false)
    setTransactionObjectId(0)
    setMenu(1)

    await(await usdc.approve(nftBox.address, toWei(price * quantity))).wait()
    // await(await usdc.approve(nftBox.address, toWei(price * quantity * 10))).wait()
    await(await nftBox.mint(boxId, quantity)).wait()

    let itemsTemp = []
    for(let i = 0; i < quantity; i++) {
      itemsTemp.push({
        contract: NftBoxAddress.address.toUpperCase(),
        name: "Mystery Box",
        token_id: -1,
        image_url: "",
        creator: "",
        metadata: boxId + 1,
        web2: true
      })
    }
    itemsTemp = [...itemsWeb2Ref.current, ...itemsTemp]
    setItemsWeb2(itemsTemp)
    refreshListWeb3Web2(true)
    setWaitingForBlockchain(true)
    
    setTransactionFinished(true)
  }

  useEffect(async () => {
    return () => {
      nftEgg?.removeAllListeners("MintSuccessful");
      nftSneakerX?.removeAllListeners("MintSuccessful");
      clearInterval(intervalRef.current);
    };
  }, [])

  return (
    <BrowserRouter>
      <div className="App" id="wrapper">
        <div className="m-0 p-0 container-fluid">
            <Navigation account={account} setMobileMenu={setMobileMenu} setMenu={setMenu}
             didntAccept={didntAccept} waitingForBlockchain={waitingForBlockchain}  />
            {account ? (
              <div className="menuMobile">
                <div onClick={() => setMenu(2)} className="inventoryButton">Inventory</div>
                {waitingForBlockchain ? (
                    <div className="waitingBlockchain">Waiting Blockchain</div>
                ) : ( <></> )}
              </div>
            ) : (
              <></>
            )}
            {
              {
              '0': <Home web3Handler={web3Handler} account={account} mintButton={mintButton} reveal={reveal} 
              setDidntAcccept={setDidntAcccept} didntAccept={didntAccept} />,
              '1': <BoxWaitingTransaction transactionFinished={transactionFinished} transactionObjectId={transactionObjectId} 
              reveal={reveal} setMenu={setMenu} />,
              '2': <Inventory web3Handler={web3Handler} account={account} balance={balance} setMenu={setMenu} 
                    setSelectedSneaker={setSelectedSneaker} setTransactionObjectId={setTransactionObjectId} 
                    setTransactionFinished={setTransactionFinished} items={items} nftBox={nftBox} reveal={reveal}
                    setEggLootMetadata={setEggLootMetadata} itemsWeb3RemoveRef={itemsWeb3RemoveRef} 
                    setItemsWeb3Remove={setItemsWeb3Remove} refreshListWeb3Web2={refreshListWeb3Web2} 
                    setWaitingForBlockchain={setWaitingForBlockchain} />,
              '3': <Equip web3Handler={web3Handler} account={account} balance={balance} setMenu={setMenu} 
                    setTransactionObjectId={setTransactionObjectId} setTransactionFinished={setTransactionFinished} 
                    itemsEggs={itemsEggs} items={items} equip={equip} selectedSneaker={selectedSneaker} 
                    reveal={reveal} chosenEggIndex={chosenEggIndex} setItemsWeb2={setItemsWeb2} itemsWeb2Ref={itemsWeb2Ref} 
                    setChosenEggIndex={setChosenEggIndex} itemsWeb3RemoveRef={itemsWeb3RemoveRef} 
                    setItemsWeb3Remove={setItemsWeb3Remove} refreshListWeb3Web2={refreshListWeb3Web2} 
                    setWaitingForBlockchain={setWaitingForBlockchain} />,
              '4': <BoxOpenResult setMenu={setMenu}  reveal={reveal} itemsEggs={itemsEggs} eggLootMetadata={eggLootMetadata} />,
              '5': <EquipResult reveal={reveal} chosenEggIndex={chosenEggIndex} 
                    itemsEggs={itemsEggs}/>,
              }[menu]
            }
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
