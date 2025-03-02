declare module "*.json" {
  const content: {
    abi: any[];
    bytecode: string;
  };
  export = content;
}

export interface ContractArtifact {
  bytecode: string
  abi: any[]
} 