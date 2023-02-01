// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import './IBoxLoot.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import {DefaultOperatorFilterer} from "./DefaultOperatorFilterer.sol";

contract NftSneaker is IBoxLoot, Ownable, ERC721A, DefaultOperatorFilterer {
    address boxAddress;
    string public uriPrefix = '';
    string public uriSuffix = '.json';
    uint256 public max_supply = 100;
    uint256 public burnAmount;

    bool public mintEnabled;
    uint256 public price = 0 ether;

    event MintSuccessful(address user);

    constructor(address _boxAddress) ERC721A("Blank Sneaker", "BS") {
        boxAddress = _boxAddress;
    }

    function mintFromBox(address _user, uint256 _boxId) external {
        require(msg.sender == boxAddress, "Only the Box smart contract can mint");
        require(totalSupply() + 1 <= max_supply, 'Cannot mint more than max supply');
        _mint(_user, 1);
        
        emit MintSuccessful(msg.sender);
    }

    function burnFromEquip(uint256 _tokenId) external {
        require(msg.sender == boxAddress, "Only the Box smart contract can burn from equip");
        _burn(_tokenId);
    }

    function idToMetadata(uint256 _tokenId) external view returns(uint256) {
        return 0;
    }

    function mint(uint256 quantity) external payable {
        require(mintEnabled, 'Minting is not enabled');
        require(totalSupply() + quantity < max_supply, 'Cannot mint more than max supply');
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

    function setMaxSupply(uint256 _supply) public onlyOwner {
        max_supply = _supply;
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
