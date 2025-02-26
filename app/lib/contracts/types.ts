export interface TestNFTContract {
  mint(): Promise<any>
  batchMint(count: number): Promise<any>
  totalSupply(): Promise<number>
  balanceOf(owner: string): Promise<number>
  ownerOf(tokenId: number): Promise<string>
}

export interface NFTRecyclerContract {
  updateCollection(
    contractAddress: string,
    rewardAmount: number,
    isActive: boolean
  ): Promise<any>
  recycleNFT(collection: string, tokenId: number): Promise<any>
  togglePause(): Promise<any>
} 