const { expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => parseInt(ethers.utils.formatEther(num))

describe("NFT", async function() {
    let deployer, addr1, addr2, nft
    let price = 0
    let mysteryBoxCid1 = "QmYLpp6TaXjHPENgbDWRWzBQoJuc4zRE5z3sXjXhdYALp3"
    let mysteryBoxCid2 = "QmZnXGbXgpBNjAJaaaoWsH5VYoTNkVgpVmbpgFXnTUyQ5d"

    beforeEach(async function() {
        // Get contract factories
        const NFT = await ethers.getContractFactory("NFT");

        // Get signers
        [deployer, addr1, addr2, addr3] = await ethers.getSigners();
        whitelist = [addr1.address, addr2.address, addr3.address]

        // Deploy contracts
        nft = await NFT.deploy();
    });

    describe("Deployment", function() {
        it("Should track name and symbol of the nft collection", async function() {
            expect(await nft.name()).to.equal("Mystery Box")
            expect(await nft.symbol()).to.equal("MB")
        })
    })

    describe("Mint", function() {
        it("Should mint NFTs correctly", async function() {
            await expect(nft.connect(addr1).mint(2, 1, { value: toWei(price)})).to.be.revertedWith('boxId out of range');
            await expect(nft.connect(addr1).mint(0, 101, { value: toWei(price)})).to.be.revertedWith('Cannot mint more than max supply');

            await nft.connect(addr1).mint(0, 1, { value: toWei(price)});
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.totalSupply()).to.equal(1);
            expect(await nft.tokenURI(1)).to.contain(mysteryBoxCid1);

            await nft.connect(addr1).mint(1, 2, { value: toWei(price)});
            expect(await nft.balanceOf(addr1.address)).to.equal(3);
            expect(await nft.totalSupply()).to.equal(3);
            expect(await nft.tokenURI(2)).to.contain(mysteryBoxCid2);
            expect(await nft.tokenURI(3)).to.contain(mysteryBoxCid2);

            await nft.connect(addr1).mint(0, 1, { value: toWei(price)});
            expect(await nft.balanceOf(addr1.address)).to.equal(4);
            expect(await nft.totalSupply()).to.equal(4);
            expect(await nft.tokenURI(4)).to.contain(mysteryBoxCid1);

        })
        it("Should perform owner functions", async function() {
            let newPrice = 0

            await expect(nft.connect(addr1).setMintEnabled(0, true)).to.be.revertedWith('Ownable: caller is not the owner');
            await expect(nft.connect(addr1).setPrice(0, newPrice)).to.be.revertedWith('Ownable: caller is not the owner');
            await expect(nft.connect(addr1).withdraw()).to.be.revertedWith('Ownable: caller is not the owner');
            
            await nft.connect(deployer).setPrice(0, newPrice);
            expect(await nft.getPrice(0)).to.equal(newPrice);
            await nft.connect(deployer).setMintEnabled(0, false);
            await expect(nft.connect(addr1).mint(0, 1, { value: toWei(price)})).to.be.revertedWith('Minting is not enabled');
        })
    })
    
})