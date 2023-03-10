// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import './IForgeNft.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import {DefaultOperatorFilterer} from "./DefaultOperatorFilterer.sol";

contract NftSneakerX is Ownable, ERC721A, DefaultOperatorFilterer {
    address equipAddress;
    address forgeNftAddress;
    string public uriPrefix = '';
    string public uriSuffix = '.json';
    uint256 public max_supply = 100;
    uint256 public burnAmount;
    string public uri = "ipfs://QmcJEc9WGo2HPx7CMcQq183tYMqFArUwJqxvfKVcam3LLR/";
    string public contractUri = "ipfs://QmWCFqvGXWYS7uQSusgRzNtf2Druoh7YjtEknXESPZVVAr/";

    bool public mintEnabled;
    uint256 public price = 0 ether;

    mapping (uint256 => uint256) public idToMetadata;

    event MintSuccessful(address user, uint256 metadata);

    constructor() ERC721A("Sneaker X", "SX") {
    }

    function mintFromEquip(address _user, uint256 _metadataId) external {
        require(msg.sender == equipAddress, "Only the Equip smart contract can mint");
        require(_totalMinted() + 1 <= max_supply, 'Cannot mint more than max supply');

        _mint(_user, 1);

        idToMetadata[_totalMinted()] = _metadataId;
        
        emit MintSuccessful(msg.sender, _metadataId);
    }

    function mint(uint256 quantity, uint256 _metadataId) external payable {
        require(mintEnabled, 'Minting is not enabled');
        require(_totalMinted() + quantity < max_supply, 'Cannot mint more than max supply');
        require(msg.value >= getPrice() * quantity, "Not enough ETH sent; check price!");

        _mint(msg.sender, quantity);

        emit MintSuccessful(msg.sender, _metadataId);
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, Strings.toString(idToMetadata[_tokenId]), uriSuffix))
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

    function setMaxSupply(uint256 _supply) public onlyOwner {
        max_supply = _supply;
    }

    function setMintEnabled(bool _state) public onlyOwner {
        mintEnabled = _state;
    }

    function setEquipAddress(address _equipAddress) public onlyOwner {
        equipAddress = _equipAddress;
    }

    function setForgeNftAddress(address _forgeNftAddress) public onlyOwner {
        forgeNftAddress = _forgeNftAddress;
    }

    function forgeNft(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "You don't own this SneakerX");
        IForgeNft(forgeNftAddress).forgeNft(msg.sender, _tokenId, idToMetadata[_tokenId]);

        _burn(_tokenId);
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

    function airdrop(address _user, uint256 _metadata) external onlyOwner {
        _mint(_user, 1);
        
        idToMetadata[_totalMinted()] = _metadata;
    }
}
