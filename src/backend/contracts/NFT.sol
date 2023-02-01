// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import {DefaultOperatorFilterer} from "./DefaultOperatorFilterer.sol";

// Box QmSABpZp4i6HFoY4AcmKhPG5nujQXmVv8TosqNkvkY6t5n 1-2
// Snaker QmY8ascXNak6Asqm6SSCe3p3zkiCWfTaGH5F7N1spmtj8x 1-31
// Egg QmYVmkGssbGo9ZbM2HDQh3TjEyorgZjyjfqaFj365LQMQQ 1-31

contract NFT is Ownable, ERC721A, DefaultOperatorFilterer {
    string public uriPrefix = '';
    string public uriSuffix = '.json';

    struct BoxData {
        string name;
        uint256 price;
        uint256 burnAmount;
        string cid;
        uint256 maxSupply;
        uint256 remainingSupply;
        bool mintEnabled;
    }

    BoxData[] public boxes;
    mapping (uint256 => uint256) idToBoxId;

    event MintSuccessful(address user);

    constructor() ERC721A("Mystery Box", "MB") {
        boxes.push(BoxData("Mystery Box 1", 0, 0, "QmSABpZp4i6HFoY4AcmKhPG5nujQXmVv8TosqNkvkY6t5n/1", 100, 100, true));
        boxes.push(BoxData("Mystery Box 2", 0, 0, "QmSABpZp4i6HFoY4AcmKhPG5nujQXmVv8TosqNkvkY6t5n/2", 100, 100, true));
    }

    function mint(uint256 _boxId, uint256 _quantity) external payable {
        require(_boxId < boxes.length, "boxId out of range");
        require(boxes[_boxId].mintEnabled, 'Minting is not enabled');
        require(boxes[_boxId].remainingSupply >= _quantity, 'Cannot mint more than max supply');
        require(msg.value >= getPrice(_boxId) * _quantity, "Not enough ETH sent; check price!");

        for(uint256 i = 0; i < _quantity;) {
            idToBoxId[_startTokenId() + _totalMinted() + i] = _boxId;
            unchecked { ++i; }
        }
        _mint(msg.sender, _quantity);
        boxes[_boxId].remainingSupply --;

        emit MintSuccessful(msg.sender);
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), 'ERC721Metadata: URI query for nonexistent token');
        require(idToBoxId[_tokenId] < boxes.length, "boxId out of range");
        return string(abi.encodePacked("ipfs://", boxes[idToBoxId[_tokenId]].cid, "/", Strings.toString(_tokenId), uriSuffix));
    }

    // function _baseURI() internal pure override returns (string memory) {
    //     return "QmYLpp6TaXjHPENgbDWRWzBQoJuc4zRE5z3sXjXhdYALp3";
    // }
    
    // function baseTokenURI() public pure returns (string memory) {
    //     return _baseURI();
    // }

    function contractURI() public pure returns (string memory) {
        return "ipfs://QmZn7J1NDdFgJm5Q7pxmivZFKVDjcBcpU9sN1kezBUZpLn/";
    }

    function getPrice(uint256 _boxId) view public returns(uint) {
        return boxes[_boxId].price;
    }

    function setPrice(uint256 _boxId, uint _price) public onlyOwner {
        require(_boxId < boxes.length, "boxId out of range");
        boxes[_boxId].price = _price;
    }

    function setMintEnabled(uint256 _boxId, bool _state) public onlyOwner {
        require(_boxId < boxes.length, "boxId out of range");
        boxes[_boxId].mintEnabled = _state;
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

    // Mystery Box functions

    function addMysteryBox(string memory _name, uint256 _price, string memory _cid, uint256 _maxSupply) public onlyOwner {
        boxes.push(BoxData(_name, _price, 0, _cid, _maxSupply, _maxSupply, true));
    }

    // function removeMysteryBox(uint256 _boxId) public onlyOwner {
    //     require(_boxId < boxes.length, "boxId out of range");
    //     boxes[_boxId] = boxes[boxes.length - 1];
    //     boxes.pop();
    // }

    function getMysteryBoxName(uint256 _boxId) public view returns (string memory) {
        require(_boxId < boxes.length, "boxId out of range");
        return boxes[_boxId].name;
    }

    function getMysteryBoxCid(uint256 _boxId) public view returns (string memory) {
        require(_boxId < boxes.length, "boxId out of range");
        return boxes[_boxId].cid;
    }
}
