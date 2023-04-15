import { Buffer } from 'buffer'
import reverse from 'buffer-reverse'
import SHA256 from 'crypto-js/sha256'
import treeify from 'treeify'
import Base from './Base'

// TODO: Clean up and DRY up code
// Disclaimer: The multiproof code is unaudited and may possibly contain serious issues. It's in a hacky state as is and needs to be rewritten.

type TValue = Buffer | BigInt | string | number | null | undefined
type THashFnResult = Buffer | string
type THashFn = (value: TValue) => Buffer
type TLeaf = Buffer
type TLayer = any
type TFillDefaultHash = (idx?: number, hashFn?: THashFn) => THashFnResult

export interface Options {
  /** If set to `true`, an odd node will be duplicated and combined to make a pair to generate the layer hash. */
  duplicateOdd?: boolean
  /** If set to `true`, the leaves will hashed using the set hashing algorithms. */
  hashLeaves?: boolean
  /** If set to `true`, constructs the Merkle Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need to replicate Bitcoin constructed Merkle Trees. In Bitcoin Merkle Trees, single nodes are combined with themselves, and each output hash is hashed again. */
  isBitcoinTree?: boolean
  /** If set to `true`, the leaves will be sorted. Recommended for use of multiProofs. */
  sortLeaves?: boolean
  /** If set to `true`, the hashing pairs will be sorted. */
  sortPairs?: boolean
  /** If set to `true`, the leaves and hashing pairs will be sorted. */
  sort?: boolean
  /** If defined, the resulting hash of this function will be used to fill in odd numbered layers. */
  fillDefaultHash?: TFillDefaultHash | Buffer | string
  /** If set to `true`, the resulting tree will be a complete tree. Recommended for use of multiProofs. */
  complete?: boolean;

  concatenator?: (inputs: Buffer[]) => Buffer | Buffer[] | BigInt[]
}

/**
 * Class reprensenting a Merkle Tree
 * @namespace MerkleTree
 */
export class MerkleTree extends Base {
  private duplicateOdd: boolean = false
  private hashFn: THashFn
  private concatenator: any = Buffer.concat
  private hashLeaves: boolean = false
  private isBitcoinTree: boolean = false
  private leaves: TLeaf[] = []
  private layers: TLayer[] = []
  private sortLeaves: boolean = false
  private sortPairs: boolean = false
  private sort: boolean = false
  private fillDefaultHash: TFillDefaultHash | null = null
  private complete: boolean = false

  /**
   * @desc Constructs a Merkle Tree.
   * All nodes and leaves are stored as Buffers.
   * Lonely leaf nodes are promoted to the next level up without being hashed again.
   * @param {Buffer[]} leaves - Array of hashed leaves. Each leaf must be a Buffer.
   * @param {Function} hashFunction - Hash function to use for hashing leaves and nodes
   * @param {Object} options - Additional options
   * @example
   *```js
   *const MerkleTree = require('merkletreejs')
   *const crypto = require('crypto')
   *
   *function sha256(data) {
   *  // returns Buffer
   *  return crypto.createHash('sha256').update(data).digest()
   *}
   *
   *const leaves = ['a', 'b', 'c'].map(value => keccak(value))
   *
   *const tree = new MerkleTree(leaves, sha256)
   *```
   */
  constructor (leaves: any[], hashFn = SHA256, options: Options = {}) {
    super()

    if (options.complete) {
      if (options.isBitcoinTree) {
        throw new Error('option "complete" is incompatible with "isBitcoinTree"')
      }
      if (options.duplicateOdd) {
        throw new Error('option "complete" is incompatible with "duplicateOdd"')
      }
    }

    this.isBitcoinTree = !!options.isBitcoinTree
    this.hashLeaves = !!options.hashLeaves
    this.sortLeaves = !!options.sortLeaves
    this.sortPairs = !!options.sortPairs
    this.complete = !!options.complete

    if (options.fillDefaultHash) {
      if (typeof options.fillDefaultHash === 'function') {
        this.fillDefaultHash = options.fillDefaultHash
      } else if (Buffer.isBuffer(options.fillDefaultHash) || typeof options.fillDefaultHash === 'string') {
        this.fillDefaultHash = (idx?: number, hashFn?: THashFn):THashFnResult => options.fillDefaultHash as THashFnResult
      } else {
        throw new Error('method "fillDefaultHash" must be a function, Buffer, or string')
      }
    }

    this.sort = !!options.sort
    if (this.sort) {
      this.sortLeaves = true
      this.sortPairs = true
    }

    this.duplicateOdd = !!options.duplicateOdd

    if (options.concatenator) {
      this.concatenator = options.concatenator
    }

    this.hashFn = this.bufferifyFn(hashFn)
    this.processLeaves(leaves)
  }

  public getOptions () {
    return {
      complete: this.complete,
      isBitcoinTree: this.isBitcoinTree,
      hashLeaves: this.hashLeaves,
      sortLeaves: this.sortLeaves,
      sortPairs: this.sortPairs,
      sort: this.sort,
      fillDefaultHash: this.fillDefaultHash?.toString() ?? null,
      duplicateOdd: this.duplicateOdd
    }
  }

  private processLeaves (leaves: TLeaf[]) {
    if (this.hashLeaves) {
      leaves = leaves.map(this.hashFn)
    }

    this.leaves = leaves.map(this.bufferify)
    if (this.sortLeaves) {
      this.leaves = this.leaves.sort(Buffer.compare)
    }

    if (this.fillDefaultHash) {
      for (let i = 0; i < Math.pow(2, Math.ceil(Math.log2(this.leaves.length))); i++) {
        if (i >= this.leaves.length) {
          this.leaves.push(this.bufferify(this.fillDefaultHash(i, this.hashFn)))
        }
      }
    }

    this.createHashes(this.leaves)
  }

  private createHashes (nodes: any[]) {
    this.layers = [nodes]
    while (nodes.length > 1) {
      const layerIndex = this.layers.length

      this.layers.push([])

      const layerLimit = this.complete && layerIndex === 1 && !Number.isInteger(Math.log2(nodes.length))
        ? (2 * nodes.length) - (2 ** Math.ceil(Math.log2(nodes.length)))
        : nodes.length

      for (let i = 0; i < nodes.length; i += 2) {
        if (i >= layerLimit) {
          this.layers[layerIndex].push(...nodes.slice(layerLimit))
          break
        } else if (i + 1 === nodes.length) {
          if (nodes.length % 2 === 1) {
            const data = nodes[nodes.length - 1]
            let hash = data

            // is bitcoin tree
            if (this.isBitcoinTree) {
              // Bitcoin method of duplicating the odd ending nodes
              hash = this.hashFn(this.concatenator([reverse(data), reverse(data)]))
              hash = reverse(this.hashFn(hash))

              this.layers[layerIndex].push(hash)
              continue
            } else {
              if (this.duplicateOdd) {
                // continue with creating layer
              } else {
                // push copy of hash and continue iteration
                this.layers[layerIndex].push(nodes[i])
                continue
              }
            }
          }
        }

        const left = nodes[i]
        const right = i + 1 === nodes.length ? left : nodes[i + 1]
        let combined = null

        if (this.isBitcoinTree) {
          combined = [reverse(left), reverse(right)]
        } else {
          combined = [left, right]
        }

        if (this.sortPairs) {
          combined.sort(Buffer.compare)
        }

        let hash = this.hashFn(this.concatenator(combined))

        // double hash if bitcoin tree
        if (this.isBitcoinTree) {
          hash = reverse(this.hashFn(hash))
        }

        this.layers[layerIndex].push(hash)
      }

      nodes = this.layers[layerIndex]
    }
  }

  /**
   * addLeaf
   * @desc Adds a leaf to the tree and re-calculates layers.
   * @param {String|Buffer} - Leaf
   * @param {Boolean} - Set to true if the leaf should be hashed before being added to tree.
   * @example
   *```js
   *tree.addLeaf(newLeaf)
   *```
   */
  addLeaf (leaf: TLeaf, shouldHash: boolean = false) {
    if (shouldHash) {
      leaf = this.hashFn(leaf)
    }
    this.processLeaves(this.leaves.concat(leaf))
  }

  /**
   * addLeaves
   * @desc Adds multiple leaves to the tree and re-calculates layers.
   * @param {String[]|Buffer[]} - Array of leaves
   * @param {Boolean} - Set to true if the leaves should be hashed before being added to tree.
   * @example
   *```js
   *tree.addLeaves(newLeaves)
   *```
   */
  addLeaves (leaves: TLeaf[], shouldHash: boolean = false) {
    if (shouldHash) {
      leaves = leaves.map(this.hashFn)
    }
    this.processLeaves(this.leaves.concat(leaves))
  }

  /**
   * getLeaves
   * @desc Returns array of leaves of Merkle Tree.
   * @return {Buffer[]}
   * @example
   *```js
   *const leaves = tree.getLeaves()
   *```
   */
  getLeaves (values?: any[]):Buffer[] {
    if (Array.isArray(values)) {
      if (this.hashLeaves) {
        values = values.map(this.hashFn)
        if (this.sortLeaves) {
          values = values.sort(Buffer.compare)
        }
      }

      return this.leaves.filter(leaf => this.bufferIndexOf(values, leaf, this.sortLeaves) !== -1)
    }

    return this.leaves
  }

  /**
   * getLeaf
   * @desc Returns the leaf at the given index.
   * @param {Number} - Index number
   * @return {Buffer}
   * @example
   *```js
   *const leaf = tree.getLeaf(1)
   *```
   */
  getLeaf (index: number):Buffer {
    if (index < 0 || index > this.leaves.length - 1) {
      return Buffer.from([])
    }

    return this.leaves[index]
  }

  /**
   * getLeafIndex
   * @desc Returns the index of the given leaf, or -1 if the leaf is not found.
   * @param {String|Buffer} - Target leaf
   * @return {number}
   * @example
   *```js
   *const leaf = Buffer.from('abc')
   *const index = tree.getLeafIndex(leaf)
   *```
   */
  getLeafIndex (target: TLeaf):number {
    target = this.bufferify(target)
    const leaves = this.getLeaves()
    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i]
      if (leaf.equals(target)) {
        return i
      }
    }

    return -1
  }

  /**
   * getLeafCount
   * @desc Returns the total number of leaves.
   * @return {number}
   * @example
   *```js
   *const count = tree.getLeafCount()
   *```
   */
  getLeafCount (): number {
    return this.leaves.length
  }

  /**
   * getHexLeaves
   * @desc Returns array of leaves of Merkle Tree as hex strings.
   * @return {String[]}
   * @example
   *```js
   *const leaves = tree.getHexLeaves()
   *```
   */
  getHexLeaves ():string[] {
    return this.leaves.map(leaf => this.bufferToHex(leaf))
  }

  /**
   * marshalLeaves
   * @desc Returns array of leaves of Merkle Tree as a JSON string.
   * @param {String[]|Buffer[]} - Merkle tree leaves
   * @return {String} - List of leaves as JSON string
   * @example
   *```js
   *const jsonStr = MerkleTree.marshalLeaves(leaves)
   *```
   */
  static marshalLeaves (leaves: any[]):string {
    return JSON.stringify(leaves.map(leaf => MerkleTree.bufferToHex(leaf)), null, 2)
  }

  /**
   * unmarshalLeaves
   * @desc Returns array of leaves of Merkle Tree as a Buffers.
   * @param {String|Object} - JSON stringified leaves
   * @return {Buffer[]} - Unmarshalled list of leaves
   * @example
   *```js
   *const leaves = MerkleTree.unmarshalLeaves(jsonStr)
   *```
   */
  static unmarshalLeaves (jsonStr: string | object):Buffer[] {
    let parsed :any = null
    if (typeof jsonStr === 'string') {
      parsed = JSON.parse(jsonStr)
    } else if (jsonStr instanceof Object) {
      parsed = jsonStr
    } else {
      throw new Error('Expected type of string or object')
    }

    if (!parsed) {
      return []
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Expected JSON string to be array')
    }

    return parsed.map(MerkleTree.bufferify)
  }

  /**
   * getLayers
   * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root.
   * @return {Buffer[][]}
   * @example
   *```js
   *const layers = tree.getLayers()
   *```
   */
  getLayers ():Buffer[][] {
    return this.layers
  }

  /**
   * getHexLayers
   * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root as hex strings.
   * @return {String[][]}
   * @example
   *```js
   *const layers = tree.getHexLayers()
   *```
   */
  getHexLayers ():string[][] {
    return this.layers.reduce((acc: string[][], item: Buffer[]) => {
      if (Array.isArray(item)) {
        acc.push(item.map(layer => this.bufferToHex(layer)))
      } else {
        acc.push(item)
      }

      return acc
    }, [])
  }

  /**
   * getLayersFlat
   * @desc Returns single flat array of all layers of Merkle Tree, including leaves and root.
   * @return {Buffer[]}
   * @example
   *```js
   *const layers = tree.getLayersFlat()
   *```
   */
  getLayersFlat ():Buffer[] {
    const layers = this.layers.reduce((acc, item) => {
      if (Array.isArray(item)) {
        acc.unshift(...item)
      } else {
        acc.unshift(item)
      }

      return acc
    }, [])

    layers.unshift(Buffer.from([0]))

    return layers
  }

  /**
   * getHexLayersFlat
   * @desc Returns single flat array of all layers of Merkle Tree, including leaves and root as hex string.
   * @return {String[]}
   * @example
   *```js
   *const layers = tree.getHexLayersFlat()
   *```
   */
  getHexLayersFlat ():string[] {
    return this.getLayersFlat().map(layer => this.bufferToHex(layer))
  }

  /**
   * getLayerCount
   * @desc Returns the total number of layers.
   * @return {number}
   * @example
   *```js
   *const count = tree.getLayerCount()
   *```
   */
  getLayerCount ():number {
    return this.getLayers().length
  }

  /**
   * getRoot
   * @desc Returns the Merkle root hash as a Buffer.
   * @return {Buffer}
   * @example
   *```js
   *const root = tree.getRoot()
   *```
   */
  getRoot ():Buffer {
    if (this.layers.length === 0) {
      return Buffer.from([])
    }

    return this.layers[this.layers.length - 1][0] || Buffer.from([])
  }

  /**
   * getHexRoot
   * @desc Returns the Merkle root hash as a hex string.
   * @return {String}
   * @example
   *```js
   *const root = tree.getHexRoot()
   *```
   */
  getHexRoot ():string {
    return this.bufferToHex(this.getRoot())
  }

  /**
   * getProof
   * @desc Returns the proof for a target leaf.
   * @param {Buffer} leaf - Target leaf
   * @param {Number} [index] - Target leaf index in leaves array.
   * Use if there are leaves containing duplicate data in order to distinguish it.
   * @return {Object[]} - Array of objects containing a position property of type string
   * with values of 'left' or 'right' and a data property of type Buffer.
   * @example
   * ```js
   *const proof = tree.getProof(leaves[2])
   *```
   *
   * @example
   *```js
   *const leaves = ['a', 'b', 'a'].map(value => keccak(value))
   *const tree = new MerkleTree(leaves, keccak)
   *const proof = tree.getProof(leaves[2], 2)
   *```
   */
  getProof (leaf: Buffer | string, index?: number):{position: 'left' | 'right', data: Buffer}[] {
    if (typeof leaf === 'undefined') {
      throw new Error('leaf is required')
    }
    leaf = this.bufferify(leaf)
    const proof = []

    if (!Number.isInteger(index)) {
      index = -1

      for (let i = 0; i < this.leaves.length; i++) {
        if (Buffer.compare(leaf, this.leaves[i]) === 0) {
          index = i
        }
      }
    }

    if (index <= -1) {
      return []
    }

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i]
      const isRightNode = index % 2
      const pairIndex = (isRightNode ? index - 1
        : this.isBitcoinTree && index === layer.length - 1 && i < this.layers.length - 1
          // Proof Generation for Bitcoin Trees
          ? index
          // Proof Generation for Non-Bitcoin Trees
          : index + 1)

      if (pairIndex < layer.length) {
        proof.push({
          position: isRightNode ? 'left' : 'right',
          data: layer[pairIndex]
        })
      }

      // set index to parent index
      index = (index / 2) | 0
    }

    return proof
  }

  /**
   * getHexProof
   * @desc Returns the proof for a target leaf as hex strings.
   * @param {Buffer} leaf - Target leaf
   * @param {Number} [index] - Target leaf index in leaves array.
   * Use if there are leaves containing duplicate data in order to distinguish it.
   * @return {String[]} - Proof array as hex strings.
   * @example
   * ```js
   *const proof = tree.getHexProof(leaves[2])
   *```
   */
  getHexProof (leaf: Buffer | string, index?: number):string[] {
    return this.getProof(leaf, index).map(item => this.bufferToHex(item.data))
  }

  /**
   * getProofs
   * @desc Returns the proofs for all leaves.
   * @return {Object[]} - Array of objects containing a position property of type string
   * with values of 'left' or 'right' and a data property of type Buffer for all leaves.
   * @example
   * ```js
   *const proofs = tree.getProofs()
   *```
   *
   * @example
   *```js
   *const leaves = ['a', 'b', 'a'].map(value => keccak(value))
   *const tree = new MerkleTree(leaves, keccak)
   *const proofs = tree.getProofs()
   *```
   */
  getProofs ():any[] {
    const proof = []; const proofs = []

    this.getProofsDFS(this.layers.length - 1, 0, proof, proofs)

    return proofs
  }

  /**
   * getProofsDFS
   * @desc Get all proofs through single traverse
   * @param {Number} currentLayer - Current layer index in traverse.
   * @param {Number} index - Current tarvese node index in traverse.
   * @param {Object[]} proof - Proof chain for single leaf.
   * @param {Object[]} proofs - Proofs for all leaves
   * @example
   * ```js
   *const layers = tree.getLayers()
   *const index = 0;
   *let proof = [];
   *let proofs = [];
   *const proof = tree.getProofsDFS(layers, index, proof, proofs)
   *```
   */
  getProofsDFS (currentLayer, index, proof, proofs):any[] {
    const isRightNode = index % 2
    if (currentLayer === -1) {
      if (!isRightNode) proofs.push([...proof].reverse())
      return
    }
    if (index >= this.layers[currentLayer].length) return

    const layer = this.layers[currentLayer]
    const pairIndex = isRightNode ? index - 1 : index + 1

    let pushed = false
    if (pairIndex < layer.length) {
      pushed = true
      proof.push({
        position: isRightNode ? 'left' : 'right',
        data: layer[pairIndex]
      })
    }

    const leftchildIndex = index * 2
    const rightchildIndex = index * 2 + 1

    this.getProofsDFS(currentLayer - 1, leftchildIndex, proof, proofs)
    this.getProofsDFS(currentLayer - 1, rightchildIndex, proof, proofs)

    if (pushed) proof.splice(proof.length - 1, 1)
  }

  /**
   * getHexProofs
   * @desc Returns the proofs for all leaves as hex strings.
   * @return {String[]} - Proofs array as hex strings.
   * @example
   * ```js
   *const proofs = tree.getHexProofs()
   *```
   */
  getHexProofs ():string[] {
    return this.getProofs().map(item => this.bufferToHex(item.data))
  }

  /**
  * getPositionalHexProof
  * @desc Returns the proof for a target leaf as hex strings and the position in binary (left == 0).
  * @param {Buffer} leaf - Target leaf
  * @param {Number} [index] - Target leaf index in leaves array.
  * Use if there are leaves containing duplicate data in order to distinguish it.
  * @return {(string | number)[][]} - Proof array as hex strings. position at index 0
  * @example
  * ```js
  *const proof = tree.getPositionalHexProof(leaves[2])
  *```
  */
  getPositionalHexProof (leaf: Buffer | string, index?: number): (string | number)[][] {
    return this.getProof(leaf, index).map(item => {
      return [
        item.position === 'left' ? 0 : 1,
        this.bufferToHex(item.data)
      ]
    })
  }

  /**
   * marshalProof
   * @desc Returns proof array as JSON string.
   * @param {String[]|Object[]} proof - Merkle tree proof array
   * @return {String} - Proof array as JSON string.
   * @example
   * ```js
   *const jsonStr = MerkleTree.marshalProof(proof)
   *```
   */
  static marshalProof (proof: any[]):string {
    const json = proof.map(item => {
      if (typeof item === 'string') {
        return item
      }

      if (Buffer.isBuffer(item)) {
        return MerkleTree.bufferToHex(item)
      }

      return {
        position: item.position,
        data: MerkleTree.bufferToHex(item.data)
      }
    })

    return JSON.stringify(json, null, 2)
  }

  /**
   * unmarshalProof
   * @desc Returns the proof for a target leaf as a list of Buffers.
   * @param {String|Object} - Merkle tree leaves
   * @return {String|Object} - Marshalled proof
   * @example
   * ```js
   *const proof = MerkleTree.unmarshalProof(jsonStr)
   *```
   */
  static unmarshalProof (jsonStr: string | object):any[] {
    let parsed :any = null
    if (typeof jsonStr === 'string') {
      parsed = JSON.parse(jsonStr)
    } else if (jsonStr instanceof Object) {
      parsed = jsonStr
    } else {
      throw new Error('Expected type of string or object')
    }

    if (!parsed) {
      return []
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Expected JSON string to be array')
    }

    return parsed.map(item => {
      if (typeof item === 'string') {
        return MerkleTree.bufferify(item)
      } else if (item instanceof Object) {
        return {
          position: item.position,
          data: MerkleTree.bufferify(item.data)
        }
      } else {
        throw new Error('Expected item to be of type string or object')
      }
    })
  }

  static marshalTree (tree: MerkleTree):string {
    const root = tree.getHexRoot()
    const leaves = tree.leaves.map(leaf => MerkleTree.bufferToHex(leaf))
    const layers = tree.getHexLayers()
    const options = tree.getOptions()

    return JSON.stringify({
      options,
      root,
      layers,
      leaves
    }, null, 2)
  }

  static unmarshalTree (jsonStr: string | object, hashFn = SHA256, options: Options = {}):MerkleTree {
    let parsed :any = null
    if (typeof jsonStr === 'string') {
      parsed = JSON.parse(jsonStr)
    } else if (jsonStr instanceof Object) {
      parsed = jsonStr
    } else {
      throw new Error('Expected type of string or object')
    }

    if (!parsed) {
      throw new Error('could not parse json')
    }

    options = Object.assign({}, parsed.options || {}, options)

    return new MerkleTree(parsed.leaves, hashFn, options)
  }

  /**
   * getProofIndices
   * @desc Returns the proof indices for given tree indices.
   * @param {Number[]} treeIndices - Tree indices
   * @param {Number} depth - Tree depth; number of layers.
   * @return {Number[]} - Proof indices
   * @example
   * ```js
   *const proofIndices = tree.getProofIndices([2,5,6], 4)
   *console.log(proofIndices) // [ 23, 20, 19, 8, 3 ]
   *```
   */
  getProofIndices (treeIndices: number[], depth: number):number[] {
    const leafCount = 2 ** depth
    let maximalIndices :any = new Set()
    for (const index of treeIndices) {
      let x = leafCount + index
      while (x > 1) {
        maximalIndices.add(x ^ 1)
        x = (x / 2) | 0
      }
    }

    const a = treeIndices.map(index => leafCount + index)
    const b = Array.from(maximalIndices).sort((a: any, b: any) => a - b).reverse()
    maximalIndices = a.concat(b as any)

    const redundantIndices = new Set()
    const proof = []

    for (let index of maximalIndices) {
      if (!redundantIndices.has(index)) {
        proof.push(index)
        while (index > 1) {
          redundantIndices.add(index)
          if (!redundantIndices.has(index as number ^ 1)) break
          index = (index as number / 2) | 0
        }
      }
    }

    return proof.filter(index => {
      return !treeIndices.includes(index - leafCount)
    })
  }

  private getProofIndicesForUnevenTree (sortedLeafIndices: number[], leavesCount: number): number[][] {
    const depth = Math.ceil(Math.log2(leavesCount))
    const unevenLayers :any[] = []
    for (let index = 0; index < depth; index++) {
      const unevenLayer = leavesCount % 2 !== 0
      if (unevenLayer) {
        unevenLayers.push({ index, leavesCount })
      }
      leavesCount = Math.ceil(leavesCount / 2)
    }

    const proofIndices: number[][] = []

    let layerNodes: any[] = sortedLeafIndices
    for (let layerIndex = 0; layerIndex < depth; layerIndex++) {
      const siblingIndices = layerNodes.map((index: any) => {
        if (index % 2 === 0) {
          return index + 1
        }
        return index - 1
      })
      let proofNodeIndices = siblingIndices.filter((index: any) => !layerNodes.includes(index))
      const unevenLayer = unevenLayers.find(({ index }) => index === layerIndex)
      if (unevenLayer && layerNodes.includes(unevenLayer.leavesCount - 1)) {
        proofNodeIndices = proofNodeIndices.slice(0, -1)
      }

      proofIndices.push(proofNodeIndices)
      layerNodes = [...new Set(layerNodes.map((index: any) => {
        if (index % 2 === 0) {
          return index / 2
        }

        if (index % 2 === 0) {
          return (index + 1) / 2
        }

        return (index - 1) / 2
      }))]
    }

    return proofIndices
  }

  /**
   * getMultiProof
   * @desc Returns the multiproof for given tree indices.
   * @param {Number[]} indices - Tree indices.
   * @return {Buffer[]} - Multiproofs
   * @example
   * ```js
   *const indices = [2, 5, 6]
   *const proof = tree.getMultiProof(indices)
   *```
   */
  getMultiProof (tree?: any[], indices?: any[]):Buffer[] {
    if (!this.complete) {
      console.warn('Warning: For correct multiProofs it\'s strongly recommended to set complete: true')
    }

    if (!indices) {
      indices = tree
      tree = this.getLayersFlat()
    }

    const isUneven = this.isUnevenTree()
    if (isUneven) {
      if (indices.every(Number.isInteger)) {
        return this.getMultiProofForUnevenTree(indices)
      }
    }

    if (!indices.every(Number.isInteger)) {
      let els = indices
      if (this.sortPairs) {
        els = els.sort(Buffer.compare)
      }

      let ids = els.map((el) => this.bufferIndexOf(this.leaves, el, this.sortLeaves)).sort((a, b) => a === b ? 0 : a > b ? 1 : -1)
      if (!ids.every((idx) => idx !== -1)) {
        throw new Error('Element does not exist in Merkle tree')
      }

      const hashes = []
      const proof = []
      let nextIds = []

      for (let i = 0; i < this.layers.length; i++) {
        const layer = this.layers[i]
        for (let j = 0; j < ids.length; j++) {
          const idx = ids[j]
          const pairElement = this.getPairNode(layer, idx)

          hashes.push(layer[idx])
          if (pairElement) {
            proof.push(pairElement)
          }

          nextIds.push((idx / 2) | 0)
        }

        ids = nextIds.filter((value, i, self) => self.indexOf(value) === i)
        nextIds = []
      }

      return proof.filter((value) => !hashes.includes(value))
    }

    return this.getProofIndices(indices, Math.log2((tree.length / 2) | 0)).map(index => tree[index])
  }

  private getMultiProofForUnevenTree (tree?: any[], indices?: any[]):Buffer[] {
    if (!indices) {
      indices = tree
      tree = this.getLayers()
    }

    let proofHashes : Buffer[] = []
    let currentLayerIndices: number[] = indices
    for (const treeLayer of tree) {
      const siblings: Buffer[] = []
      for (const index of currentLayerIndices) {
        if (index % 2 === 0) {
          const idx = index + 1
          if (!currentLayerIndices.includes(idx)) {
            if (treeLayer[idx]) {
              siblings.push(treeLayer[idx])
              continue
            }
          }
        }
        const idx = index - 1
        if (!currentLayerIndices.includes(idx)) {
          if (treeLayer[idx]) {
            siblings.push(treeLayer[idx])
            continue
          }
        }
      }

      proofHashes = proofHashes.concat(siblings)
      const uniqueIndices = new Set<number>()

      for (const index of currentLayerIndices) {
        if (index % 2 === 0) {
          uniqueIndices.add(index / 2)
          continue
        }

        if (index % 2 === 0) {
          uniqueIndices.add((index + 1) / 2)
          continue
        }

        uniqueIndices.add((index - 1) / 2)
      }

      currentLayerIndices = Array.from(uniqueIndices)
    }

    return proofHashes
  }

  /**
   * getHexMultiProof
   * @desc Returns the multiproof for given tree indices as hex strings.
   * @param {Number[]} indices - Tree indices.
   * @return {String[]} - Multiproofs as hex strings.
   * @example
   * ```js
   *const indices = [2, 5, 6]
   *const proof = tree.getHexMultiProof(indices)
   *```
   */
  getHexMultiProof (tree: Buffer[] | string[], indices: number[]):string[] {
    return this.getMultiProof(tree, indices).map((x) => this.bufferToHex(x))
  }

  /**
   * getProofFlags
   * @desc Returns list of booleans where proofs should be used instead of hashing.
   * Proof flags are used in the Solidity multiproof verifiers.
   * @param {Number[]|Buffer[]} leaves
   * @param {Buffer[]} proofs
   * @return {Boolean[]} - Boolean flags
   * @example
   * ```js
   *const indices = [2, 5, 6]
   *const proof = tree.getMultiProof(indices)
   *const proofFlags = tree.getProofFlags(leaves, proof)
   *```
   */
  getProofFlags (leaves: any[], proofs: Buffer[] | string[]):boolean[] {
    if (!Array.isArray(leaves) || leaves.length <= 0) {
      throw new Error('Invalid Inputs!')
    }

    let ids : number[]
    if (leaves.every(Number.isInteger)) {
      ids = [...leaves].sort((a, b) => a === b ? 0 : a > b ? 1 : -1) // Indices where passed
    } else {
      ids = leaves.map((el) => this.bufferIndexOf(this.leaves, el, this.sortLeaves)).sort((a, b) => a === b ? 0 : a > b ? 1 : -1)
    }

    if (!ids.every((idx: number) => idx !== -1)) {
      throw new Error('Element does not exist in Merkle tree')
    }

    const _proofs: Buffer[] = (proofs as any[]).map(item => this.bufferify(item))

    const tested = []
    const flags = []
    for (let index = 0; index < this.layers.length; index++) {
      const layer = this.layers[index]
      ids = ids.reduce((ids, idx) => {
        const skipped = tested.includes(layer[idx])
        if (!skipped) {
          const pairElement = this.getPairNode(layer, idx)
          const proofUsed = _proofs.includes(layer[idx]) || _proofs.includes(pairElement)
          pairElement && flags.push(!proofUsed)
          tested.push(layer[idx])
          tested.push(pairElement)
        }
        ids.push((idx / 2) | 0)
        return ids
      }, [])
    }

    return flags
  }

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
   *```js
   *const root = tree.getRoot()
   *const proof = tree.getProof(leaves[2])
   *const verified = tree.verify(proof, leaves[2], root)
   *```
   */
  verify (proof: any[], targetNode: Buffer | string, root: Buffer | string):boolean {
    let hash = this.bufferify(targetNode)
    root = this.bufferify(root)

    if (
      !Array.isArray(proof) ||
      !targetNode ||
      !root
    ) {
      return false
    }

    for (let i = 0; i < proof.length; i++) {
      const node = proof[i]
      let data: any = null
      let isLeftNode = null

      // case for when proof is hex values only
      if (typeof node === 'string') {
        data = this.bufferify(node)
        isLeftNode = true
      } else if (Array.isArray(node)) {
        isLeftNode = (node[0] === 0)
        data = this.bufferify(node[1])
      } else if (Buffer.isBuffer(node)) {
        data = node
        isLeftNode = true
      } else if (node instanceof Object) {
        data = this.bufferify(node.data)
        isLeftNode = (node.position === 'left')
      } else {
        throw new Error('Expected node to be of type string or object')
      }

      const buffers: any[] = []

      if (this.isBitcoinTree) {
        buffers.push(reverse(hash))

        buffers[isLeftNode ? 'unshift' : 'push'](reverse(data))

        hash = this.hashFn(this.concatenator(buffers))
        hash = reverse(this.hashFn(hash))
      } else {
        if (this.sortPairs) {
          if (Buffer.compare(hash, data) === -1) {
            buffers.push(hash, data)
            hash = this.hashFn(this.concatenator(buffers))
          } else {
            buffers.push(data, hash)
            hash = this.hashFn(this.concatenator(buffers))
          }
        } else {
          buffers.push(hash)
          buffers[isLeftNode ? 'unshift' : 'push'](data)
          hash = this.hashFn(this.concatenator(buffers))
        }
      }
    }

    return Buffer.compare(hash, root) === 0
  }

  /**
   * verifyMultiProof
   * @desc Returns true if the multiproofs can connect the leaves to the Merkle root.
   * @param {Buffer} root - Merkle tree root
   * @param {Number[]} proofIndices - Leave indices for proof
   * @param {Buffer[]} proofLeaves - Leaf values at indices for proof
   * @param {Number} leavesCount - Count of original leaves
   * @param {Buffer[]} proof - Multiproofs given indices
   * @return {Boolean}
   * @example
   *```js
   *const leaves = tree.getLeaves()
   *const root = tree.getRoot()
   *const treeFlat = tree.getLayersFlat()
   *const leavesCount = leaves.length
   *const proofIndices = [2, 5, 6]
   *const proofLeaves = proofIndices.map(i => leaves[i])
   *const proof = tree.getMultiProof(treeFlat, indices)
   *const verified = tree.verifyMultiProof(root, proofIndices, proofLeaves, leavesCount, proof)
   *```
   */
  verifyMultiProof (root: Buffer | string, proofIndices: number[], proofLeaves: Buffer[] | string[], leavesCount: number, proof: Buffer[] | string[]):boolean {
    const isUneven = this.isUnevenTree()
    if (isUneven) {
      // TODO: combine these functions and simplify
      return this.verifyMultiProofForUnevenTree(root, proofIndices, proofLeaves, leavesCount, proof)
    }

    const depth = Math.ceil(Math.log2(leavesCount))
    root = this.bufferify(root)
    proofLeaves = (proofLeaves as any[]).map(leaf => this.bufferify(leaf))
    proof = (proof as any[]).map(leaf => this.bufferify(leaf))

    const tree = {}
    for (const [index, leaf] of this.zip(proofIndices, proofLeaves)) {
      tree[(2 ** depth) + index] = leaf
    }
    for (const [index, proofitem] of this.zip(this.getProofIndices(proofIndices, depth), proof)) {
      tree[index] = proofitem
    }
    let indexqueue = Object.keys(tree).map(value => +value).sort((a, b) => a - b)
    indexqueue = indexqueue.slice(0, indexqueue.length - 1)
    let i = 0
    while (i < indexqueue.length) {
      const index = indexqueue[i]
      if (index >= 2 && ({}).hasOwnProperty.call(tree, index ^ 1)) {
        let pair = [tree[index - (index % 2)], tree[index - (index % 2) + 1]]
        if (this.sortPairs) {
          pair = pair.sort(Buffer.compare)
        }

        const hash = pair[1] ? this.hashFn(this.concatenator(pair)) : pair[0]
        tree[(index / 2) | 0] = hash
        indexqueue.push((index / 2) | 0)
      }
      i += 1
    }
    return !proofIndices.length || (({}).hasOwnProperty.call(tree, 1) && tree[1].equals(root))
  }

  verifyMultiProofWithFlags (
    root: Buffer | string,
    leaves: TLeaf[],
    proofs: Buffer[] | string[],
    proofFlag: boolean[]
  ) {
    root = this.bufferify(root) as Buffer
    leaves = leaves.map(this.bufferify) as Buffer[]
    proofs = (proofs as any[]).map(this.bufferify) as Buffer[]
    const leavesLen = leaves.length
    const totalHashes = proofFlag.length
    const hashes : Buffer[] = []
    let leafPos = 0
    let hashPos = 0
    let proofPos = 0
    for (let i = 0; i < totalHashes; i++) {
      const bufA: Buffer = proofFlag[i] ? (leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++]) : proofs[proofPos++]
      const bufB : Buffer = leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++]
      const buffers = [bufA, bufB].sort(Buffer.compare)
      hashes[i] = this.hashFn(this.concatenator(buffers))
    }

    return Buffer.compare(hashes[totalHashes - 1], root) === 0
  }

  private verifyMultiProofForUnevenTree (root: Buffer | string, indices: number[], leaves: Buffer[] | string[], leavesCount: number, proof: Buffer[] | string[]):boolean {
    root = this.bufferify(root)
    leaves = (leaves as any[]).map(leaf => this.bufferify(leaf))
    proof = (proof as any[]).map(leaf => this.bufferify(leaf))

    const computedRoot = this.calculateRootForUnevenTree(indices, leaves, leavesCount, proof)
    return root.equals(computedRoot)
  }

  /**
   * getDepth
   * @desc Returns the tree depth (number of layers)
   * @return {Number}
   * @example
   *```js
   *const depth = tree.getDepth()
   *```
   */
  getDepth ():number {
    return this.getLayers().length - 1
  }

  /**
   * getLayersAsObject
   * @desc Returns the layers as nested objects instead of an array.
   * @example
   *```js
   *const layersObj = tree.getLayersAsObject()
   *```
   */
  getLayersAsObject ():any {
    const layers: any[] = this.getLayers().map((layer: any) => layer.map((value: any) => this.bufferToHex(value, false)))
    const objs = []
    for (let i = 0; i < layers.length; i++) {
      const arr = []
      for (let j = 0; j < layers[i].length; j++) {
        const obj = { [layers[i][j]]: null }
        if (objs.length) {
          obj[layers[i][j]] = {}
          const a = objs.shift()
          const akey = Object.keys(a)[0]
          obj[layers[i][j]][akey] = a[akey]
          if (objs.length) {
            const b = objs.shift()
            const bkey = Object.keys(b)[0]
            obj[layers[i][j]][bkey] = b[bkey]
          }
        }

        arr.push(obj)
      }

      objs.push(...arr)
    }

    return objs[0]
  }

  /**
   * verify
   * @desc Returns true if the proof path (array of hashes) can connect the target node
   * to the Merkle root.
   * @param {Object[]} proof - Array of proof objects that should connect
   * target node to Merkle root.
   * @param {Buffer} targetNode - Target node Buffer
   * @param {Buffer} root - Merkle root Buffer
   * @param {Function} hashFunction - Hash function for hashing leaves and nodes
   * @param {Object} options - Additional options
   * @return {Boolean}
   * @example
   *```js
   *const verified = MerkleTree.verify(proof, leaf, root, sha256, options)
   *```
   */
  static verify (proof: any[], targetNode: Buffer | string, root: Buffer | string, hashFn = SHA256, options: Options = {}):boolean {
    const tree = new MerkleTree([], hashFn, options)
    return tree.verify(proof, targetNode, root)
  }

  /**
   * getMultiProof
   * @desc Returns the multiproof for given tree indices.
   * @param {Buffer[]} tree - Tree as a flat array.
   * @param {Number[]} indices - Tree indices.
   * @return {Buffer[]} - Multiproofs
   *
   *@example
   * ```js
   *const flatTree = tree.getLayersFlat()
   *const indices = [2, 5, 6]
   *const proof = MerkleTree.getMultiProof(flatTree, indices)
   *```
   */
  static getMultiProof (tree: Buffer[] | string[], indices: number[]):Buffer[] {
    const t = new MerkleTree([])
    return t.getMultiProof(tree, indices)
  }

  /**
   * resetTree
   * @desc Resets the tree by clearing the leaves and layers.
   * @example
   *```js
   *tree.resetTree()
   *```
   */
  resetTree ():void {
    this.leaves = []
    this.layers = []
  }

  /**
   * getPairNode
   * @desc Returns the node at the index for given layer.
   * @param {Buffer[]} layer - Tree layer
   * @param {Number} index - Index at layer.
   * @return {Buffer} - Node
   *
   *@example
   * ```js
   *const node = tree.getPairNode(layer, index)
   *```
   */
  private getPairNode (layer: Buffer[], idx: number):Buffer {
    const pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1

    if (pairIdx < layer.length) {
      return layer[pairIdx]
    } else {
      return null
    }
  }

  /**
   * toTreeString
   * @desc Returns a visual representation of the merkle tree as a string.
   * @return {String}
   * @example
   *```js
   *console.log(tree.toTreeString())
   *```
   */
  protected toTreeString ():string {
    const obj = this.getLayersAsObject()
    return treeify.asTree(obj, true)
  }

  /**
   * toString
   * @desc Returns a visual representation of the merkle tree as a string.
   * @example
   *```js
   *console.log(tree.toString())
   *```
   */
  toString ():string {
    return this.toTreeString()
  }

  isUnevenTree (treeLayers?: any[]) {
    const depth = treeLayers?.length || this.getDepth()
    return !this.isPowOf2(depth)
  }

  private isPowOf2 (v: number) {
    return v && !(v & (v - 1))
  }

  private calculateRootForUnevenTree (leafIndices: number[], leafHashes: any[], totalLeavesCount: number, proofHashes: any[]) {
    const leafTuples = this.zip(leafIndices, leafHashes).sort(([indexA], [indexB]) => indexA - indexB)
    const leafTupleIndices = leafTuples.map(([index]) => index)
    const proofIndices = this.getProofIndicesForUnevenTree(leafTupleIndices, totalLeavesCount)

    let nextSliceStart = 0
    const proofTuplesByLayers :any[] = []
    for (let i = 0; i < proofIndices.length; i++) {
      const indices = proofIndices[i]
      const sliceStart = nextSliceStart
      nextSliceStart += indices.length
      proofTuplesByLayers[i] = this.zip(indices, proofHashes.slice(sliceStart, nextSliceStart))
    }

    const tree = [leafTuples]
    for (let layerIndex = 0; layerIndex < proofTuplesByLayers.length; layerIndex++) {
      const currentLayer = proofTuplesByLayers[layerIndex].concat(tree[layerIndex]).sort(([indexA], [indexB]) => indexA - indexB)
        .map(([, hash]) => hash)

      const s = tree[layerIndex].map(([layerIndex]) => layerIndex)
      const parentIndices = [...new Set(s.map((index: any) => {
        if (index % 2 === 0) {
          return index / 2
        }

        if (index % 2 === 0) {
          return (index + 1) / 2
        }

        return (index - 1) / 2
      }))]

      const parentLayer: any[] = []
      for (let i = 0; i < parentIndices.length; i++) {
        const parentNodeTreeIndex = parentIndices[i]
        const bufA = currentLayer[i * 2]
        const bufB = currentLayer[i * 2 + 1]
        const hash = bufB ? this.hashFn(this.concatenator([bufA, bufB])) : bufA
        parentLayer.push([parentNodeTreeIndex, hash])
      }

      tree.push(parentLayer)
    }

    return tree[tree.length - 1][0][1]
  }
}

if (typeof window !== 'undefined') {
  ;(window as any).MerkleTree = MerkleTree
}

export default MerkleTree
