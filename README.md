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

## Class

## Hierarchy

**MerkleTree**

### Constructors

* [constructor](api-classes-index-merkletree.md#constructor)

### Properties

* [duplicateOdd](api-classes-index-merkletree.md#duplicateodd)
* [hashAlgo](api-classes-index-merkletree.md#hashalgo)
* [hashLeaves](api-classes-index-merkletree.md#hashleaves)
* [isBitcoinTree](api-classes-index-merkletree.md#isbitcointree)
* [layers](api-classes-index-merkletree.md#layers)
* [leaves](api-classes-index-merkletree.md#leaves)
* [sort](api-classes-index-merkletree.md#sort)
* [sortLeaves](api-classes-index-merkletree.md#sortleaves)
* [sortPairs](api-classes-index-merkletree.md#sortpairs)

### Methods

* [_bufferIndexOf](api-classes-index-merkletree.md#_bufferindexof)
* [_bufferToHex](api-classes-index-merkletree.md#_buffertohex)
* [_bufferify](api-classes-index-merkletree.md#_bufferify)
* [_bufferifyFn](api-classes-index-merkletree.md#_bufferifyfn)
* [_createHashes](api-classes-index-merkletree.md#_createhashes)
* [_getPairNode](api-classes-index-merkletree.md#_getpairnode)
* [_isHexString](api-classes-index-merkletree.md#_ishexstring)
* [_log2](api-classes-index-merkletree.md#_log2)
* [_toTreeString](api-classes-index-merkletree.md#_totreestring)
* [_zip](api-classes-index-merkletree.md#_zip)
* [getDepth](api-classes-index-merkletree.md#getdepth)
* [getHexLayers](api-classes-index-merkletree.md#gethexlayers)
* [getHexLayersFlat](api-classes-index-merkletree.md#gethexlayersflat)
* [getHexLeaves](api-classes-index-merkletree.md#gethexleaves)
* [getHexMultiProof](api-classes-index-merkletree.md#gethexmultiproof)
* [getHexProof](api-classes-index-merkletree.md#gethexproof)
* [getHexRoot](api-classes-index-merkletree.md#gethexroot)
* [getLayers](api-classes-index-merkletree.md#getlayers)
* [getLayersAsObject](api-classes-index-merkletree.md#getlayersasobject)
* [getLayersFlat](api-classes-index-merkletree.md#getlayersflat)
* [getLeaves](api-classes-index-merkletree.md#getleaves)
* [getMultiProof](api-classes-index-merkletree.md#getmultiproof)
* [getProof](api-classes-index-merkletree.md#getproof)
* [getProofFlags](api-classes-index-merkletree.md#getproofflags)
* [getProofIndices](api-classes-index-merkletree.md#getproofindices)
* [getRoot](api-classes-index-merkletree.md#getroot)
* [print](api-classes-index-merkletree.md#print)
* [toString](api-classes-index-merkletree.md#tostring)
* [verify](api-classes-index-merkletree.md#verify)
* [verifyMultiProof](api-classes-index-merkletree.md#verifymultiproof)
* [bufferify](api-classes-index-merkletree.md#bufferify)
* [getMultiProof](api-classes-index-merkletree.md#getmultiproof-1)
* [isHexString](api-classes-index-merkletree.md#ishexstring)
* [print](api-classes-index-merkletree.md#print-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new MerkleTree**(leaves: *`any`*, hashAlgorithm?: *`any`*, options?: *[Options](api-interfaces-index-options.md)*): [MerkleTree](api-classes-index-merkletree.md)

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| leaves | `any` | - |  Array of hashed leaves. Each leaf must be a Buffer. |
| `Default value` hashAlgorithm | `any` | SHA256 |  Algorithm used for hashing leaves and nodes |
| `Default value` options | [Options](api-interfaces-index-options.md) |  {} |  Additional options |

**Returns:** [MerkleTree](api-classes-index-merkletree.md)

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
▸(value: *[TValue](api-modules-index-module.md#tvalue)*): [THashAlgo](api-modules-index-module.md#thashalgo)

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | [TValue](api-modules-index-module.md#tvalue) |

**Returns:** [THashAlgo](api-modules-index-module.md#thashalgo)

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

**● layers**: *[TLayer](api-modules-index-module.md#tlayer)[]*

___
<a id="leaves"></a>

###  leaves

**● leaves**: *[TLeaf](api-modules-index-module.md#tleaf)[]*

___
<a id="sort"></a>

###  sort

**● sort**: *`boolean`*

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

<a id="_bufferindexof"></a>

### `<Private>` _bufferIndexOf

▸ **_bufferIndexOf**(arr: *`any`*, el: *`any`*): `number`

**Parameters:**

| Name | Type |
| ------ | ------ |
| arr | `any` |
| el | `any` |

**Returns:** `number`
*   Index number

___
<a id="_buffertohex"></a>

### `<Private>` _bufferToHex

▸ **_bufferToHex**(value: *`Buffer`*): `string`

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `Buffer` |  \- |

**Returns:** `string`

___
<a id="_bufferify"></a>

### `<Private>` _bufferify

▸ **_bufferify**(x: *`any`*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| x | `any` |

**Returns:** `any`

___
<a id="_bufferifyfn"></a>

### `<Private>` _bufferifyFn

▸ **_bufferifyFn**(f: *`any`*): `(Anonymous function)`

**Parameters:**

| Name | Type |
| ------ | ------ |
| f | `any` |

**Returns:** `(Anonymous function)`

___
<a id="_createhashes"></a>

### `<Private>` _createHashes

▸ **_createHashes**(nodes: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| nodes | `any` |

**Returns:** `void`

___
<a id="_getpairnode"></a>

### `<Private>` _getPairNode

▸ **_getPairNode**(layer: *`any`*, idx: *`any`*): `any`

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| layer | `any` |  Tree layer |
| idx | `any` |

**Returns:** `any`
*   Node

___
<a id="_ishexstring"></a>

### `<Private>` _isHexString

▸ **_isHexString**(v: *`any`*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| v | `any` |

**Returns:** `boolean`

___
<a id="_log2"></a>

### `<Private>` _log2

▸ **_log2**(x: *`any`*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| x | `any` |

**Returns:** `any`

___
<a id="_totreestring"></a>

### `<Private>` _toTreeString

▸ **_toTreeString**(): `any`

**Returns:** `any`

___
<a id="_zip"></a>

### `<Private>` _zip

▸ **_zip**(a: *`any`*, b: *`any`*): `any`

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| a | `any` |  first array |
| b | `any` |  second array |

**Returns:** `any`

___
<a id="getdepth"></a>

###  getDepth

▸ **getDepth**(): `number`

**Returns:** `number`

___
<a id="gethexlayers"></a>

###  getHexLayers

▸ **getHexLayers**(): `any`

**Returns:** `any`

___
<a id="gethexlayersflat"></a>

###  getHexLayersFlat

▸ **getHexLayersFlat**(): `any`

**Returns:** `any`

___
<a id="gethexleaves"></a>

###  getHexLeaves

▸ **getHexLeaves**(): `string`[]

**Returns:** `string`[]

___
<a id="gethexmultiproof"></a>

###  getHexMultiProof

▸ **getHexMultiProof**(tree: *`any`*, indices: *`any`*): `string`[]

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| tree | `any` |
| indices | `any` |  Tree indices. |

**Returns:** `string`[]
*   Multiproofs as hex strings.

___
<a id="gethexproof"></a>

###  getHexProof

▸ **getHexProof**(leaf: *`any`*, index: *`any`*): `string`[]

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| leaf | `any` |  Target leaf |
| `Optional` index | `any` |

**Returns:** `string`[]
*   Proof array as hex strings.

___
<a id="gethexroot"></a>

###  getHexRoot

▸ **getHexRoot**(): `string`

**Returns:** `string`

___
<a id="getlayers"></a>

###  getLayers

▸ **getLayers**(): `any`[]

**Returns:** `any`[]

___
<a id="getlayersasobject"></a>

###  getLayersAsObject

▸ **getLayersAsObject**(): `any`

**Returns:** `any`

___
<a id="getlayersflat"></a>

###  getLayersFlat

▸ **getLayersFlat**(): `any`

**Returns:** `any`

___
<a id="getleaves"></a>

###  getLeaves

▸ **getLeaves**(data: *`any`[]*): `any`[]

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` data | `any`[] |

**Returns:** `any`[]

___
<a id="getmultiproof"></a>

###  getMultiProof

▸ **getMultiProof**(tree: *`any`*, indices: *`any`*): `any`[]

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| tree | `any` |
| indices | `any` |  Tree indices. |

**Returns:** `any`[]
*   Multiproofs

___
<a id="getproof"></a>

###  getProof

▸ **getProof**(leaf: *`any`*, index: *`any`*): `any`[]

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| leaf | `any` |  Target leaf |
| `Optional` index | `any` |

**Returns:** `any`[]
*   Array of objects containing a position property of type string with values of 'left' or 'right' and a data property of type Buffer.

___
<a id="getproofflags"></a>

###  getProofFlags

▸ **getProofFlags**(els: *`any`*, proofs: *`any`*): `any`[]

**Parameters:**

| Name | Type |
| ------ | ------ |
| els | `any` |
| proofs | `any` |

**Returns:** `any`[]
*   Boolean flags

___
<a id="getproofindices"></a>

###  getProofIndices

▸ **getProofIndices**(treeIndices: *`any`*, depth: *`any`*): `any`[]

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| treeIndices | `any` |  Tree indices |
| depth | `any` |  Tree depth; number of layers. |

**Returns:** `any`[]
*   Proof indices

___
<a id="getroot"></a>

###  getRoot

▸ **getRoot**(): `any`

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
<a id="verify"></a>

###  verify

▸ **verify**(proof: *`any`*, targetNode: *`any`*, root: *`any`*): `boolean`

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| proof | `any` |  Array of proof objects that should connect target node to Merkle root. |
| targetNode | `any` |  Target node Buffer |
| root | `any` |  Merkle root Buffer |

**Returns:** `boolean`

___
<a id="verifymultiproof"></a>

###  verifyMultiProof

▸ **verifyMultiProof**(root: *`any`*, indices: *`any`*, leaves: *`any`*, depth: *`any`*, proof: *`any`*): `any`

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| root | `any` |  Merkle tree root |
| indices | `any` |  Leave indices |
| leaves | `any` |  Leaf values at indices. |
| depth | `any` |  Tree depth |
| proof | `any` |  Multiproofs given indices |

**Returns:** `any`

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
<a id="getmultiproof-1"></a>

### `<Static>` getMultiProof

▸ **getMultiProof**(tree: *`any`*, indices: *`any`*): `any`[]

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| tree | `any` |  Tree as a flat array. |
| indices | `any` |  Tree indices. |

**Returns:** `any`[]
*   Multiproofs

___
<a id="ishexstring"></a>

### `<Static>` isHexString

▸ **isHexString**(v: *`any`*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| v | `any` |

**Returns:** `boolean`

___
<a id="print-1"></a>

### `<Static>` print

▸ **print**(tree: *`any`*): `void`

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| tree | `any` |  Merkle tree instance. |

**Returns:** `void`

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
