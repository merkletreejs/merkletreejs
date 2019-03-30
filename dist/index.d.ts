/**
 * Class reprensenting a Merkle Tree
 * @namespace MerkleTree
 */
export declare class MerkleTree {
    hashAlgo: any;
    leaves: any;
    layers: any;
    isBitcoinTree: boolean;
    /**
     * @desc Constructs a Merkle Tree.
     * All nodes and leaves are stored as Buffers.
     * Lonely leaf nodes are promoted to the next level up without being hashed again.
     * @param {Buffer[]} leaves - Array of hashed leaves. Each leaf must be a Buffer.
     * @param {Function} hashAlgorithm - Algorithm used for hashing leaves and nodes
     * @param {Object} options - Additional options
     * @param {Boolean} options.isBitcoinTree - If set to `true`, constructs the Merkle
     * Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need
     * to replicate Bitcoin constructed Merkle Trees. In Bitcoin Merkle Trees, single nodes are combined with themselves, and each output hash is hashed again.
     * @example
     * const MerkleTree = require('merkletreejs')
     * const crypto = require('crypto')
     *
     * function sha256(data) {
     *   // returns Buffer
     *   return crypto.createHash('sha256').update(data).digest()
     * }
     *
     * const leaves = ['a', 'b', 'c'].map(x => sha3(x))
     *
     * const tree = new MerkleTree(leaves, sha256)
     */
    constructor(leaves: any, hashAlgorithm: any, options?: any);
    createHashes(nodes: any): void;
    /**
     * getLeaves
     * @desc Returns array of leaves of Merkle Tree.
     * @return {Buffer[]}
     * @example
     * const leaves = tree.getLeaves()
     */
    getLeaves(): any;
    /**
     * getLayers
     * @desc Returns array of all layers of Merkle Tree, including leaves and root.
     * @return {Buffer[]}
     * @example
     * const layers = tree.getLayers()
     */
    getLayers(): any;
    /**
     * getRoot
     * @desc Returns the Merkle root hash as a Buffer.
     * @return {Buffer}
     * @example
     * const root = tree.getRoot()
     */
    getRoot(): any;
    /**
     * getProof
     * @desc Returns the proof for a target leaf.
     * @param {Buffer} leaf - Target leaf
     * @param {Number} [index] - Target leaf index in leaves array.
     * Use if there are leaves containing duplicate data in order to distinguish it.
     * @return {Object[]} - Array of objects containing a position property of type string
     * with values of 'left' or 'right' and a data property of type Buffer.
     * @example
     * const proof = tree.getProof(leaves[2])
     *
     * @example
     * const leaves = ['a', 'b', 'a'].map(x => sha3(x))
     * const tree = new MerkleTree(leaves, sha3)
     * const proof = tree.getProof(leaves[2], 2)
     */
    getProof(leaf: any, index?: any): any[];
    /**
     * verify
     * @desc Returns true if the proof path (array of hashes) can connect the target node
     * to the Merkle root.
     * @param {Object[]} proof - Array of proof objects that should connect
     * target node to Merkle root.
     * @param {Buffer} targetNode - Target node Buffer
     * @param {Buffer} root - Merkle root Buffer
     * @return {Boolean}
     * @example
     * const root = tree.getRoot()
     * const proof = tree.getProof(leaves[2])
     * const verified = tree.verify(proof, leaves[2], root)
     *
     */
    verify(proof: any, targetNode: any, root: any): boolean;
    getLayersAsObject(): any;
    print(): void;
    toTreeString(): any;
    toString(): any;
    static bufferify(x: any): any;
    static print(tree: any): void;
}
export default MerkleTree;
