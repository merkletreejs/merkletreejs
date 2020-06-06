<h3 align="center">
  <br />
  <img src="https://user-images.githubusercontent.com/168240/83951171-85f48c80-a7e4-11ea-896e-529c28ffa18e.png" alt="merkletree.js logo" width="600" />
  <br />
  <br />
  <br />
</h3>

# MerkleTree.js

> Construct [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree) and verify proofs in JavaScript.

[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/miguelmota/merkletreejs/master/LICENSE)
[![Build Status](https://travis-ci.org/miguelmota/merkletreejs.svg?branch=master)](https://travis-ci.org/miguelmota/merkletreejs)
[![dependencies Status](https://david-dm.org/miguelmota/merkletreejs/status.svg)](https://david-dm.org/miguelmota/merkletreejs)
[![NPM version](https://badge.fury.io/js/merkletreejs.svg)](http://badge.fury.io/js/merkletreejs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

## Contents

- [Install](#install)
- [Getting started](#Getting-started)
- [Diagrams](#diagrams)
- [Documentation](#documentation)
- [Test](#test)
- [FAQ](#faq)
- [Notes](#notes)
- [Resources](#resources)
- [Contributing](#contributing)
- [License](#license)

## Install

```bash
npm install merkletreejs
```

## Getting started

Construct tree, generate proof, and verify proof:

```js
const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

const leaves = ['a', 'b', 'c'].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256)
const root = tree.getRoot().toString('hex')
const leaf = SHA256('a')
const proof = tree.getProof(leaf)
console.log(tree.verify(proof, leaf, root)) // true


const badLeaves = ['a', 'x', 'c'].map(x => SHA256(x))
const badTree = new MerkleTree(badLeaves, SHA256)
const badLeaf = SHA256('x')
const badProof = tree.getProof(badLeaf)
console.log(tree.verify(badProof, leaf, root)) // false
```

Print tree to console:

```js
MerkleTree.print(tree)
```

Output

```bash
└─ 311d2e46f49b15fff8b746b74ad57f2cc9e0d9939fda94387141a2d3fdf187ae
   ├─ 176f0f307632fdd5831875eb709e2f68d770b102262998b214ddeb3f04164ae1
   │  ├─ 3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb
   │  └─ b5553de315e0edf504d9150af82dafa5c4667fa618ed0a6f19c69b41166c5510
   └─ 0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2
      └─ 0b42b6393c1f53060fe3ddbfcd7aadcca894465a5a438f69c87d790b2299b9b2
```

## Diagrams

Visualization of Merkle Tree

<img src="https://user-images.githubusercontent.com/168240/43616375-15330c32-9671-11e8-9057-6e61c312c856.png" alt="Merkle Tree" width="500">

Visualization of Merkle Tree Proof

<img src="https://user-images.githubusercontent.com/168240/43616387-27ec860a-9671-11e8-9f3f-0b871a6581a6.png" alt="Merkle Tree Proof" width="420">

Visualization of Invalid Merkle Tree Proofs

<img src="https://user-images.githubusercontent.com/168240/43616398-33e20584-9671-11e8-9f62-9f48ce412898.png" alt="Merkle Tree Proof" width="420">

Visualization of Bitcoin Merkle Tree

<img src="https://user-images.githubusercontent.com/168240/43616417-46d3293e-9671-11e8-81c3-8cdf7f8ddd77.png" alt="Merkle Tree Proof" width="420">

## Documentation

<!-- :%s/// -->
<!-- :%s/\[Options\]()/\[Options\](#options) -->

# Class: MerkleTree

Class reprensenting a Merkle Tree

**`namespace`** MerkleTree

## Hierarchy

* **MerkleTree**

## Index

### Constructors

* [constructor](_index_.merkletree.md#constructor)

### Methods

* [getDepth](_index_.merkletree.md#getdepth)
* [getHexLayers](_index_.merkletree.md#gethexlayers)
* [getHexLayersFlat](_index_.merkletree.md#gethexlayersflat)
* [getHexLeaves](_index_.merkletree.md#gethexleaves)
* [getHexMultiProof](_index_.merkletree.md#gethexmultiproof)
* [getHexProof](_index_.merkletree.md#gethexproof)
* [getHexRoot](_index_.merkletree.md#gethexroot)
* [getLayers](_index_.merkletree.md#getlayers)
* [getLayersAsObject](_index_.merkletree.md#getlayersasobject)
* [getLayersFlat](_index_.merkletree.md#getlayersflat)
* [getLeaves](_index_.merkletree.md#getleaves)
* [getMultiProof](_index_.merkletree.md#getmultiproof)
* [getProof](_index_.merkletree.md#getproof)
* [getProofFlags](_index_.merkletree.md#getproofflags)
* [getProofIndices](_index_.merkletree.md#getproofindices)
* [getRoot](_index_.merkletree.md#getroot)
* [print](_index_.merkletree.md#print)
* [toString](_index_.merkletree.md#tostring)
* [verify](_index_.merkletree.md#verify)
* [verifyMultiProof](_index_.merkletree.md#verifymultiproof)
* [bufferify](_index_.merkletree.md#static-bufferify)
* [getMultiProof](_index_.merkletree.md#static-getmultiproof)
* [isHexString](_index_.merkletree.md#static-ishexstring)
* [print](_index_.merkletree.md#static-print)

## Constructors

###  constructor

\+ **new MerkleTree**(`leaves`: any, `hashAlgorithm`: any, `options`: [Options](../interfaces/_index_.options.md)): *[MerkleTree](_index_.merkletree.md)*

*Defined in [index.ts:39](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L39)*

**`desc`** Constructs a Merkle Tree.
All nodes and leaves are stored as Buffers.
Lonely leaf nodes are promoted to the next level up without being hashed again.

**`example`**
```js
const MerkleTree = require('merkletreejs')
const crypto = require('crypto')

function sha256(data) {
 // returns Buffer
 return crypto.createHash('sha256').update(data).digest()
}

const leaves = ['a', 'b', 'c'].map(x => keccak(x))

const tree = new MerkleTree(leaves, sha256)
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`leaves` | any | - | Array of hashed leaves. Each leaf must be a Buffer. |
`hashAlgorithm` | any | SHA256 | Algorithm used for hashing leaves and nodes |
`options` | [Options](../interfaces/_index_.options.md) | {} | Additional options |

**Returns:** *[MerkleTree](_index_.merkletree.md)*

## Methods

###  getDepth

▸ **getDepth**(): *number*

*Defined in [index.ts:665](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L665)*

getDepth

**`desc`** Returns the tree depth (number of layers)

**`example`**
```js
const depth = tree.getDepth()
```

**Returns:** *number*

___

###  getHexLayers

▸ **getHexLayers**(): *any*

*Defined in [index.ts:211](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L211)*

getHexLayers

**`desc`** Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root as hex strings.

**`example`**
```js
const layers = tree.getHexLayers()
```

**Returns:** *any*

___

###  getHexLayersFlat

▸ **getHexLayersFlat**(): *any*

*Defined in [index.ts:257](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L257)*

getHexLayersFlat

**`desc`** Returns single flat array of all layers of Merkle Tree, including leaves and root as hex string.

**`example`**
```js
const layers = tree.getHexLayersFlat()
```

**Returns:** *any*

___

###  getHexLeaves

▸ **getHexLeaves**(): *string[]*

*Defined in [index.ts:185](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L185)*

getHexLeaves

**`desc`** Returns array of leaves of Merkle Tree as hex strings.

**`example`**
```js
const leaves = tree.getHexLeaves()
```

**Returns:** *string[]*

___

###  getHexMultiProof

▸ **getHexMultiProof**(`tree`: any, `indices`: any): *string[]*

*Defined in [index.ts:496](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L496)*

getHexMultiProof

**`desc`** Returns the multiproof for given tree indices as hex strings.

**`example`**
```js
const indices = [2, 5, 6]
const proof = tree.getHexMultiProof(indices)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tree` | any | - |
`indices` | any | Tree indices. |

**Returns:** *string[]*

- Multiproofs as hex strings.

___

###  getHexProof

▸ **getHexProof**(`leaf`: any, `index?`: any): *string[]*

*Defined in [index.ts:379](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L379)*

getHexProof

**`desc`** Returns the proof for a target leaf as hex strings.

**`example`**
```js
const proof = tree.getHexProof(leaves[2])
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`leaf` | any | Target leaf |
`index?` | any | - |

**Returns:** *string[]*

- Proof array as hex strings.

___

###  getHexRoot

▸ **getHexRoot**(): *string*

*Defined in [index.ts:283](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L283)*

getHexRoot

**`desc`** Returns the Merkle root hash as a hex string.

**`example`**
```js
const root = tree.getHexRoot()
```

**Returns:** *string*

___

###  getLayers

▸ **getLayers**(): *any[]*

*Defined in [index.ts:198](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L198)*

getLayers

**`desc`** Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root.

**`example`**
```js
const layers = tree.getLayers()
```

**Returns:** *any[]*

___

###  getLayersAsObject

▸ **getLayersAsObject**(): *any*

*Defined in [index.ts:677](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L677)*

getLayersAsObject

**`desc`** Returns the layers as nested objects instead of an array.

**`example`**
```js
const layersObj = tree.getLayersAsObject()
```

**Returns:** *any*

___

###  getLayersFlat

▸ **getLayersFlat**(): *any*

*Defined in [index.ts:232](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L232)*

getLayersFlat

**`desc`** Returns single flat array of all layers of Merkle Tree, including leaves and root.

**`example`**
```js
const layers = tree.getLayersFlat()
```

**Returns:** *any*

___

###  getLeaves

▸ **getLeaves**(`data?`: any[]): *any[]*

*Defined in [index.ts:161](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L161)*

getLeaves

**`desc`** Returns array of leaves of Merkle Tree.

**`example`**
```js
const leaves = tree.getLeaves()
```

**Parameters:**

Name | Type |
------ | ------ |
`data?` | any[] |

**Returns:** *any[]*

___

###  getMultiProof

▸ **getMultiProof**(`tree`: any, `indices`: any): *any[]*

*Defined in [index.ts:440](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L440)*

getMultiProof

**`desc`** Returns the multiproof for given tree indices.

**`example`**
```js
const indices = [2, 5, 6]
const proof = tree.getMultiProof(indices)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tree` | any | - |
`indices` | any | Tree indices. |

**Returns:** *any[]*

- Multiproofs

___

###  getProof

▸ **getProof**(`leaf`: any, `index?`: any): *any[]*

*Defined in [index.ts:307](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L307)*

getProof

**`desc`** Returns the proof for a target leaf.

**`example`**
```js
const proof = tree.getProof(leaves[2])
```

**`example`**
```js
const leaves = ['a', 'b', 'a'].map(x => keccak(x))
const tree = new MerkleTree(leaves, keccak)
const proof = tree.getProof(leaves[2], 2)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`leaf` | any | Target leaf |
`index?` | any | - |

**Returns:** *any[]*

- Array of objects containing a position property of type string
with values of 'left' or 'right' and a data property of type Buffer.

___

###  getProofFlags

▸ **getProofFlags**(`els`: any, `proofs`: any): *any[]*

*Defined in [index.ts:513](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L513)*

getProofFlags

**`desc`** Returns list of booleans where proofs should be used instead of hashing.
Proof flags are used in the Solidity multiproof verifiers.

**`example`**
```js
const indices = [2, 5, 6]
const proof = tree.getMultiProof(indices)
const proofFlags = tree.getProofFlags(leaves, proof)
```

**Parameters:**

Name | Type |
------ | ------ |
`els` | any |
`proofs` | any |

**Returns:** *any[]*

- Boolean flags

___

###  getProofIndices

▸ **getProofIndices**(`treeIndices`: any, `depth`: any): *any[]*

*Defined in [index.ts:395](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L395)*

getProofIndices

**`desc`** Returns the proof indices for given tree indices.

**`example`**
```js
const proofIndices = tree.getProofIndices([2,5,6], 4)
console.log(proofIndices) // [ 23, 20, 19, 8, 3 ]
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`treeIndices` | any | Tree indices |
`depth` | any | Tree depth; number of layers. |

**Returns:** *any[]*

- Proof indices

___

###  getRoot

▸ **getRoot**(): *any*

*Defined in [index.ts:270](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L270)*

getRoot

**`desc`** Returns the Merkle root hash as a Buffer.

**`example`**
```js
const root = tree.getRoot()
```

**Returns:** *any*

___

###  print

▸ **print**(): *void*

*Defined in [index.ts:713](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L713)*

print

**`desc`** Prints out a visual representation of the merkle tree.

**`example`**
```js
tree.print()
```

**Returns:** *void*

___

###  toString

▸ **toString**(): *any*

*Defined in [index.ts:739](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L739)*

toString

**`desc`** Returns a visual representation of the merkle tree as a string.

**`example`**
```js
console.log(tree.toString())
```

**Returns:** *any*

___

###  verify

▸ **verify**(`proof`: any, `targetNode`: any, `root`: any): *boolean*

*Defined in [index.ts:556](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L556)*

verify

**`desc`** Returns true if the proof path (array of hashes) can connect the target node
to the Merkle root.

**`example`**
```js
const root = tree.getRoot()
const proof = tree.getProof(leaves[2])
const verified = tree.verify(proof, leaves[2], root)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`proof` | any | Array of proof objects that should connect target node to Merkle root. |
`targetNode` | any | Target node Buffer |
`root` | any | Merkle root Buffer |

**Returns:** *boolean*

___

###  verifyMultiProof

▸ **verifyMultiProof**(`root`: any, `indices`: any, `leaves`: any, `depth`: any, `proof`: any): *any*

*Defined in [index.ts:630](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L630)*

verifyMultiProof

**`desc`** Returns true if the multiproofs can connect the leaves to the Merkle root.

**`example`**
```js
const root = tree.getRoot()
const treeFlat = tree.getLayersFlat()
const depth = tree.getDepth()
const indices = [2, 5, 6]
const proofLeaves = indices.map(i => leaves[i])
const proof = tree.getMultiProof(treeFlat, indices)
const verified = tree.verifyMultiProof(root, indices, proofLeaves, depth, proof)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`root` | any | Merkle tree root |
`indices` | any | Leave indices |
`leaves` | any | Leaf values at indices. |
`depth` | any | Tree depth |
`proof` | any | Multiproofs given indices |

**Returns:** *any*

___

### `Static` bufferify

▸ **bufferify**(`x`: any): *any*

*Defined in [index.ts:817](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L817)*

bufferify

**`desc`** Returns a buffer type for the given value.

**`example`**
```js
const buf = MerkleTree.bufferify('0x1234')
```

**Parameters:**

Name | Type |
------ | ------ |
`x` | any |

**Returns:** *any*

___

### `Static` getMultiProof

▸ **getMultiProof**(`tree`: any, `indices`: any): *any[]*

*Defined in [index.ts:757](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L757)*

getMultiProof

**`desc`** Returns the multiproof for given tree indices.

**`example`**
```js
const flatTree = tree.getLayersFlat()
const indices = [2, 5, 6]
const proof = MerkleTree.getMultiProof(flatTree, indices)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tree` | any | Tree as a flat array. |
`indices` | any | Tree indices. |

**Returns:** *any[]*

- Multiproofs

___

### `Static` isHexString

▸ **isHexString**(`v`: any): *boolean*

*Defined in [index.ts:843](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L843)*

isHexString

**`desc`** Returns true if value is a hex string.

**`example`**
```js
console.log(MerkleTree.isHexString('0x1234'))
```

**Parameters:**

Name | Type |
------ | ------ |
`v` | any |

**Returns:** *boolean*

___

### `Static` print

▸ **print**(`tree`: any): *void*

*Defined in [index.ts:857](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L857)*

print

**`desc`** Prints out a visual representation of the given merkle tree.

**`example`**
```js
MerkleTree.print(tree)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tree` | any | Merkle tree instance. |

**Returns:** *void*

# Interface: Options

## Hierarchy

* **Options**

## Index

### Properties

* [duplicateOdd](_index_.options.md#optional-duplicateodd)
* [hashLeaves](_index_.options.md#optional-hashleaves)
* [isBitcoinTree](_index_.options.md#optional-isbitcointree)
* [sort](_index_.options.md#optional-sort)
* [sortLeaves](_index_.options.md#optional-sortleaves)
* [sortPairs](_index_.options.md#optional-sortpairs)

## Properties

### `Optional` duplicateOdd

• **duplicateOdd**? : *boolean*

*Defined in [index.ts:8](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L8)*

If set to `true`, an odd node will be duplicated and combined to make a pair to generate the layer hash.

___

### `Optional` hashLeaves

• **hashLeaves**? : *boolean*

*Defined in [index.ts:10](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L10)*

If set to `true`, the leaves will hashed using the set hashing algorithms.

___

### `Optional` isBitcoinTree

• **isBitcoinTree**? : *boolean*

*Defined in [index.ts:12](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L12)*

If set to `true`, constructs the Merkle Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need to replicate Bitcoin constructed Merkle Trees. In Bitcoin Merkle Trees, single nodes are combined with themselves, and each output hash is hashed again.

___

### `Optional` sort

• **sort**? : *boolean*

*Defined in [index.ts:18](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L18)*

If set to `true`, the leaves and hashing pairs will be sorted.

___

### `Optional` sortLeaves

• **sortLeaves**? : *boolean*

*Defined in [index.ts:14](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L14)*

If set to `true`, the leaves will be sorted.

___

### `Optional` sortPairs

• **sortPairs**? : *boolean*

*Defined in [index.ts:16](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L16)*

If set to `true`, the hashing pairs will be sorted.

# Module: "index"

## Index

### Classes

* [MerkleTree](../classes/_index_.merkletree.md)

### Interfaces

* [Options](../interfaces/_index_.options.md)

### Type aliases

* [THashAlgo](_index_.md#thashalgo)
* [TLayer](_index_.md#tlayer)
* [TLeaf](_index_.md#tleaf)
* [TValue](_index_.md#tvalue)

## Type aliases

###  THashAlgo

Ƭ **THashAlgo**: *any*

*Defined in [index.ts:21](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L21)*

___

###  TLayer

Ƭ **TLayer**: *any*

*Defined in [index.ts:24](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L24)*

___

###  TLeaf

Ƭ **TLeaf**: *any*

*Defined in [index.ts:23](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L23)*

___

###  TValue

Ƭ **TValue**: *any*

*Defined in [index.ts:22](https://github.com/miguelmota/merkletreejs/blob/a69a927/index.ts#L22)*

## Test

```bash
npm test
```

## FAQ

- Q: How do you verify merkle proofs in Solidity?
  - A: Check out the example repo [merkletreejs-solidity](https://github.com/miguelmota/merkletreejs-solidity) on how to generate merkle proofs with this library and verify them in Solidity.

- Q: How do you verify merkle [multiproofs](https://github.com/ethereum/eth2.0-specs/blob/dev/ssz/merkle-proofs.md#merkle-multiproofs) in Solidity?
  - A: Check out the example repo [merkletreejs-multiproof-solidity](https://github.com/miguelmota/merkletreejs-multiproof-solidity) on how to generate merkle multiproofs with this library and verify them in Solidity.

## Notes

As is, this implemenation is vulnerable to a [second pre-image attack](https://en.wikipedia.org/wiki/Merkle_tree#Second_preimage_attack). Use a difference hashing algorithm function for leaves and nodes, so that `H(x) != H'(x)`.

Also, as is, this implementation is vulnerable to a forgery attack for an unbalanced tree, where the last leaf node can be duplicated to create an artificial balanced tree, resulting in the same Merkle root hash. Do not accept unbalanced tree to prevent this.

More info [here](https://bitcointalk.org/?topic=102395).

## Resources

- [Bitcoin mining the hard way: the algorithms, protocols, and bytes](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html)

- [Bitcoin Talk - Merkle Trees](https://bitcointalk.org/index.php?topic=403231.msg9054025#msg9054025)

- [How Log Proofs Work](https://www.certificate-transparency.org/log-proofs-work)

- [Raiden Merkle Tree Implemenation](https://github.com/raiden-network/raiden/blob/f9cf12571891cdf54feb4667cd2fffcb3d5daa89/raiden/mtree.py)

- [Why aren't Solidity sha3 hashes not matching what other sha3 libraries produce?](https://ethereum.stackexchange.com/questions/559/why-arent-solidity-sha3-hashes-not-matching-what-other-sha3-libraries-produce)

- [What is the purpose of using different hash functions for the leaves and internals of a hash tree?](https://crypto.stackexchange.com/questions/2106/what-is-the-purpose-of-using-different-hash-functions-for-the-leaves-and-interna)

- [Why is the full Merkle path needed to verify a transaction?](https://bitcoin.stackexchange.com/questions/50674/why-is-the-full-merkle-path-needed-to-verify-a-transaction)

- [Where is Double hashing performed in Bitcoin?](https://bitcoin.stackexchange.com/questions/8443/where-is-double-hashing-performed-in-bitcoin)

- [Compact Merkle Multiproofs](https://arxiv.org/pdf/2002.07648.pdf)

- [Eth 2.0 specs - Merkle Multiproofs](https://github.com/ethereum/eth2.0-specs/blob/dev/ssz/merkle-proofs.md#merkle-multiproofs)

## Contributing

Pull requests are welcome!

For contributions please create a new branch and submit a pull request for review.

## License

[MIT](LICENSE)
