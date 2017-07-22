# Merkle Tree

> Construct [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree) and verify via proofs in JavaScript.

<img src="https://github.com/miguelmota/merkle-tree/blob/master/diagrams/merkle-tree.png?raw=true" width="500">

# Install

```bash
npm install m-tree
```

# Documentation

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
    * [.getLeaves()](#MerkleTree+getLeaves) ⇒ <code>Array</code>
    * [.getLayers()](#MerkleTree+getLayers) ⇒ <code>Array</code>
    * [.getRoot()](#MerkleTree+getRoot) ⇒ <code>Buffer</code>
    * [.getProof(leaf, [index])](#MerkleTree+getProof) ⇒ <code>Array</code>
    * [.verify(proof, targetNode, root)](#MerkleTree+verify) ⇒ <code>Boolean</code>

<a name="new_MerkleTree_new"></a>

### new MerkleTree(leaves, hashAlgorithm, options)
Constructs a Merkle Tree.
All nodes and leaves are stored as Buffers.
Lonely leaf nodes are promoted to the next level up without being hashed again.


| Param | Type | Description |
| --- | --- | --- |
| leaves | <code>Array</code> | Array of hashed leaves. Each leaf must be a Buffer. |
| hashAlgorithm | <code>function</code> | Algorithm used for hashing leaves and nodes |
| options | <code>Object</code> | Additional options |
| options.isBitcoinTree | <code>Boolean</code> | If set to `true`, constructs the Merkle Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need to replicate Bitcoin constructed Merkle Trees. |

**Example**
```js
const MerkleTree = require('m-tree')
const crypto = require('crypto')

function sha256(data) {
  // returns Buffer
  return crypto.createHash('sha256').update(data).digest()
}

const leaves = ['a', 'b', 'c'].map(x => sha3(x))

const tree = new MerkleTree(leaves, sha256)
```
<a name="MerkleTree+getLeaves"></a>

### merkleTree.getLeaves() ⇒ <code>Array</code>
Returns leaves of Merkle Tree.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Array</code> - - array of leaves
**Example**
```js
const leaves = tree.getLeaves()
```
<a name="MerkleTree+getLayers"></a>

### merkleTree.getLayers() ⇒ <code>Array</code>
Returns all layers of Merkle Tree, including leaves and root.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Array</code> - - array of layers
**Example**
```js
const layers = tree.getLayers()
```
<a name="MerkleTree+getRoot"></a>

### merkleTree.getRoot() ⇒ <code>Buffer</code>
Returns the Merkle root hash.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Buffer</code> - - Merkle root hash
**Example**
```js
const root = tree.getRoot()
```
<a name="MerkleTree+getProof"></a>

### merkleTree.getProof(leaf, [index]) ⇒ <code>Array</code>
Returns the proof for a target leaf.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Array</code> - - Array of Buffer hashes.

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
const leaves = ['a', 'b', 'a'].map(x => sha3(x))
const tree = new MerkleTree(leaves, sha3)
const proof = tree.getProof(leaves[2], 2)
```
<a name="MerkleTree+verify"></a>

### merkleTree.verify(proof, targetNode, root) ⇒ <code>Boolean</code>
Returns true if the proof path (array of hashes) can connect the target node
to the Merkle root.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)

| Param | Type | Description |
| --- | --- | --- |
| proof | <code>Array</code> | Array of proof Buffer hashes that should connect target node to Merkle root. |
| targetNode | <code>Buffer</code> | Target node Buffer |
| root | <code>Buffer</code> | Merkle root Buffer |

**Example**
```js
const root = tree.getRoot()
const proof = tree.getProof(leaves[2])
const verified = tree.verify(proof, leaves[2], root)
```
<a name="MerkleTree"></a>

## MerkleTree : <code>object</code>
Class reprensenting a Merkle Tree

**Kind**: global namespace
**Example**
```js
const tree = new MerkleTree(leaves, sha256)
```

* [MerkleTree](#MerkleTree) : <code>object</code>
    * [new MerkleTree(leaves, hashAlgorithm, options)](#new_MerkleTree_new)
    * [.getLeaves()](#MerkleTree+getLeaves) ⇒ <code>Array</code>
    * [.getLayers()](#MerkleTree+getLayers) ⇒ <code>Array</code>
    * [.getRoot()](#MerkleTree+getRoot) ⇒ <code>Buffer</code>
    * [.getProof(leaf, [index])](#MerkleTree+getProof) ⇒ <code>Array</code>
    * [.verify(proof, targetNode, root)](#MerkleTree+verify) ⇒ <code>Boolean</code>

<a name="new_MerkleTree_new"></a>

### new MerkleTree(leaves, hashAlgorithm, options)
Constructs a Merkle Tree.
All nodes and leaves are stored as Buffers.
Lonely leaf nodes are promoted to the next level up without being hashed again.


| Param | Type | Description |
| --- | --- | --- |
| leaves | <code>Array</code> | Array of hashed leaves. Each leaf must be a Buffer. |
| hashAlgorithm | <code>function</code> | Algorithm used for hashing leaves and nodes |
| options | <code>Object</code> | Additional options |
| options.isBitcoinTree | <code>Boolean</code> | If set to `true`, constructs the Merkle Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need to replicate Bitcoin constructed Merkle Trees. |

**Example**
```js
const MerkleTree = require('m-tree')
const crypto = require('crypto')

function sha256(data) {
  // returns Buffer
  return crypto.createHash('sha256').update(data).digest()
}

const leaves = ['a', 'b', 'c'].map(x => sha3(x))

const tree = new MerkleTree(leaves, sha256)
```
<a name="MerkleTree+getLeaves"></a>

### merkleTree.getLeaves() ⇒ <code>Array</code>
Returns leaves of Merkle Tree.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Array</code> - - array of leaves
**Example**
```js
const leaves = tree.getLeaves()
```
<a name="MerkleTree+getLayers"></a>

### merkleTree.getLayers() ⇒ <code>Array</code>
Returns all layers of Merkle Tree, including leaves and root.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Array</code> - - array of layers
**Example**
```js
const layers = tree.getLayers()
```
<a name="MerkleTree+getRoot"></a>

### merkleTree.getRoot() ⇒ <code>Buffer</code>
Returns the Merkle root hash.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Buffer</code> - - Merkle root hash
**Example**
```js
const root = tree.getRoot()
```
<a name="MerkleTree+getProof"></a>

### merkleTree.getProof(leaf, [index]) ⇒ <code>Array</code>
Returns the proof for a target leaf.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Array</code> - - Array of Buffer hashes.

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
const leaves = ['a', 'b', 'a'].map(x => sha3(x))
const tree = new MerkleTree(leaves, sha3)
const proof = tree.getProof(leaves[2], 2)
```
<a name="MerkleTree+verify"></a>

### merkleTree.verify(proof, targetNode, root) ⇒ <code>Boolean</code>
Returns true if the proof path (array of hashes) can connect the target node
to the Merkle root.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)

| Param | Type | Description |
| --- | --- | --- |
| proof | <code>Array</code> | Array of proof Buffer hashes that should connect target node to Merkle root. |
| targetNode | <code>Buffer</code> | Target node Buffer |
| root | <code>Buffer</code> | Merkle root Buffer |

**Example**
```js
const root = tree.getRoot()
const proof = tree.getProof(leaves[2])
const verified = tree.verify(proof, leaves[2], root)
```

<!--
 merkle-lib
Warnings

This implementation is vulnerable to a forgery attack (as a second pre-image attack), see these[1][2] crypto.stackexchange questions for an explanation. To avoid this vulnerability, you should pre-hash your leaves using a different hash function than the function provided such that H(x) != H'(x).

This implementation is vulnerable to a forgery attack (for an unbalanced merkle tree), wherein, in an unbalanced merkle tree, the last leaf node can be duplicated to create an artificial balanced tree, resulting in the same root hash. To avoid this vulnerability [in this implementation], do not accept unbalanced merkle trees in your application.
-->

# Test

```bash
npm test
```

# Credits/Resources

- [Bitcoin mining the hard way: the algorithms, protocols, and bytes](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html)

- [Raiden Merkle Tree Implemenation](https://github.com/raiden-network/raiden/blob/f9cf12571891cdf54feb4667cd2fffcb3d5daa89/raiden/mtree.py)

- [Bitcoin Talk - Merkle Trees](https://bitcointalk.org/index.php?topic=403231.msg9054025#msg9054025)

- [How Log Proofs Work](https://www.certificate-transparency.org/log-proofs-work)

- [Why aren't Solidity sha3 hashes not matching what other sha3 libraries produce?](https://ethereum.stackexchange.com/questions/559/why-arent-solidity-sha3-hashes-not-matching-what-other-sha3-libraries-produce)

# License

MIT
