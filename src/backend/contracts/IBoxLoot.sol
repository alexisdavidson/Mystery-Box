// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IBoxLoot {
    function mintFromBox(address _user, uint256 _boxId) external;
    function burnFromEquip(uint256 _tokenId) external;
    function idToMetadata(uint256 _tokenId) external view returns(uint256);
}