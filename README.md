<h3 align="center">
  <br />
  <img src="https://user-images.githubusercontent.com/168240/39508295-ceeb1576-4d96-11e8-90aa-b2a56825567d.png" alt="logo" width="600" />
  <br />
  <br />
  <br />
</h3>

# MerkleTree.js

> Construct [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree) and verify proofs in JavaScript.

[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/miguelmota/merkletreejs/master/LICENSE) [![Build Status](https://travis-ci.org/miguelmota/merkletreejs.svg?branch=master)](https://travis-ci.org/miguelmota/merkletreejs) [![dependencies Status](https://david-dm.org/miguelmota/merkletreejs/status.svg)](https://david-dm.org/miguelmota/merkletreejs) [![NPM version](https://badge.fury.io/js/merkletreejs.svg)](http://badge.fury.io/js/merkletreejs)


## Contents

- [Diagrams](#diagrams)
- [Install](#install)
- [Getting started](#Getting-started)
- [Documentation](#documentation)
- [Test](#test)
- [FAQ](#faq)
- [Notes](#notes)
- [Resources](#resources)
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

## Classes

<dl>
<dt><a href="#MerkleTree">MerkleTree</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#MerkleTree">MerkleTree</a> : <code>object</code></dt>
<dd><p>Class reprensenting a Merkle Tree</p>
</dd>
</dl>

<a name="MerkleTree"></a>

## MerkleTree
**Kind**: global class

* [MerkleTree](#MerkleTree)
    * [new MerkleTree(leaves, hashAlgorithm, options)](#new_MerkleTree_new)
    * [.getLeaves()](#MerkleTree+getLeaves) ⇒ <code>Array.&lt;Buffer&gt;</code>
    * [.getLayers()](#MerkleTree+getLayers) ⇒ <code>Array.&lt;Buffer&gt;</code>
    * [.getRoot()](#MerkleTree+getRoot) ⇒ <code>Buffer</code>
    * [.getProof(leaf, [index])](#MerkleTree+getProof) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.verify(proof, targetNode, root)](#MerkleTree+verify) ⇒ <code>Boolean</code>


* * *

<a name="new_MerkleTree_new"></a>

### new MerkleTree(leaves, hashAlgorithm, options)
Constructs a Merkle Tree.
All nodes and leaves are stored as Buffers.
Lonely leaf nodes are promoted to the next level up without being hashed again.


| Param | Type | Description |
| --- | --- | --- |
| leaves | <code>Array.&lt;Buffer&gt;</code> | Array of hashed leaves. Each leaf must be a Buffer. |
| hashAlgorithm | <code>function</code> | Algorithm used for hashing leaves and nodes |
| options | <code>Object</code> | Additional options |
| options.isBitcoinTree | <code>Boolean</code> | If set to `true`, constructs the Merkle Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need to replicate Bitcoin constructed Merkle Trees. In Bitcoin Merkle Trees, single nodes are combined with themselves, and each output hash is hashed again. |

**Example**
```js
const { MerkleTree } = require('merkletreejs')
const crypto = require('crypto')

function sha256(data) {
  // returns Buffer
  return crypto.createHash('sha256').update(data).digest()
}

const leaves = ['a', 'b', 'c'].map(x => sha256(x))

const tree = new MerkleTree(leaves, sha256)
```

* * *

<a name="MerkleTree+getLeaves"></a>

### merkleTree.getLeaves() ⇒ <code>Array.&lt;Buffer&gt;</code>
Returns array of leaves of Merkle Tree.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Example**
```js
const leaves = tree.getLeaves()
```

* * *

<a name="MerkleTree+getLayers"></a>

### merkleTree.getLayers() ⇒ <code>Array.&lt;Buffer&gt;</code>
Returns array of all layers of Merkle Tree, including leaves and root.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Example**
```js
const layers = tree.getLayers()
```

* * *

<a name="MerkleTree+getRoot"></a>

### merkleTree.getRoot() ⇒ <code>Buffer</code>
Returns the Merkle root hash as a Buffer.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Example**
```js
const root = tree.getRoot()
```

* * *

<a name="MerkleTree+getProof"></a>

### merkleTree.getProof(leaf, [index]) ⇒ <code>Array.&lt;Object&gt;</code>
Returns the proof for a target leaf.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Array.&lt;Object&gt;</code> - - Array of objects containing a position property of type string with values of 'left' or 'right' and a data property of type Buffer.

| Param | Type | Description |
| --- | --- | --- |
| leaf | <code>Buffer</code> | Target leaf |
| [index] | <code>Number</code> | Target leaf index in leaves array. Use if there are leaves containing duplicate data in order to distinguish it. |

**Example**
```js
const proof = tree.getProof(leaves[2])
```
**Example**
```js
const leaves = ['a', 'b', 'a'].map(x => sha256(x))
const tree = new MerkleTree(leaves, sha256)
const proof = tree.getProof(leaves[2], 2)
```

* * *

<a name="MerkleTree+verify"></a>

### merkleTree.verify(proof, targetNode, root) ⇒ <code>Boolean</code>
Returns true if the proof path (array of hashes) can connect the target node
to the Merkle root.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)

| Param | Type | Description |
| --- | --- | --- |
| proof | <code>Array.&lt;Object&gt;</code> | Array of proof objects that should connect target node to Merkle root. |
| targetNode | <code>Buffer</code> | Target node Buffer |
| root | <code>Buffer</code> | Merkle root Buffer |

**Example**
```js
const root = tree.getRoot()
const proof = tree.getProof(leaves[2])
const verified = tree.verify(proof, leaves[2], root)
```

* * *

<a name="MerkleTree"></a>

## MerkleTree : <code>object</code>
Class reprensenting a Merkle Tree

**Kind**: global namespace

* [MerkleTree](#MerkleTree) : <code>object</code>
    * [new MerkleTree(leaves, hashAlgorithm, options)](#new_MerkleTree_new)
    * [.getLeaves()](#MerkleTree+getLeaves) ⇒ <code>Array.&lt;Buffer&gt;</code>
    * [.getLayers()](#MerkleTree+getLayers) ⇒ <code>Array.&lt;Buffer&gt;</code>
    * [.getRoot()](#MerkleTree+getRoot) ⇒ <code>Buffer</code>
    * [.getProof(leaf, [index])](#MerkleTree+getProof) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.verify(proof, targetNode, root)](#MerkleTree+verify) ⇒ <code>Boolean</code>


* * *

<a name="new_MerkleTree_new"></a>

### new MerkleTree(leaves, hashAlgorithm, options)
Constructs a Merkle Tree.
All nodes and leaves are stored as Buffers.
Lonely leaf nodes are promoted to the next level up without being hashed again.


| Param | Type | Description |
| --- | --- | --- |
| leaves | <code>Array.&lt;Buffer&gt;</code> | Array of hashed leaves. Each leaf must be a Buffer. |
| hashAlgorithm | <code>function</code> | Algorithm used for hashing leaves and nodes |
| options | <code>Object</code> | Additional options |
| options.isBitcoinTree | <code>Boolean</code> | If set to `true`, constructs the Merkle Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need to replicate Bitcoin constructed Merkle Trees. In Bitcoin Merkle Trees, single nodes are combined with themselves, and each output hash is hashed again. |

**Example**
```js
const { MerkleTree } = require('merkletreejs')
const crypto = require('crypto')

function sha256(data) {
  // returns Buffer
  return crypto.createHash('sha256').update(data).digest()
}

const leaves = ['a', 'b', 'c'].map(x => sha256(x))

const tree = new MerkleTree(leaves, sha256)
```

* * *

<a name="MerkleTree+getLeaves"></a>

### merkleTree.getLeaves() ⇒ <code>Array.&lt;Buffer&gt;</code>
Returns array of leaves of Merkle Tree.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Example**
```js
const leaves = tree.getLeaves()
```

* * *

<a name="MerkleTree+getLayers"></a>

### merkleTree.getLayers() ⇒ <code>Array.&lt;Buffer&gt;</code>
Returns array of all layers of Merkle Tree, including leaves and root.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Example**
```js
const layers = tree.getLayers()
```

* * *

<a name="MerkleTree+getRoot"></a>

### merkleTree.getRoot() ⇒ <code>Buffer</code>
Returns the Merkle root hash as a Buffer.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Example**
```js
const root = tree.getRoot()
```

* * *

<a name="MerkleTree+getProof"></a>

### merkleTree.getProof(leaf, [index]) ⇒ <code>Array.&lt;Object&gt;</code>
Returns the proof for a target leaf.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Array.&lt;Buffer&gt;</code> - - Array of objects containing a position property of type string with values of 'left' or 'right' and a data property of type Buffer.

| Param | Type | Description |
| --- | --- | --- |
| leaf | <code>Buffer</code> | Target leaf |
| [index] | <code>Number</code> | Target leaf index in leaves array. Use if there are leaves containing duplicate data in order to distinguish it. |

**Example**
```js
const proof = tree.getProof(leaves[2])
```
**Example**
```js
const leaves = ['a', 'b', 'a'].map(x => sha256(x))
const tree = new MerkleTree(leaves, sha256)
const proof = tree.getProof(leaves[2], 2)
```

* * *

<a name="MerkleTree+verify"></a>

### merkleTree.verify(proof, targetNode, root) ⇒ <code>Boolean</code>
Returns true if the proof path (array of hashes) can connect the target node
to the Merkle root.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)

| Param | Type | Description |
| --- | --- | --- |
| proof | <code>Array.&lt;Buffer&gt;</code> | Array of proof Buffer hashes that should connect target node to Merkle root. |
| targetNode | <code>Buffer</code> | Target node Buffer |
| root | <code>Buffer</code> | Merkle root Buffer |

**Example**
```js
const root = tree.getRoot()
const proof = tree.getProof(leaves[2])
const verified = tree.verify(proof, leaves[2], root)
```

* * *

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

## License

[MIT](LICENSE)
