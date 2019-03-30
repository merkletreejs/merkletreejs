/// <reference types="node" />
declare const reverse: any;
declare const CryptoJS: any;
declare const treeify: any;

declare class merkletreejs {
    constructor(leaves: any, hashAlgorithm: any, options?: {});
    createHashes(nodes: any): void;
    getLeaves(): any;
    getRoot(): any;
    getProof(leaf: any, index?: any): any[];
    verify(proof: any, targetNode: any, root: any): boolean;
    getLayersAsObject(): any;
    print(): void;
    toTreeString(): any;
    toString(): any;
    static bufferify(x: any): any;
    static print(tree: any): void;
    hashAlgo: any;
    leaves: any;
    layers: any;
    isBitcoinTree: boolean;
}
declare function bufferify(x: any): any;
declare function bufferifyFn(f: any): (x: any) => Buffer;
declare function isHexStr(v: any): boolean;
