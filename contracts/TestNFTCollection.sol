// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestNFTCollection is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {}

    function mint() public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function batchMint(uint256 amount) public onlyOwner {
        for(uint256 i = 0; i < amount; i++) {
            mint();
        }
    }
} 