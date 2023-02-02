// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import './IBoxLoot.sol';
import './NftSneakerX.sol';
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";

contract Equip is Ownable {
    NftSneakerX nftSneakerXAddress;
    address nftAddress1; // Blank Sneaker
    address nftAddress2; // Egg

    event EquipSuccessful(address user);

    constructor(address _nftSneakerXAddress, address _nftAddress1, address _nftAddress2) {
        nftSneakerXAddress = NftSneakerX(_nftSneakerXAddress);
        nftAddress1 = _nftAddress1;
        nftAddress2 = _nftAddress2;
    }

    function equip(uint256 _tokenId1, uint256 _tokenId2) public {
        require(ERC721A(nftAddress1).ownerOf(_tokenId1) == msg.sender, "Caller does not own the NFT");
        require(ERC721A(nftAddress2).ownerOf(_tokenId2) == msg.sender, "Caller does not own the NFT");

        IBoxLoot(nftAddress1).burnFromEquip(_tokenId1);
        IBoxLoot(nftAddress2).burnFromEquip(_tokenId2);

        nftSneakerXAddress.mintFromEquip(msg.sender, IBoxLoot(nftAddress2).idToMetadata(_tokenId2));

        emit EquipSuccessful(msg.sender);
    }
}
