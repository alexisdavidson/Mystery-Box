// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import './IBoxLoot.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import {DefaultOperatorFilterer} from "./DefaultOperatorFilterer.sol";

contract NftEgg is IBoxLoot, Ownable, ERC721A, DefaultOperatorFilterer {
    address boxAddress;
    address equipAddress;
    string public uriPrefix = '';
    string public uriSuffix = '.json';
    string public uri = "ipfs://QmevKJ9Y6YcQYi7tvMAQdpeEmYYBPCkTm8cQREyDjsKXEb/";
    string public contractUri = "ipfs://QmaVcTLbmmY1CUswFBCBcpvgA8iYd7YEmaAraeF79bf8gZ/";
    uint256 public burnAmount;

    uint256 public rareFirstId = 25;
    uint256 public rareLastId = 31;

    bool public mintEnabled;
    uint256 public price = 0 ether;

    uint256[] public remainingEggs;
    mapping (uint256 => uint256) idToMetadataMapping;

    event MintSuccessful(address user, uint256 metadata);

    constructor() ERC721A("Egg", "EGG") {
        remainingEggs = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
            3, 3, 3, 3, 3, 
            4, 4, 4, 4, 4, 
            5, 5, 5, 
            6, 6, 6, 
            7, 7, 7, 
            8, 8, 8, 
            9, 9, 9, 
            10, 10, 10, 
            11, 11, 11,
            12, 12, 12, 
            13, 13, 13,
            14, 14, 14, 
            15, 15, 15, 
            16, 16, 16, 
            17, 17, 17, 
            18, 18, 18, 
            19, 19, 19, 
            20, 20, 20, 
            21, 21, 21, 
            22, 22, 22, 
            23, 23, 23, 
            24, 24, 24, 
            25, 
            26, 
            27, 
            28, 
            29, 
            30, 
            31];
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

        uint256 _remainingEggsLength = remainingEggs.length;
        if (_boxId == 1) { // 1% rarities only
            uint256 _idFirstRare = 0;

            for (uint256 i = 0; i < _remainingEggsLength;) {
                if (isOnePercentRarity(remainingEggs[i])) {
                    _idFirstRare = i;
                    break;
                }
                unchecked { ++i; }
            }

            _random = _idFirstRare + _random % (_remainingEggsLength - _idFirstRare);
        } else { // Any rarity
            _random = _random % _remainingEggsLength;
        }


        uint256 _metadata = remainingEggs[_random];

        _mint(_user, 1);

        idToMetadataMapping[_totalMinted()] = _metadata;

        remainingEggs[_random] = remainingEggs[remainingEggs.length - 1];
        remainingEggs.pop();
        
        emit MintSuccessful(_user, _metadata);
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

    function isOnePercentRarity(uint256 _metadata) public view returns(bool) {
        return _metadata >= rareFirstId && _metadata <= rareLastId;
    }

    function burnFromEquip(uint256 _tokenId) external {
        require(msg.sender == equipAddress, "Only the Equip smart contract can burn from equip");
        _burn(_tokenId);
    }

    function idToMetadata(uint256 _tokenId) external view returns(uint256) {
        return idToMetadataMapping[_tokenId];
    }

    function mint(uint256 quantity, uint256 _metadataId) external payable {
        require(mintEnabled, 'Minting is not enabled');
        require(remainingEggs.length > 0, 'No remaining Eggs');
        require(msg.value >= getPrice() * quantity, "Not enough ETH sent; check price!");

        _mint(msg.sender, quantity);

        emit MintSuccessful(msg.sender, _metadataId);
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, Strings.toString(idToMetadataMapping[_tokenId]), uriSuffix))
            : '';
    }

    function _baseURI() internal view override returns (string memory) {
        return uri;
    }

    function setMetadata(string memory _uri) public onlyOwner {
        uri = _uri;
    }
    
    function baseTokenURI() public view returns (string memory) {
        return _baseURI();
    }

    function setContractMetadata(string memory _uri) public onlyOwner {
        contractUri = _uri;
    }

    function contractURI() public view returns (string memory) {
        return contractUri;
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

    function setEquipAddress(address _address) public onlyOwner {
        equipAddress = _address;
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
