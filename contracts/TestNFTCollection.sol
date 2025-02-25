// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestNFTCollection is ERC721, Ownable {
    uint256 public mintPrice = 0;  // Free for testing
    uint256 public totalSupply = 100;
    uint256 public mintedCount = 0;
    string public baseURI;  // Add this for NFT metadata

    constructor(string memory name, string memory symbol) 
        ERC721(name, symbol) {}
    
    // Add setBaseURI function
    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function mint() public payable {
        require(mintedCount < totalSupply, "Sold out");
        _safeMint(msg.sender, mintedCount);
        mintedCount++;
    }

    // Override baseURI
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
} 