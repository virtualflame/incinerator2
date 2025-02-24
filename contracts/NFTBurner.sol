// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTBurner
 * @dev Contract that allows users to "burn" (transfer) NFTs in exchange for B3TR tokens
 * 
 * Features:
 * - Accepts two active collections per week
 * - Fixed reward per NFT
 * - Transfers NFTs to a mother wallet instead of burning
 * - Tracks weekly allocations and rewards
 */
contract NFTBurner is Ownable {
    // B3TR token that will be given as rewards
    IERC20 public b3trToken;
    
    // Wallet that will receive all transferred NFTs
    address public motherWallet;
    
    // Weekly tracking variables
    uint256 public weeklyB3TRAllocation;  // Total B3TR available for the week
    uint256 public totalRewardsGiven;     // How much B3TR has been given out
    
    /**
     * @dev Collection struct to track active NFT collections
     * @param nftContract VeChain NFT contract address (e.g., MVA: 0xFFcC1c4492c3b49825712e9A8909E4fCEBfE6C02)
     * @param rewardPerNFT Fixed amount of B3TR given per NFT
     * @param startTime When collection becomes active
     * @param endTime When collection expires
     * @param isActive Whether collection is currently active
     * @param nftsTransferred Count of NFTs transferred for this collection
     */
    struct Collection {
        address nftContract;
        uint256 rewardPerNFT;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 nftsTransferred;
    }
    
    // Fixed array of 2 collections that can be active at once
    Collection[2] public activeCollections;
    
    // Events for tracking transfers and updates
    event NFTTransferred(address indexed user, address indexed collection, uint256 tokenId, uint256 reward);
    event CollectionUpdated(address indexed collection, uint256 rewardPerNFT, uint256 startTime, uint256 endTime);
    
    /**
     * @dev Constructor sets up B3TR token and mother wallet
     * @param _b3trToken Address of B3TR token contract
     * @param _motherWallet Address that will receive NFTs
     */
    constructor(address _b3trToken, address _motherWallet) {
        b3trToken = IERC20(_b3trToken);
        motherWallet = _motherWallet;
    }
    
    /**
     * @dev Admin function to set an active collection
     * @param index Which slot to use (0 or 1)
     * @param nftContract VeChain NFT contract address
     * @param rewardPerNFT How many B3TR tokens per NFT
     * @param startTime Collection start timestamp
     * @param endTime Collection end timestamp
     */
    function setActiveCollection(
        uint256 index,
        address nftContract,
        uint256 rewardPerNFT,
        uint256 startTime,
        uint256 endTime
    ) external onlyOwner {
        require(index < 2, "Invalid index");
        require(nftContract != address(0), "Invalid NFT contract");
        require(rewardPerNFT > 0, "Invalid reward amount");
        
        activeCollections[index] = Collection({
            nftContract: nftContract,
            rewardPerNFT: rewardPerNFT,
            startTime: startTime,
            endTime: endTime,
            isActive: true,
            nftsTransferred: 0
        });
        
        emit CollectionUpdated(nftContract, rewardPerNFT, startTime, endTime);
    }
    
    /**
     * @dev Admin function to set total B3TR available for the week
     * @param amount Total B3TR tokens allocated for the week
     */
    function setWeeklyAllocation(uint256 amount) external onlyOwner {
        weeklyB3TRAllocation = amount;
        totalRewardsGiven = 0;  // Reset counter for new week
    }
    
    /**
     * @dev User function to transfer NFT and receive B3TR
     * @param collectionIndex Which collection the NFT is from (0 or 1)
     * @param tokenId The NFT token ID to transfer
     */
    function transferNFT(uint256 collectionIndex, uint256 tokenId) external {
        Collection storage collection = activeCollections[collectionIndex];
        require(collection.isActive, "Collection not active");
        require(block.timestamp >= collection.startTime, "Collection not started");
        require(block.timestamp <= collection.endTime, "Collection ended");
        
        // Get NFT contract
        IERC721 nft = IERC721(collection.nftContract);
        
        // Verify ownership
        require(nft.ownerOf(tokenId) == msg.sender, "Not token owner");
        
        // Calculate reward
        uint256 reward = collection.rewardPerNFT;
        
        // Check if we have enough B3TR left
        require(totalRewardsGiven + reward <= weeklyB3TRAllocation, "Weekly rewards exceeded");
        
        // Transfer NFT to mother wallet
        nft.transferFrom(msg.sender, motherWallet, tokenId);
        
        // Send B3TR rewards
        require(b3trToken.transfer(msg.sender, reward), "Reward transfer failed");
        
        totalRewardsGiven += reward;
        collection.nftsTransferred += 1;
        
        emit NFTTransferred(msg.sender, collection.nftContract, tokenId, reward);
    }
    
    // View functions for getting information
    
    /**
     * @dev Get remaining B3TR rewards for the week
     */
    function getRemainingRewards() public view returns (uint256) {
        return weeklyB3TRAllocation - totalRewardsGiven;
    }
    
    /**
     * @dev Get stats for a specific collection
     * @param index Collection index (0 or 1)
     * @return rewardPerNFT B3TR per NFT for this collection
     * @return nftsTransferred How many NFTs transferred
     * @return totalRewardsForCollection Total B3TR given for this collection
     */
    function getCollectionStats(uint256 index) public view returns (
        uint256 rewardPerNFT,
        uint256 nftsTransferred,
        uint256 totalRewardsForCollection
    ) {
        Collection memory collection = activeCollections[index];
        return (
            collection.rewardPerNFT,
            collection.nftsTransferred,
            collection.nftsTransferred * collection.rewardPerNFT
        );
    }
} 