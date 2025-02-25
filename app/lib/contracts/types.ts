export interface TestNFTContract {
  mint(): Promise<any>
  totalSupply(): Promise<number>
  balanceOf(owner: string): Promise<number>
  ownerOf(tokenId: number): Promise<string>
} 