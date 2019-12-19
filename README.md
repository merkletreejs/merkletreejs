<h3 align="center">
  <br />
  <img src="https://user-images.githubusercontent.com/168240/39508295-ceeb1576-4d96-11e8-90aa-b2a56825567d.png" alt="logo" width="600" />
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

- [Diagrams](#diagrams)
- [Install](#install)
- [Getting started](#Getting-started)
- [Documentation](#documentation)
- [Test](#test)
- [FAQ](#faq)
- [Notes](#notes)
- [Resources](#resources)
- [Contributing](#contributing)
- [License](#license)

## Diagrams

Diagram of Merkle Tree

<img src="https://user-images.githubusercontent.com/168240/43616375-15330c32-9671-11e8-9057-6e61c312c856.png" alt="Merkle Tree" width="500">

Diagram of Merkle Tree Proof

<img src="https://user-images.githubusercontent.com/168240/43616387-27ec860a-9671-11e8-9f3f-0b871a6581a6.png" alt="Merkle Tree Proof" width="420">

Diagram of Invalid Merkle Tree Proofs

<img src="https://user-images.githubusercontent.com/168240/43616398-33e20584-9671-11e8-9f62-9f48ce412898.png" alt="Merkle Tree Proof" width="420">

Diagram of Bitcoin Merkle Tree

<img src="https://user-images.githubusercontent.com/168240/43616417-46d3293e-9671-11e8-81c3-8cdf7f8ddd77.png" alt="Merkle Tree Proof" width="420">

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

## Documentation

<!-- :%s/// -->
<!-- :%s/\[Options\]()/\[Options\](#options) -->

## Class

Class reprensenting a Merkle Tree

*__namespace__*: MerkleTree

## Hierarchy

**MerkleTree**

### Constructors

* [constructor](#constructor)

### Properties

* [duplicateOdd](#duplicateodd)
* [hashAlgo](#hashalgo)
* [hashLeaves](#hashleaves)
* [isBitcoinTree](#isbitcointree)
* [layers](#layers)
* [leaves](#leaves)
* [sort](#sort)
* [sortLeaves](#sortleaves)
* [sortPairs](#sortpairs)

### Methods

* [createHashes](#createhashes)
* [getLayers](#getlayers)
* [getLayersAsObject](#getlayersasobject)
* [getLeaves](#getleaves)
* [getProof](#getproof)
* [getRoot](#getroot)
* [print](#print)
* [toString](#tostring)
* [toTreeString](#totreestring)
* [verify](#verify)
* [bufferify](#bufferify)
* [print](#print-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new MerkleTree**(leaves: *`any`*, hashAlgorithm: *`any`*, options?: *[Options]()

*__desc__*: Constructs a Merkle Tree. All nodes and leaves are stored as Buffers. Lonely leaf nodes are promoted to the next level up without being hashed again.

*__example__*:
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

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| leaves | `any` | - |  Array of hashed leaves. Each leaf must be a Buffer. |
| hashAlgorithm | `any` | - |  Algorithm used for hashing leaves and nodes |
| `Default value` options | [Options]() | {} as any |  Additional options |

**Returns:** [MerkleTree]()

___

## Properties

<a id="duplicateodd"></a>

###  duplicateOdd

**● duplicateOdd**: *`boolean`*

___
<a id="hashalgo"></a>

###  hashAlgo

**● hashAlgo**: *`function`*

#### Type declaration
▸(value: *`any`*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `any` |

**Returns:** `any`

___
<a id="hashleaves"></a>

###  hashLeaves

**● hashLeaves**: *`boolean`*

___
<a id="isbitcointree"></a>

###  isBitcoinTree

**● isBitcoinTree**: *`boolean`*

___
<a id="layers"></a>

###  layers

**● layers**: *`any`[]*

___
<a id="leaves"></a>

###  leaves

**● leaves**: *`any`[]*

___
<a id="sortleaves"></a>

###  sortLeaves

**● sortLeaves**: *`boolean`*

___
<a id="sortpairs"></a>

###  sortPairs

**● sortPairs**: *`boolean`*

___

## Methods

<a id="createhashes"></a>

###  createHashes

▸ **createHashes**(nodes: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| nodes | `any` |

**Returns:** `void`

___
<a id="getlayers"></a>

###  getLayers

▸ **getLayers**(): `any`[]

getLayers

*__desc__*: Returns array of all layers of Merkle Tree, including leaves and root.

*__example__*:
 ```js
const layers = tree.getLayers()
```

**Returns:** `any`[]

___
<a id="getlayersasobject"></a>

###  getLayersAsObject

▸ **getLayersAsObject**(): `any`

**Returns:** `any`

___
<a id="getleaves"></a>

###  getLeaves

▸ **getLeaves**(): `any`[]

getLeaves

*__desc__*: Returns array of leaves of Merkle Tree.

*__example__*:
 ```js
const leaves = tree.getLeaves()
```

**Returns:** `any`[]

___
<a id="getproof"></a>

###  getProof

▸ **getProof**(leaf: *`any`*, index?: *`any`*): `any`[]

getProof

*__desc__*: Returns the proof for a target leaf.

*__example__*:
 ```js
const proof = tree.getProof(leaves[2])
```

*__example__*:
 ```js
const leaves = ['a', 'b', 'a'].map(x => keccak(x))
const tree = new MerkleTree(leaves, keccak)
const proof = tree.getProof(leaves[2], 2)
```

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| leaf | `any` |  Target leaf |
| `Optional` index | `any` |

**Returns:** `any`[]
*   Array of objects containing a position property of type string with values of 'left' or 'right' and a data property of type Buffer.

___
<a id="getroot"></a>

###  getRoot

▸ **getRoot**(): `any`

getRoot

*__desc__*: Returns the Merkle root hash as a Buffer.

*__example__*:
 ```js
const root = tree.getRoot()
```

**Returns:** `any`

___
<a id="print"></a>

###  print

▸ **print**(): `void`

**Returns:** `void`

___
<a id="tostring"></a>

###  toString

▸ **toString**(): `any`

**Returns:** `any`

___
<a id="totreestring"></a>

###  toTreeString

▸ **toTreeString**(): `any`

**Returns:** `any`

___
<a id="verify"></a>

###  verify

▸ **verify**(proof: *`any`*, targetNode: *`any`*, root: *`any`*): `boolean`

verify

*__desc__*: Returns true if the proof path (array of hashes) can connect the target node to the Merkle root.

*__example__*:
 ```js
const root = tree.getRoot()
const proof = tree.getProof(leaves[2])
const verified = tree.verify(proof, leaves[2], root)
```

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| proof | `any` |  Array of proof objects that should connect target node to Merkle root. |
| targetNode | `any` |  Target node Buffer |
| root | `any` |  Merkle root Buffer |

**Returns:** `boolean`

___
<a id="bufferify"></a>

### `<Static>` bufferify

▸ **bufferify**(x: *`any`*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| x | `any` |

**Returns:** `any`

___
<a id="print-1"></a>

### `<Static>` print

▸ **print**(tree: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| tree | `any` |

**Returns:** `void`

## Interface

## Options

### Properties

* [duplicateOdd](#duplicateodd)
* [hashLeaves](#hashleaves)
* [isBitcoinTree](#isbitcointree)
* [sort](#sort)
* [sortLeaves](#sortleaves)
* [sortPairs](#sortpairs)

---

## Properties

<a id="duplicateodd"></a>

###  duplicateOdd

**● duplicateOdd**: *`boolean`*

If set to `true`, an odd node will be duplicated and combined to make a pair to generate the layer hash.

___
<a id="hashleaves"></a>

###  hashLeaves

**● hashLeaves**: *`boolean`*

If set to `true`, the leaves will hashed using the set hashing algorithms.

___
<a id="isbitcointree"></a>

###  isBitcoinTree

**● isBitcoinTree**: *`boolean`*

If set to `true`, constructs the Merkle Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need to replicate Bitcoin constructed Merkle Trees. In Bitcoin Merkle Trees, single nodes are combined with themselves, and each output hash is hashed again.

___
<a id="sortleaves"></a>

### sort

**● sort**: *`boolean`*

If set to `true`, the leaves and hashing pairs will be sorted.

###  sortLeaves

**● sortLeaves**: *`boolean`*

If set to `true`, the leaves will be sorted.

___
<a id="sortpairs"></a>

###  sortPairs

**● sortPairs**: *`boolean`*

If set to `true`, the hashing pairs will be sorted.

## Test

```bash
npm test
```

## FAQ

- Q: How do you verify merkle proofs in Solidity?
  - A: Check out the example repo [merkletreejs-solidity](https://github.com/miguelmota/merkletreejs-solidity) on how to generate merkle proofs with this library and verify them in Solidity.

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

## Contributing

Pull requests are welcome!

For contributions please create a new branch and submit a pull request for review.

## License

[MIT](LICENSE)
