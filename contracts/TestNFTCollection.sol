// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TestNFTCollection is ERC721, Ownable {
    uint256 public mintPrice = 0;  // Free for testing
    uint256 public totalSupply = 100;
    uint256 public mintedCount = 0;
    string private _customBaseURI;  // Rename to avoid shadowing

    constructor(
        string memory name, 
        string memory symbol,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        _customBaseURI = "";
    }
    
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _customBaseURI = newBaseURI;
    }

    function mint() public payable {
        require(mintedCount < totalSupply, "Sold out");
        _safeMint(msg.sender, mintedCount);
        mintedCount++;
    }

    function batchMint(uint256 count) public {
        require(mintedCount + count <= totalSupply, "Would exceed total supply");
        for(uint256 i = 0; i < count; i++) {
            _safeMint(msg.sender, mintedCount);
            mintedCount++;
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return _customBaseURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return string(abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(bytes(string(abi.encodePacked(
                '{"name":"', name(), ' #', toString(tokenId), 
                '","description":"Test NFT Collection",',
                '"attributes":[{"trait_type":"trait","value":"', 
                toString(tokenId), '"}]}'
            ))))
        ));
    }
} 