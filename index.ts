import reverse from 'buffer-reverse'
import CryptoJS from 'crypto-js'
import SHA256 from 'crypto-js/sha256'
import treeify from 'treeify'

interface Options {
  /** If set to `true`, an odd node will be duplicated and combined to make a pair to generate the layer hash. */
  duplicateOdd?: boolean
  /** If set to `true`, the leaves will hashed using the set hashing algorithms. */
  hashLeaves?: boolean
  /** If set to `true`, constructs the Merkle Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need to replicate Bitcoin constructed Merkle Trees. In Bitcoin Merkle Trees, single nodes are combined with themselves, and each output hash is hashed again. */
  isBitcoinTree?: boolean
  /** If set to `true`, the leaves will be sorted. */
  sortLeaves?: boolean
  /** If set to `true`, the hashing pairs will be sorted. */
  sortPairs?: boolean
  /** If set to `true`, the leaves and hashing pairs will be sorted. */
  sort?: boolean
}

type THashAlgo = any
type TValue = any
type TLeaf = any
type TLayer = any

/**
 * Class reprensenting a Merkle Tree
 * @namespace MerkleTree
 */
export class MerkleTree {
  private duplicateOdd: boolean
  private hashAlgo: (value: TValue) => THashAlgo
  private hashLeaves: boolean
  private isBitcoinTree: boolean
  private leaves: TLeaf[]
  private layers: TLayer[]
  private sortLeaves: boolean
  private sortPairs: boolean
  private sort: boolean

  /**
   * @desc Constructs a Merkle Tree.
   * All nodes and leaves are stored as Buffers.
   * Lonely leaf nodes are promoted to the next level up without being hashed again.
   * @param {Buffer[]} leaves - Array of hashed leaves. Each leaf must be a Buffer.
   * @param {Function} hashAlgorithm - Algorithm used for hashing leaves and nodes
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
   *const leaves = ['a', 'b', 'c'].map(x => keccak(x))
   *
   *const tree = new MerkleTree(leaves, sha256)
   *```
   */
  constructor (leaves: any[], hashAlgorithm = SHA256, options: Options = {}) {
    this.isBitcoinTree = !!options.isBitcoinTree
    this.hashLeaves = !!options.hashLeaves
    this.sortLeaves = !!options.sortLeaves
    this.sortPairs = !!options.sortPairs

    this.sort = !!options.sort
    if (this.sort) {
      this.sortLeaves = true
      this.sortPairs = true
    }

    this.duplicateOdd = !!options.duplicateOdd

    this.hashAlgo = this._bufferifyFn(hashAlgorithm)
    if (this.hashLeaves) {
      leaves = leaves.map(this.hashAlgo)
    }

    this.leaves = leaves.map(this.bufferify)
    if (this.sortLeaves) {
      this.leaves = this.leaves.sort(Buffer.compare)
    }

    this.layers = [this.leaves]
    this._createHashes(this.leaves)
  }

  private _createHashes (nodes: any[]) {
    while (nodes.length > 1) {
      const layerIndex = this.layers.length

      this.layers.push([])

      for (let i = 0; i < nodes.length; i += 2) {
        if (i + 1 === nodes.length) {
          if (nodes.length % 2 === 1) {
            let data = nodes[nodes.length - 1]
            let hash = data

            // is bitcoin tree
            if (this.isBitcoinTree) {
              // Bitcoin method of duplicating the odd ending nodes
              data = Buffer.concat([reverse(data), reverse(data)])
              hash = this.hashAlgo(data)
              hash = reverse(this.hashAlgo(hash))

              this.layers[layerIndex].push(hash)
              continue
            } else {
              if (!this.duplicateOdd) {
                this.layers[layerIndex].push(nodes[i])
                continue
              }
            }
          }
        }

        const left = nodes[i]
        const right = i + 1 === nodes.length ? left : nodes[i + 1]
        let data = null
        let combined = null

        if (this.isBitcoinTree) {
          combined = [reverse(left), reverse(right)]
        } else {
          combined = [left, right]
        }

        if (this.sortPairs) {
          combined.sort(Buffer.compare)
        }

        data = Buffer.concat(combined)

        let hash = this.hashAlgo(data)

        // double hash if bitcoin tree
        if (this.isBitcoinTree) {
          hash = reverse(this.hashAlgo(hash))
        }

        this.layers[layerIndex].push(hash)
      }

      nodes = this.layers[layerIndex]
    }
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
        values = values.map(this.hashAlgo)
        if (this.sortLeaves) {
          values = values.sort(Buffer.compare)
        }
      }

      return this.leaves.filter(x => this._bufferIndexOf(values, x) !== -1)
    }

    return this.leaves
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
    return this.leaves.map(x => this.bufferToHex(x))
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
    return JSON.stringify(leaves.map(x => MerkleTree.bufferToHex(x)), null, 2)
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

    return parsed.map(x => MerkleTree.bufferify(x))
  }

  /**
   * getLayers
   * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root.
   * @return {Buffer[]}
   * @example
   *```js
   *const layers = tree.getLayers()
   *```
   */
  getLayers ():Buffer[] {
    return this.layers
  }

  /**
   * getHexLayers
   * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root as hex strings.
   * @return {String[]}
   * @example
   *```js
   *const layers = tree.getHexLayers()
   *```
   */
  getHexLayers ():string[] {
    return this.layers.reduce((acc, item, i) => {
      if (Array.isArray(item)) {
        acc.push(item.map(x => this.bufferToHex(x)))
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
    const layers = this.layers.reduce((acc, item, i) => {
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
    return this.getLayersFlat().map(x => this.bufferToHex(x))
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
   *const leaves = ['a', 'b', 'a'].map(x => keccak(x))
   *const tree = new MerkleTree(leaves, keccak)
   *const proof = tree.getProof(leaves[2], 2)
   *```
   */
  getProof (leaf: Buffer, index?: number):any[] {
    leaf = this.bufferify(leaf)
    const proof = []

    if (typeof index !== 'number') {
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

    if (this.isBitcoinTree && index === (this.leaves.length - 1)) {
      // Proof Generation for Bitcoin Trees

      for (let i = 0; i < this.layers.length - 1; i++) {
        const layer = this.layers[i]
        const isRightNode = index % 2
        const pairIndex = (isRightNode ? index - 1 : index)

        if (pairIndex < layer.length) {
          proof.push({
            data: layer[pairIndex]
          })
        }

        // set index to parent index
        index = (index / 2) | 0
      }

      return proof
    } else {
      // Proof Generation for Non-Bitcoin Trees

      for (let i = 0; i < this.layers.length; i++) {
        const layer = this.layers[i]
        const isRightNode = index % 2
        const pairIndex = (isRightNode ? index - 1 : index + 1)

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
  getHexProof (leaf: Buffer, index?: number):string[] {
    return this.getProof(leaf, index).map(x => this.bufferToHex(x.data))
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
    const json = proof.map(x => {
      if (typeof x === 'string') {
        return x
      }

      if (Buffer.isBuffer(x)) {
        return MerkleTree.bufferToHex(x)
      }

      return {
        position: x.position,
        data: MerkleTree.bufferToHex(x.data)
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

    return parsed.map(x => {
      if (typeof x === 'string') {
        return MerkleTree.bufferify(x)
      } else if (x instanceof Object) {
        return {
          position: x.position,
          data: MerkleTree.bufferify(x.data)
        }
      } else {
        throw new Error('Expected item to be of type string or object')
      }
    })
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
    if (!indices) {
      indices = tree
      tree = this.getLayersFlat()

      if (!indices.every(x => typeof x === 'number')) {
        let els = indices
        if (this.sortPairs) {
          els = els.sort(Buffer.compare)
        }

        let ids = els.map((el) => this._bufferIndexOf(this.leaves, el)).sort((a, b) => a === b ? 0 : a > b ? 1 : -1)
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
            const pairElement = this._getPairNode(layer, idx)

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
    }

    return this.getProofIndices(indices, this._log2((tree.length / 2) | 0)).map(index => tree[index])
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
  getHexMultiProof (tree: Buffer[], indices: number[]):string[] {
    return this.getMultiProof(tree, indices).map(this.bufferToHex)
  }

  /**
   * getProofFlags
   * @desc Returns list of booleans where proofs should be used instead of hashing.
   * Proof flags are used in the Solidity multiproof verifiers.
   * @param {Buffer[]} leaves
   * @param {Buffer[]} proofs
   * @return {Boolean[]} - Boolean flags
   * @example
   * ```js
   *const indices = [2, 5, 6]
   *const proof = tree.getMultiProof(indices)
   *const proofFlags = tree.getProofFlags(leaves, proof)
   *```
   */
  getProofFlags (leaves: Buffer[], proofs: Buffer[]):boolean[] {
    let ids = leaves.map((el) => this._bufferIndexOf(this.leaves, el)).sort((a, b) => a === b ? 0 : a > b ? 1 : -1)
    if (!ids.every((idx) => idx !== -1)) {
      throw new Error('Element does not exist in Merkle tree')
    }

    const tested = []
    const flags = []
    for (let index = 0; index < this.layers.length; index++) {
      const layer = this.layers[index]
      ids = ids.reduce((ids, idx) => {
        const skipped = tested.includes(layer[idx])
        if (!skipped) {
          const pairElement = this._getPairNode(layer, idx)
          const proofUsed = proofs.includes(layer[idx]) || proofs.includes(pairElement)
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
  verify (proof: any[], targetNode: Buffer, root: Buffer):boolean {
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

        hash = this.hashAlgo(Buffer.concat(buffers))
        hash = reverse(this.hashAlgo(hash))
      } else {
        if (this.sortPairs) {
          if (Buffer.compare(hash, data) === -1) {
            buffers.push(hash, data)
            hash = this.hashAlgo(Buffer.concat(buffers))
          } else {
            buffers.push(data, hash)
            hash = this.hashAlgo(Buffer.concat(buffers))
          }
        } else {
          buffers.push(hash)
          buffers[isLeftNode ? 'unshift' : 'push'](data)
          hash = this.hashAlgo(Buffer.concat(buffers))
        }
      }
    }

    return Buffer.compare(hash, root) === 0
  }

  /**
   * verifyMultiProof
   * @desc Returns true if the multiproofs can connect the leaves to the Merkle root.
   * @param {Buffer} root - Merkle tree root
   * @param {Number[]} indices - Leave indices
   * @param {Buffer[]} leaves - Leaf values at indices.
   * @param {Number} depth - Tree depth
   * @param {Buffer[]} proof - Multiproofs given indices
   * @return {Boolean}
   * @example
   *```js
   *const root = tree.getRoot()
   *const treeFlat = tree.getLayersFlat()
   *const depth = tree.getDepth()
   *const indices = [2, 5, 6]
   *const proofLeaves = indices.map(i => leaves[i])
   *const proof = tree.getMultiProof(treeFlat, indices)
   *const verified = tree.verifyMultiProof(root, indices, proofLeaves, depth, proof)
   *```
   */
  verifyMultiProof (root: Buffer, indices: number[], leaves: Buffer[], depth: number, proof: Buffer[]):boolean {
    root = this.bufferify(root)
    leaves = leaves.map(this.bufferify)
    proof = proof.map(this.bufferify)

    const tree = {}
    for (const [index, leaf] of this._zip(indices, leaves)) {
      tree[(2 ** depth) + index] = leaf
    }
    for (const [index, proofitem] of this._zip(this.getProofIndices(indices, depth), proof)) {
      tree[index] = proofitem
    }
    let indexqueue = Object.keys(tree).map(x => +x).sort((a, b) => a - b)
    indexqueue = indexqueue.slice(0, indexqueue.length - 1)
    let i = 0
    while (i < indexqueue.length) {
      const index = indexqueue[i]
      if (index >= 2 && ({}).hasOwnProperty.call(tree, index ^ 1)) {
        let pair = [tree[index - (index % 2)], tree[index - (index % 2) + 1]]
        if (this.sortPairs) {
          pair = pair.sort(Buffer.compare)
        }
        tree[(index / 2) | 0] = this.hashAlgo(Buffer.concat(pair))
        indexqueue.push((index / 2) | 0)
      }
      i += 1
    }
    return !indices.length || (({}).hasOwnProperty.call(tree, 1) && tree[1].equals(root))
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
    const layers: any[] = this.getLayers().map((layer: any) => layer.map((value: any) => value.toString('hex')))
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

  toJSON () {
  }

  /**
   * print
   * @desc Prints out a visual representation of the merkle tree.
   * @example
   *```js
   *tree.print()
   *```
   */
  print ():void {
    MerkleTree.print(this)
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
  private _toTreeString ():string {
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
    return this._toTreeString()
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
  static getMultiProof (tree: Buffer[], indices: number[]):Buffer[] {
    const t = new MerkleTree([])
    return t.getMultiProof(tree, indices)
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
  private _getPairNode (layer: Buffer[], idx: number):Buffer {
    const pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1

    if (pairIdx < layer.length) {
      return layer[pairIdx]
    } else {
      return null
    }
  }

  /**
   * bufferIndexOf
   * @desc Returns the first index of which given buffer is found in array.
   * @param {Buffer[]} haystack - Array of buffers.
   * @param {Buffer} needle - Buffer to find.
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.bufferIndexOf(haystack, needle)
   *```
   */
  private _bufferIndexOf (array: Buffer[], element: Buffer):number {
    for (let i = 0; i < array.length; i++) {
      if (element.equals(array[i])) {
        return i
      }
    }

    return -1
  }

  /**
   * bufferify
   * @desc Returns a buffer type for the given value.
   * @param {String|Number|Object|Buffer} value
   * @return {Buffer}
   *
   * @example
   * ```js
   *const buf = MerkleTree.bufferify('0x1234')
   *```
   */
  static bufferify (value: any):Buffer {
    if (!Buffer.isBuffer(value)) {
      // crypto-js support
      if (typeof value === 'object' && value.words) {
        return Buffer.from(value.toString(CryptoJS.enc.Hex), 'hex')
      } else if (MerkleTree.isHexString(value)) {
        return Buffer.from(value.replace(/^0x/, ''), 'hex')
      } else if (typeof value === 'string') {
        return Buffer.from(value)
      }
    }

    return value
  }

  /**
   * isHexString
   * @desc Returns true if value is a hex string.
   * @param {String} value
   * @return {Boolean}
   *
   * @example
   * ```js
   *console.log(MerkleTree.isHexString('0x1234'))
   *```
   */
  static isHexString (v: string):boolean {
    return (typeof v === 'string' && /^(0x)?[0-9A-Fa-f]*$/.test(v))
  }

  /**
   * print
   * @desc Prints out a visual representation of the given merkle tree.
   * @param {Object} tree - Merkle tree instance.
   * @return {String}
   * @example
   *```js
   *MerkleTree.print(tree)
   *```
   */
  static print (tree: any):void {
    console.log(tree.toString())
  }

  /**
   * bufferToHex
   * @desc Returns a hex string with 0x prefix for given buffer.
   * @param {Buffer} value
   * @return {String}
   * @example
   *```js
   *const hexStr = tree.bufferToHex(Buffer.from('A'))
   *```
   */
  bufferToHex (value: Buffer):string {
    return MerkleTree.bufferToHex(value)
  }

  /**
   * bufferToHex
   * @desc Returns a hex string with 0x prefix for given buffer.
   * @param {Buffer} value
   * @return {String}
   * @example
   *```js
   *const hexStr = MerkleTree.bufferToHex(Buffer.from('A'))
   *```
   */
  static bufferToHex (value: Buffer):string {
    return '0x' + value.toString('hex')
  }

  /**
   * bufferify
   * @desc Returns a buffer type for the given value.
   * @param {String|Number|Object|Buffer} value
   * @return {Buffer}
   *
   * @example
   * ```js
   *const buf = tree.bufferify('0x1234')
   *```
   */
  bufferify (value: any):Buffer {
    return MerkleTree.bufferify(value)
  }

  /**
   * bufferifyFn
   * @desc Returns a function that will bufferify the return value.
   * @param {Function}
   * @return {Function}
   *
   * @example
   * ```js
   *const fn = tree.bufferifyFn((value) => sha256(value))
   *```
   */
  private _bufferifyFn (f: any):any {
    return function (value) {
      const v = f(value)
      if (Buffer.isBuffer(v)) {
        return v
      }

      if (this._isHexString(v)) {
        return Buffer.from(v, 'hex')
      }

      // crypto-js support
      return Buffer.from(f(CryptoJS.enc.Hex.parse(value.toString('hex'))).toString(CryptoJS.enc.Hex), 'hex')
    }
  }

  /**
   * isHexString
   * @desc Returns true if value is a hex string.
   * @param {String} value
   * @return {Boolean}
   *
   * @example
   * ```js
   *console.log(MerkleTree.isHexString('0x1234'))
   *```
   */
  private _isHexString (value: string):boolean {
    return MerkleTree.isHexString(value)
  }

  /**
   * log2
   * @desc Returns the log2 of number.
   * @param {Number} value
   * @return {Number}
   */
  private _log2 (n: number):number {
    return n === 1 ? 0 : 1 + this._log2((n / 2) | 0)
  }

  /**
   * zip
   * @desc Returns true if value is a hex string.
   * @param {String[]|Number[]|Buffer[]} a - first array
   * @param {String[]|Number[]|Buffer[]} b -  second array
   * @return {String[][]|Number[][]|Buffer[][]}
   *
   * @example
   * ```js
   *const zipped = tree.zip(['a', 'b'],['A', 'B'])
   *console.log(zipped) // [ [ 'a', 'A' ], [ 'b', 'B' ] ]
   *```
   */
  private _zip (a: any[], b: any[]):any[][] {
    return a.map((e, i) => [e, b[i]])
  }
}

if (typeof window !== 'undefined') {
  ;(window as any).MerkleTree = MerkleTree
}

export default MerkleTree
