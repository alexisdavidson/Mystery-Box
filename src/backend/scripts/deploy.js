const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

// import NftBoxAbi from '../../frontend/contractsData/NftBox.json'
// import NftBoxAddress from '../../frontend/contractsData/NftBox-address.json'

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", fromWei(await deployer.getBalance()));
  
  const NftBox = await ethers.getContractFactory("NftBox");
  const NftEgg = await ethers.getContractFactory("NftEgg");
  const NftSneaker = await ethers.getContractFactory("NftSneaker");
  const NftSneakerX = await ethers.getContractFactory("NftSneakerX");
  const Equip = await ethers.getContractFactory("Equip");
  const Usdc = await ethers.getContractFactory("Erc20Usdc");

  const teamWallet = "0x40494EC8eCb8Ddb80fBCBd5D45048Fdb0664688E" // goerli
  // const teamWallet = "" // polygon mainnet

  // Deploy Usdc ERC20 Only for tests
  usdc = await Usdc.deploy();
  console.log("Usdc contract address", usdc.address)
  saveFrontendFiles(usdc, "Erc20Usdc");
  const usdcAddress = usdc.address

  // Deploy contracts
  nftEgg = await NftEgg.deploy();
  console.log("NftEgg contract address", nftEgg.address)
  saveFrontendFiles(nftEgg, "NftEgg");
  await nftEgg.transferOwnership(teamWallet)

  nftSneaker = await NftSneaker.deploy();
  console.log("NftSneaker contract address", nftSneaker.address)
  saveFrontendFiles(nftSneaker, "NftSneaker");
  await nftSneaker.transferOwnership(teamWallet)

  nftSneakerX = await NftSneakerX.deploy();
  console.log("NftSneakerX contract address", nftSneakerX.address)
  saveFrontendFiles(nftSneakerX, "NftSneakerX");
  await nftSneakerX.transferOwnership(teamWallet)

  // const nftSneakerAddress = "0x3B1247143217e1f0f052939Ad759B880C946925f"
  // const nftEggAddress = "0xe33793485FB554ba57a38558C5B83f275ad4Bb1c"
  const nftSneakerAddress = nftSneaker.address
  const nftEggAddress = nftEgg.address
  nftBox = await NftBox.deploy(usdcAddress, nftSneakerAddress, nftEggAddress);
  console.log("NftBox contract address", nftBox.address)
  saveFrontendFiles(nftBox, "NftBox");
  await nftBox.transferOwnership(teamWallet)

  equip = await Equip.deploy(nftSneakerX.address, nftSneaker.address, nftEgg.address);
  console.log("Equip contract address", equip.address)
  saveFrontendFiles(equip, "Equip");
  await equip.transferOwnership(teamWallet)

  await nftSneaker.setBoxAddress(nftBox.address);
  await nftEgg.setBoxAddress(nftBox.address);
  await nftSneaker.setEquipAddress(equip.address);
  await nftEgg.setEquipAddress(equip.address);
  await nftSneakerX.setEquipAddress(equip.address);
  
  console.log("Setters functions called")

  // For testing
  // const nftBox = new ethers.Contract(NftBoxAddress.address, NftBoxAbi.abi, signer)
  await nftBox.addMysteryBox("Mystery Box 1", toWei(80), "QmU2nBBPvZ2Hrg18oD36NKCv567EiFk8kq1yckMDoWuoCw/1", 50)
  console.log("1")
  await nftBox.addMysteryBox("Mystery Box 2", toWei(350), "QmU2nBBPvZ2Hrg18oD36NKCv567EiFk8kq1yckMDoWuoCw/2", 50)
  console.log("2")
  
  await usdc.approve(nftBox.address, toWei(10_000))
  console.log("2.5")

  await nftBox.mint(0, 2);
  console.log("3")
  await nftBox.mint(1, 2);
  console.log("4")
  await nftBox.openBox(1);
  console.log("5")
  await nftBox.openBox(3);
  console.log("6")
  await equip.equip(1, 1);
  console.log("7")

  console.log("Goerli test functions called")
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
