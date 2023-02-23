const { expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => parseInt(ethers.utils.formatEther(num))

describe("Equip", async function() {
    let deployer, addr1, addr2, nftBox, nftEgg, nftSneaker, nftSneakerX, equip, udsc
    let mysteryBoxCid1 = "ipfs://QmfNs44UKbLBf99ZZkuTQrkoEAeztjxYkmLA1TKAsG2T3G/1.json"
    let mysteryBoxCid2 = "ipfs://QmfNs44UKbLBf99ZZkuTQrkoEAeztjxYkmLA1TKAsG2T3G/2.json"

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
        await nftSneaker.setEquipAddress(equip.address);
        await nftEgg.setEquipAddress(equip.address);
        await nftSneakerX.setEquipAddress(equip.address);

        await nftBox.addMysteryBox("Mystery Box 1", toWei(80), 50, false)
        await nftBox.addMysteryBox("Mystery Box 2", toWei(350), 50, true)
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
        it("Should open multiple Box Islands and 1% receive loot", async function() {
            await usdc.connect(deployer).transfer(addr1.address, toWei(10_000));
            await usdc.connect(addr1).approve(nftBox.address, toWei(10_000))
            await nftBox.connect(addr1).mint(0, 3);
            await nftBox.connect(addr1).mint(1, 2);
            await nftBox.connect(addr1).mint(0, 3);
            let tokenIdBoxRare = 4

            await nftBox.connect(addr1).openBox(1);
            await nftBox.connect(addr1).openBox(2);
            await nftBox.connect(addr1).openBox(3);
            await nftBox.connect(addr1).openBox(tokenIdBoxRare);
            
            const eggMetadata = parseInt(await nftEgg.idToMetadata(4));
            console.log("eggMetadata", eggMetadata)
            expect(eggMetadata).to.greaterThanOrEqual(25);
            expect(eggMetadata).to.lessThanOrEqual(31);
        })
        it("Should mint NFTs correctly", async function() {
            const price0 = fromWei(await nftBox.getMysteryBoxPrice(0));
            const price1 = fromWei(await nftBox.getMysteryBoxPrice(1));

            await expect(nftBox.connect(addr1).mint(0, 1)).to.be.revertedWith('ERC20: insufficient allowance');
            
            await usdc.connect(addr1).approve(nftBox.address, toWei(10_000))
            
            await expect(nftBox.connect(addr1).mint(2, 1)).to.be.revertedWith('boxId out of range');
            await expect(nftBox.connect(addr1).mint(0, 101)).to.be.revertedWith('Cannot mint more than max supply');

            await expect(nftBox.connect(addr1).mint(0, 1)).to.be.revertedWith('ERC20: transfer amount exceeds balance');

            await usdc.connect(deployer).transfer(addr1.address, toWei(10_000));
            expect(await usdc.balanceOf(addr1.address)).to.equal(toWei(10_000));

            await nftBox.connect(addr1).mint(0, 1);
            expect(await usdc.balanceOf(addr1.address)).to.equal(toWei(10_000 - price0));
            expect(await usdc.balanceOf(nftBox.address)).to.equal(toWei(price0));
            expect(await nftBox.balanceOf(addr1.address)).to.equal(1);
            expect(await nftBox.totalSupply()).to.equal(1);
            expect(await nftBox.tokenURI(1)).to.contain(mysteryBoxCid1);

            await nftBox.connect(addr1).mint(1, 2);
            expect(await nftBox.balanceOf(addr1.address)).to.equal(3);
            expect(await nftBox.totalSupply()).to.equal(3);
            expect(await nftBox.tokenURI(2)).to.contain(mysteryBoxCid2);
            expect(await nftBox.tokenURI(3)).to.contain(mysteryBoxCid2);

            await nftBox.connect(addr1).mint(0, 1);
            expect(await nftBox.balanceOf(addr1.address)).to.equal(4);
            expect(await nftBox.totalSupply()).to.equal(4);
            expect(await nftBox.tokenURI(4)).to.contain(mysteryBoxCid1);

            // Withdraw USDC from Box smart contract
            const nftBoxBalance = fromWei(await usdc.balanceOf(nftBox.address));
            const deployerBalance = fromWei(await usdc.balanceOf(deployer.address));
            await nftBox.connect(deployer).withdraw();
            expect(await usdc.balanceOf(nftBox.address)).to.equal(0);
            expect(await usdc.balanceOf(deployer.address)).to.equal(toWei(deployerBalance + nftBoxBalance));

        })

        it("Should open a Box and receive loot", async function() {
            const price0 = await nftBox.getMysteryBoxPrice(0);
            const price1 = await nftBox.getMysteryBoxPrice(1);
            await usdc.connect(deployer).transfer(addr1.address, toWei(10_000));
            await usdc.connect(addr1).approve(nftBox.address, toWei(10_000))
            await nftBox.connect(addr1).mint(0, 1);
            expect(await nftBox.balanceOf(addr1.address)).to.equal(1);

            await expect(nftBox.connect(addr1).openBox(2)).to.be.revertedWith('OwnerQueryForNonexistentToken()');
            await expect(nftBox.connect(addr2).openBox(1)).to.be.revertedWith('You do not own this Box');

            await nftBox.connect(addr1).openBox(1);
            expect(await nftBox.balanceOf(addr1.address)).to.equal(0);
            expect(await nftSneaker.balanceOf(addr1.address)).to.equal(1);
            expect(await nftEgg.balanceOf(addr1.address)).to.equal(1);
        })

        it("Should open a Box Islands and 1% receive loot", async function() {
            await usdc.connect(deployer).transfer(addr1.address, toWei(10_000));
            await usdc.connect(addr1).approve(nftBox.address, toWei(10_000))
            await nftBox.connect(addr1).mint(1, 1);
            expect(await nftBox.balanceOf(addr1.address)).to.equal(1);

            await expect(nftBox.connect(addr1).openBox(2)).to.be.revertedWith('OwnerQueryForNonexistentToken()');
            await expect(nftBox.connect(addr2).openBox(1)).to.be.revertedWith('You do not own this Box');

            await nftBox.connect(addr1).openBox(1);
            expect(await nftBox.balanceOf(addr1.address)).to.equal(0);
            expect(await nftSneaker.balanceOf(addr1.address)).to.equal(1);
            expect(await nftEgg.balanceOf(addr1.address)).to.equal(1);
            
            const eggMetadata = parseInt(await nftEgg.idToMetadata(1));
            console.log("eggMetadata", eggMetadata)
            expect(eggMetadata).to.greaterThanOrEqual(25);
            expect(eggMetadata).to.lessThanOrEqual(31);
        })

        it("Should not mint Box Islands if no more 1% loot available", async function() {
            await usdc.connect(deployer).transfer(addr1.address, toWei(100_000));
            await usdc.connect(addr1).approve(nftBox.address, toWei(100_000))
            await nftBox.connect(addr1).mint(1, 50);

            let amount1LowRarity = 7 * 3
            for(let i = 1; i <= amount1LowRarity; i++) { // There are a total of 7 items with 1% rarity
                await nftBox.connect(addr1).openBox(i);
            }
            await expect(nftBox.connect(addr1).openBox(amount1LowRarity + 1)).to.be.revertedWith('No more one percent rarities available');
        })

        it("Should equip a sneaker and an egg to receive a Sneaker X with correct metadata", async function() {
            const price0 = await nftBox.getMysteryBoxPrice(0);
            const price1 = await nftBox.getMysteryBoxPrice(1);
            await usdc.connect(deployer).transfer(addr1.address, toWei(10_000));
            await usdc.connect(addr1).approve(nftBox.address, toWei(10_000))
            await nftBox.connect(addr1).mint(0, 1);
            await nftBox.connect(addr1).openBox(1);

            expect(await nftSneaker.balanceOf(addr1.address)).to.equal(1);
            expect(await nftEgg.balanceOf(addr1.address)).to.equal(1);

            const eggMetadata = await nftEgg.idToMetadata(1);

            await expect(equip.connect(addr2).equip(1, 1)).to.be.revertedWith('Caller does not own the NFT');
            await equip.connect(addr1).equip(1, 1);

            expect(await nftSneaker.balanceOf(addr1.address)).to.equal(0);
            expect(await nftEgg.balanceOf(addr1.address)).to.equal(0);
            expect(await nftSneakerX.balanceOf(addr1.address)).to.equal(1);

            const sneakerXMetadata = await nftSneakerX.idToMetadata(1);
            expect(eggMetadata).to.equal(sneakerXMetadata);

            console.log("Metadata: " + eggMetadata)
        })

        it("Should perform owner functions", async function() {
            let newPrice = 0

            await expect(nftBox.connect(addr1).setMintEnabled(0, true)).to.be.revertedWith('Ownable: caller is not the owner');
            await expect(nftBox.connect(addr1).setPrice(0, newPrice)).to.be.revertedWith('Ownable: caller is not the owner');
            await expect(nftBox.connect(addr1).withdraw()).to.be.revertedWith('Ownable: caller is not the owner');
            
            await nftBox.connect(deployer).setPrice(0, newPrice);
            expect(await nftBox.getPrice(0)).to.equal(newPrice);
            await nftBox.connect(deployer).setMintEnabled(0, false);
            await expect(nftBox.connect(addr1).mint(0, 1)).to.be.revertedWith('Minting is not enabled');
        })
    })
    
})