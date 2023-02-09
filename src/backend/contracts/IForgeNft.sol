// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IForgeNft {
    function forgeNft(address _user, uint256 _tokenId, uint256 _metadataId) external;
}