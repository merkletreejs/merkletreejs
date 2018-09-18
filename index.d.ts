declare module 'merkletreejs' {
  interface IOptions {
    isBitcoinTree: boolean
  }

  interface IProof {
    position: 'left' | 'right'
    data: Buffer
  }

  export default class MerkleTree {
    getRoot: () => Buffer
    getLeaves: () => Buffer[]
    getLayers: () => Buffer[]
    getProof: (leaf: Buffer, index?: number) => IProof[]
    verify: (proof: IProof[], targetNode: Buffer, root: Buffer) => boolean
    constructor(
      leaves: Buffer[],
      hashAlgorithm: (data: any) => Buffer,
      options?: IOptions
    )
  }
}
