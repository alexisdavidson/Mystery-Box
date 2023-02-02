// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import './IBoxLoot.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import {DefaultOperatorFilterer} from "./DefaultOperatorFilterer.sol";

contract NftEgg is IBoxLoot, Ownable, ERC721A, DefaultOperatorFilterer {
    address boxAddress;
    string public uriPrefix = '';
    string public uriSuffix = '.json';
    uint256 public burnAmount;

    bool public mintEnabled;
    uint256 public price = 0 ether;

    uint256[] remainingEggs;
    mapping (uint256 => uint256) idToMetadataMapping;

    event MintSuccessful(address user);

    constructor() ERC721A("Egg", "EGG") {
        remainingEggs = [13, 10, 5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1];
    }

    function setRemainingEggs(uint256[] memory _remainingEggs) onlyOwner public {
        delete remainingEggs;
        remainingEggs = _remainingEggs;
    }

    function mintFromBox(address _user, uint256 _boxId) external {
        require(msg.sender == boxAddress, "Only the Box smart contract can mint");
        require(remainingEggs.length > 0, 'No remaining Eggs');
        require(_user == tx.origin, "opener cannot be smart contract");
        require(!(_boxId == 1 && !onePercentRarityAvailable()), "No more one percent rarities available");

        // Pick random index from array which contains remaining stuff
        uint256 _random = uint256(keccak256(abi.encodePacked(_msgSender(), blockhash(block.number - 1), block.difficulty)));
        _random = _random % remainingEggs.length;
        uint256 _metadata = remainingEggs[_random];

        _mint(_user, 1);

        idToMetadataMapping[totalSupply()] = _metadata;

        remainingEggs[_random] = remainingEggs[remainingEggs.length - 1];
        remainingEggs.pop();
        
        emit MintSuccessful(msg.sender);
    }

    function onePercentRarityAvailable() public view returns(bool) {
        uint256 _remainingEggsLength = remainingEggs.length;
        for (uint256 i = 0; i < _remainingEggsLength;) {
            if (isOnePercentRarity(remainingEggs[i]))
                return true;
            unchecked { ++i; }
        }

        return false;
    }

    function isOnePercentRarity(uint256 _metadata) public pure returns(bool) {
        return _metadata >= 25 && _metadata <= 31;
    }

    function burnFromEquip(uint256 _tokenId) external {
        require(msg.sender == boxAddress, "Only the Box smart contract can burn from equip");
        _burn(_tokenId);
    }

    function idToMetadata(uint256 _tokenId) external view returns(uint256) {
        return idToMetadataMapping[_tokenId];
    }

    function mint(uint256 quantity) external payable {
        require(mintEnabled, 'Minting is not enabled');
        require(remainingEggs.length > 0, 'No remaining Eggs');
        require(msg.value >= getPrice() * quantity, "Not enough ETH sent; check price!");

        _mint(msg.sender, quantity);

        emit MintSuccessful(msg.sender);
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        return _baseURI();
        // require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');

        // string memory currentBaseURI = _baseURI();
        // return bytes(currentBaseURI).length > 0
        //     ? string(abi.encodePacked(currentBaseURI, Strings.toString(_tokenId), uriSuffix))
        //     : '';
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmYLpp6TaXjHPENgbDWRWzBQoJuc4zRE5z3sXjXhdYALp3/";
    }
    
    function baseTokenURI() public pure returns (string memory) {
        return _baseURI();
    }

    function contractURI() public pure returns (string memory) {
        return "ipfs://QmZn7J1NDdFgJm5Q7pxmivZFKVDjcBcpU9sN1kezBUZpLn/";
    }

    function getPrice() view public returns(uint) {
        return price;
    }

    function setPrice(uint _price) public onlyOwner {
        price = _price;
    }

    function setMintEnabled(bool _state) public onlyOwner {
        mintEnabled = _state;
    }

    function setBoxAddress(address _address) public onlyOwner {
        boxAddress = _address;
    }

    function transferFrom(address from, address to, uint256 tokenId) public override onlyAllowedOperator(from) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
        public
        override
        onlyAllowedOperator(from)
    {
        super.safeTransferFrom(from, to, tokenId, data);
    }
    
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
    function _startTokenId() internal view override returns (uint256) {
        return 1;
    }
}