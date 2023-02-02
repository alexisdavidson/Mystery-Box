const { expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => parseInt(ethers.utils.formatEther(num))

describe("Equip", async function() {
    let deployer, addr1, addr2, nftBox, nftEgg, nftSneaker, nftSneakerX, equip, udsc
    let price = 0
    let mysteryBoxCid1 = "QmSABpZp4i6HFoY4AcmKhPG5nujQXmVv8TosqNkvkY6t5n/1"
    let mysteryBoxCid2 = "QmSABpZp4i6HFoY4AcmKhPG5nujQXmVv8TosqNkvkY6t5n/2"

    beforeEach(async function() {
        // Get contract factories
        const NftBox = await ethers.getContractFactory("NftBox");
        const NftEgg = await ethers.getContractFactory("NftEgg");
        const NftSneaker = await ethers.getContractFactory("NftSneaker");
        const NftSneakerX = await ethers.getContractFactory("NftSneakerX");
        const Equip = await ethers.getContractFactory("Equip");
        const Usdc = await ethers.getContractFactory("Erc20Usdc");

        // Get signers
        [deployer, addr1, addr2, addr3] = await ethers.getSigners();
        whitelist = [addr1.address, addr2.address, addr3.address]

        // Deploy Usdc ERC20 Only for unit tests
        usdc = await Usdc.deploy();
        const usdcAddress = usdc.address

        // Deploy contracts
        nftEgg = await NftEgg.deploy();
        nftSneaker = await NftSneaker.deploy();
        nftSneakerX = await NftSneakerX.deploy();
        nftBox = await NftBox.deploy(usdcAddress, nftSneaker.address, nftEgg.address);
        equip = await Equip.deploy(nftSneakerX.address, nftSneaker.address, nftEgg.address);

        await nftSneaker.setBoxAddress(nftBox.address);
        await nftEgg.setBoxAddress(nftBox.address);
        await nftSneakerX.setEquipAddress(equip.address);
    });

    describe("Deployment", function() {
        it("Should track name and symbol of the nft collections", async function() {
            expect(await nftBox.name()).to.equal("Mystery Box")
            expect(await nftBox.symbol()).to.equal("MB")
            
            expect(await nftEgg.name()).to.equal("Egg")
            expect(await nftEgg.symbol()).to.equal("EGG")
            
            expect(await nftSneaker.name()).to.equal("Blank Sneaker")
            expect(await nftSneaker.symbol()).to.equal("BS")
            
            expect(await nftSneakerX.name()).to.equal("Sneaker X")
            expect(await nftSneakerX.symbol()).to.equal("SX")
        })
    })

    describe("Mint", function() {
        it("Should mint NFTs correctly", async function() {
            await expect(nftBox.connect(addr1).mint(2, 1, { value: toWei(price)})).to.be.revertedWith('boxId out of range');
            await expect(nftBox.connect(addr1).mint(0, 101, { value: toWei(price)})).to.be.revertedWith('Cannot mint more than max supply');

            await nftBox.connect(addr1).mint(0, 1, { value: toWei(price)});
            expect(await nftBox.balanceOf(addr1.address)).to.equal(1);
            expect(await nftBox.totalSupply()).to.equal(1);
            expect(await nftBox.tokenURI(1)).to.contain(mysteryBoxCid1);

            await nftBox.connect(addr1).mint(1, 2, { value: toWei(price)});
            expect(await nftBox.balanceOf(addr1.address)).to.equal(3);
            expect(await nftBox.totalSupply()).to.equal(3);
            expect(await nftBox.tokenURI(2)).to.contain(mysteryBoxCid2);
            expect(await nftBox.tokenURI(3)).to.contain(mysteryBoxCid2);

            await nftBox.connect(addr1).mint(0, 1, { value: toWei(price)});
            expect(await nftBox.balanceOf(addr1.address)).to.equal(4);
            expect(await nftBox.totalSupply()).to.equal(4);
            expect(await nftBox.tokenURI(4)).to.contain(mysteryBoxCid1);

        })
        it("Should perform owner functions", async function() {
            let newPrice = 0

            await expect(nftBox.connect(addr1).setMintEnabled(0, true)).to.be.revertedWith('Ownable: caller is not the owner');
            await expect(nftBox.connect(addr1).setPrice(0, newPrice)).to.be.revertedWith('Ownable: caller is not the owner');
            await expect(nftBox.connect(addr1).withdraw()).to.be.revertedWith('Ownable: caller is not the owner');
            
            await nftBox.connect(deployer).setPrice(0, newPrice);
            expect(await nftBox.getPrice(0)).to.equal(newPrice);
            await nftBox.connect(deployer).setMintEnabled(0, false);
            await expect(nftBox.connect(addr1).mint(0, 1, { value: toWei(price)})).to.be.revertedWith('Minting is not enabled');
        })
    })
    
})