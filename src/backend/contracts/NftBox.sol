// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import './IBoxLoot.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {DefaultOperatorFilterer} from "./DefaultOperatorFilterer.sol";

// Box QmSABpZp4i6HFoY4AcmKhPG5nujQXmVv8TosqNkvkY6t5n 1-2
// Snaker QmY8ascXNak6Asqm6SSCe3p3zkiCWfTaGH5F7N1spmtj8x 1-31
// Egg QmYVmkGssbGo9ZbM2HDQh3TjEyorgZjyjfqaFj365LQMQQ 1-31

contract NftBox is Ownable, ERC721A, DefaultOperatorFilterer {
    using SafeERC20 for IERC20;

    string public uriPrefix = '';
    string public uriSuffix = '.json';

    address public USDCAddress;
    address public sneakerAddress;
    address public eggAddress;

    struct BoxData {
        string name;
        uint256 price;
        uint256 burnAmount;
        string cid;
        uint256 maxSupply;
        uint256 remainingSupply;
        bool mintEnabled;
    }

    address[] whitelist;
    BoxData[] public boxes;
    mapping (uint256 => uint256) idToBoxId;

    event MintSuccessful(address user);

    constructor(address _usdcAddress, address _sneakerAddress, address _eggAddress) ERC721A("Mystery Box", "MB") {
        require(_usdcAddress != address(0), "Invalid USDC address");
        USDCAddress = _usdcAddress;
        sneakerAddress = _sneakerAddress;
        eggAddress = _eggAddress;
    }

    function openBox(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "You do not own this Box");
        require(_msgSender() == tx.origin, "opener cannot be smart contract");
        uint256 _boxId = idToBoxId[_tokenId];

        IBoxLoot(sneakerAddress).mintFromBox(msg.sender, _boxId);
        IBoxLoot(eggAddress).mintFromBox(msg.sender, _boxId);
        
        _burn(_tokenId);
    }

    function mint(uint256 _boxId, uint256 _quantity) external {
        require(_boxId < boxes.length, "boxId out of range");
        require(boxes[_boxId].mintEnabled, 'Minting is not enabled');
        require(boxes[_boxId].remainingSupply >= _quantity, 'Cannot mint more than max supply');

        for(uint256 i = 0; i < _quantity;) {
            idToBoxId[_startTokenId() + _totalMinted() + i] = _boxId;
            unchecked { ++i; }
        }

        if (!isWhitelisted(msg.sender))
            IERC20(USDCAddress).safeTransferFrom(msg.sender, address(this), getPrice(_boxId) * _quantity);

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
        return "ipfs://QmZ7rzn8vqna7D54N5UnacoarPHB6cYZsRfwVfymcL8E23/";
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

        IERC20(USDCAddress).approve(address(this), IERC20(USDCAddress).balanceOf(address(this)));
        IERC20(USDCAddress).safeTransferFrom(address(this), msg.sender, IERC20(USDCAddress).balanceOf(address(this)));
    }
    
    function _startTokenId() internal view override returns (uint256) {
        return 1;
    }

    // Mystery Box functions

    function addMysteryBox(string memory _name, uint256 _price, string memory _cid, uint256 _maxSupply) public onlyOwner {
        boxes.push(BoxData(_name, _price, 0, _cid, _maxSupply, _maxSupply, true));
    }

    function removeMysteryBox(uint256 _boxId) public onlyOwner {
        require(_boxId < boxes.length, "boxId out of range");
        boxes[_boxId] = boxes[boxes.length - 1];
        boxes.pop();
    }

    function getMysteryBoxPrice(uint256 _boxId) public view returns (uint256) {
        require(_boxId < boxes.length, "boxId out of range");
        return boxes[_boxId].price;
    }

    function getMysteryBoxName(uint256 _boxId) public view returns (string memory) {
        require(_boxId < boxes.length, "boxId out of range");
        return boxes[_boxId].name;
    }

    function getMysteryBoxCid(uint256 _boxId) public view returns (string memory) {
        require(_boxId < boxes.length, "boxId out of range");
        return boxes[_boxId].cid;
    }

    function airdrop(address _user, uint256 _quantity) external onlyOwner {
        _mint(_user, _quantity);
    }

    function setWhitelist(address[] memory _whitelist) onlyOwner public {
        delete whitelist;
        whitelist = _whitelist;
    }

    function isWhitelisted(address _user) public view returns(bool) {
        for(uint256 i = 0; i < whitelist.length;) {
            if (whitelist[i] == _user)
                return true;
            unchecked { ++i; }
        }
        return false;
    }
}
