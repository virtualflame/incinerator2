declare module "*.json" {
  const content: {
    abi: any[];
    bytecode: string;
  };
  export = content;
} 