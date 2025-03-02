import { ethers } from 'hardhat'

export async function deployContract(name: string, args: any[]) {
  const Contract = await ethers.getContractFactory(name)
  const contract = await Contract.deploy(...args)
  await contract.deployed()
  return contract
} 