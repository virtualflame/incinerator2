// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title NFTRecycler
 * @dev Contract that allows users to recycle old NFTs in exchange for B3TR tokens
 * - NFTs are transferred to a mother wallet (not burned)
 * - Users receive B3TR tokens as rewards
 * - Supports two active collections per week
 */
contract NFTRecycler is Ownable {
    // Active collections for the week
    struct Collection {
        address contractAddress;  // The deployer contract address
        uint256 rewardAmount;    // B3TR reward per NFT
        bool isActive;           // Is collection active this week
    }
    
    // Mother wallet to receive NFTs
    address public motherWallet;
    
    // B3TR token contract
    IERC20 public b3trToken;
    
    // Track active collections (max 2 per week)
    mapping(address => Collection) public activeCollections;
    
    // Track total active collections
    uint8 public activeCollectionCount;
    uint8 public constant MAX_ACTIVE_COLLECTIONS = 2;
    
    // Pause mechanism for emergencies
    bool public isPaused;
    
    modifier whenNotPaused() {
        require(!isPaused, "Contract is paused");
        _;
    }
    
    event CollectionUpdated(address contractAddress, uint256 rewardAmount, bool isActive);
    event NFTRecycled(address collection, uint256 tokenId, address recycler, uint256 reward);
    
    constructor(
        address initialOwner,
        address _motherWallet,
        address _b3trToken
    ) Ownable(initialOwner) {
        motherWallet = _motherWallet;
        b3trToken = IERC20(_b3trToken);
    }
    
    // Admin function to update collections (only owner)
    function updateCollection(
        address contractAddress,
        uint256 rewardAmount,
        bool isActive
    ) external onlyOwner {
        require(contractAddress != address(0), "Invalid address");
        
        Collection memory existing = activeCollections[contractAddress];
        
        // Update active collection count
        if (isActive && !existing.isActive) {
            require(activeCollectionCount < MAX_ACTIVE_COLLECTIONS, "Max collections reached");
            activeCollectionCount++;
        } else if (!isActive && existing.isActive) {
            activeCollectionCount--;
        }
        
        activeCollections[contractAddress] = Collection({
            contractAddress: contractAddress,
            rewardAmount: rewardAmount,
            isActive: isActive
        });
        
        emit CollectionUpdated(contractAddress, rewardAmount, isActive);
    }
    
    // User function to recycle NFTs
    function recycleNFT(address collection, uint256 tokenId) external whenNotPaused {
        Collection memory col = activeCollections[collection];
        require(col.isActive, "Collection not active this week");
        
        // Transfer NFT to mother wallet
        IERC721(collection).transferFrom(msg.sender, motherWallet, tokenId);
        
        // Send B3TR reward
        require(b3trToken.transfer(msg.sender, col.rewardAmount), "Reward transfer failed");
        
        emit NFTRecycled(collection, tokenId, msg.sender, col.rewardAmount);
    }
    
    // Emergency functions
    function togglePause() external onlyOwner {
        isPaused = !isPaused;
    }
    
    function emergencyWithdraw(address token) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(address(this).balance);
        } else {
            IERC20(token).transfer(
                owner(),
                IERC20(token).balanceOf(address(this))
            );
        }
    }
} 