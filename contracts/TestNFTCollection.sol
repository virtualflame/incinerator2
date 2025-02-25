// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestNFTCollection is ERC721, Ownable {
    uint256 public totalSupply = 100;
    uint256 public mintedCount = 0;

    constructor(
        string memory name, 
        string memory symbol,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {}
    
    function batchMint(uint256 count) public {
        require(mintedCount + count <= totalSupply, "Would exceed total supply");
        for(uint256 i = 0; i < count; i++) {
            _safeMint(msg.sender, mintedCount);
            mintedCount++;
        }
    }
} 