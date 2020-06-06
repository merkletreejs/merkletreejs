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
  constructor (leaves, hashAlgorithm=SHA256, options: Options = {}) {
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

    this.leaves = leaves.map(this._bufferify)
    if (this.sortLeaves) {
      this.leaves = this.leaves.sort(Buffer.compare)
    }

    this.layers = [this.leaves]
    this._createHashes(this.leaves)
  }

  private _createHashes (nodes) {
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
        let right = i + 1 === nodes.length ? left : nodes[i + 1]
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
  getLeaves (data?: any[]) {
    if (Array.isArray(data)) {
      if (this.hashLeaves) {
        data = data.map(this.hashAlgo)
        if (this.sortLeaves) {
          data = data.sort(Buffer.compare)
        }
      }

      return this.leaves.filter(x => this._bufferIndexOf(data, x) !== -1)
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
  getHexLeaves () {
    return this.leaves.map(x => this._bufferToHex(x))
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
  getLayers () {
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
  getHexLayers () {
    return this.layers.reduce((acc, item, i) => {
      if (Array.isArray(item)) {
        acc.push(item.map(x => this._bufferToHex(x)))
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
  getLayersFlat () {
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
  getHexLayersFlat () {
    return this.getLayersFlat().map(x => this._bufferToHex(x))
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
  getRoot () {
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
  getHexRoot () {
    return this._bufferToHex(this.getRoot())
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
  getProof (leaf, index?) {
    leaf = this._bufferify(leaf)
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
  getHexProof (leaf, index?) {
    return this.getProof(leaf, index).map(x => this._bufferToHex(x.data))
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
  getProofIndices (treeIndices, depth) {
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
    maximalIndices = a.concat(b)

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
  getMultiProof (tree, indices) {
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

        for (let i= 0; i< this.layers.length; i++) {
          const layer = this.layers[i]
          for (let j = 0; j < ids.length; j++) {
            const idx = ids[j]
            const pairElement = this._getPairNode(layer, idx)

            hashes.push(layer[idx])
            if (pairElement) {
              proof.push(pairElement)
            }

            nextIds.push((idx / 2)|0)
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
  getHexMultiProof (tree, indices) {
    return this.getMultiProof(tree, indices).map(this._bufferToHex)
  }

  /**
   * getProofFlags
   * @desc Returns list of booleans where proofs should be used instead of hashing.
   * Proof flags are used in the Solidity multiproof verifiers.
   * @param {Number[]} indices - Tree indices.
   * @return {Boolean[]} - Boolean flags
   * @example
   * ```js
   *const indices = [2, 5, 6]
   *const proof = tree.getMultiProof(indices)
   *const proofFlags = tree.getProofFlags(leaves, proof)
   *```
   */
  getProofFlags (els, proofs) {
    let ids = els.map((el) => this._bufferIndexOf(this.leaves, el)).sort((a, b) => a === b ? 0 : a > b ? 1 : -1)
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
        ids.push((idx / 2)|0)
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
  verify (proof, targetNode, root) {
    let hash = this._bufferify(targetNode)
    root = this._bufferify(root)

    if (!Array.isArray(proof) ||
      !proof.length ||
      !targetNode ||
      !root) {
      return false
    }

    for (let i = 0; i < proof.length; i++) {
      const node = proof[i]
      let data = null
      let isLeftNode = null

      // NOTE: case for when proof is hex values only
      if (typeof node === 'string') {
        data = this._bufferify(node)
        isLeftNode = true
      } else {
        data = node.data
        isLeftNode = (node.position === 'left')
      }

      const buffers = []

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
  verifyMultiProof (root, indices, leaves, depth, proof) {
    root = this._bufferify(root)
    leaves = leaves.map(this._bufferify)
    proof = proof.map(this._bufferify)

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
        tree[(index / 2) | 0] = this.hashAlgo(Buffer.concat([tree[index - (index % 2)], tree[index - (index % 2) + 1]]))
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
  getDepth () {
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
  getLayersAsObject () {
    const layers = this.getLayers().map(x => x.map(x => x.toString('hex')))
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
   * print
   * @desc Prints out a visual representation of the merkle tree.
   * @example
   *```js
   *tree.print()
   *```
   */
  print () {
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
  private _toTreeString () {
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
  toString () {
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
  static getMultiProof (tree, indices) {
    const t = new MerkleTree([])
    return t.getMultiProof(tree.getLayersFlat(), indices)
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
  private _getPairNode(layer, idx) {
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
  private _bufferIndexOf (arr, el) {
    for (let i = 0; i < arr.length; i++) {
      if (el.equals(arr[i])) {
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
  static bufferify (x) {
    if (!Buffer.isBuffer(x)) {
      // crypto-js support
      if (typeof x === 'object' && x.words) {
        return Buffer.from(x.toString(CryptoJS.enc.Hex), 'hex')
      } else if (MerkleTree.isHexString(x)) {
        return Buffer.from(x.replace(/^0x/, ''), 'hex')
      } else if (typeof x === 'string') {
        return Buffer.from(x)
      }
    }

    return x
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
  static isHexString (v) {
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
  static print (tree) {
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
  private _bufferToHex (value: Buffer) {
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
   *const buf = MerkleTree.bufferify('0x1234')
   *```
   */
  private _bufferify (x) {
    return MerkleTree.bufferify(x)
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
  private _bufferifyFn (f) {
    return function (x) {
      const v = f(x)
      if (Buffer.isBuffer(v)) {
        return v
      }

      if (this._isHexString(v)) {
        return Buffer.from(v, 'hex')
      }

      // crypto-js support
      return Buffer.from(f(CryptoJS.enc.Hex.parse(x.toString('hex'))).toString(CryptoJS.enc.Hex), 'hex')
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
  private _isHexString (v) {
    return MerkleTree.isHexString(v)
  }

  /**
   * log2
   * @desc Returns the log2 of number.
   * @param {Number} value
   * @return {Number}
   */
  private _log2 (x) {
    return x === 1 ? 0 : 1 + this._log2((x / 2) | 0)
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
  private _zip (a, b) {
    return a.map((e, i) => [e, b[i]])
  }
}

export default MerkleTree
