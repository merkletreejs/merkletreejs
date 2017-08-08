# Merkle Tree

> Construct [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree) and verify proofs in JavaScript.

Diagram of Merkle Tree

<img src="https://github.com/miguelmota/merkle-tree/blob/master/diagrams/merkle-tree.png?raw=true" alt="Merkle Tree" width="500">

Diagram of Merkle Tree Proof

<img src="https://github.com/miguelmota/merkle-tree/blob/master/diagrams/merkle-tree-proof.png?raw=true" alt="Merkle Tree Proof" width="420">

Diagram of Invalid Merkle Tree Proofs

<img src="https://github.com/miguelmota/merkle-tree/blob/master/diagrams/merkle-tree-proof-fail.png?raw=true" alt="Merkle Tree Proof" width="420">

# Install

```bash
npm install m-tree
```

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
    * [.getProof(leaf, [index])](#MerkleTree+getProof) ⇒ <code>Array.&lt;Buffer&gt;</code>
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

### merkleTree.getProof(leaf, [index]) ⇒ <code>Array.&lt;Buffer&gt;</code>
Returns the proof for a target leaf.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Array.&lt;Buffer&gt;</code> - - Array of Buffer hashes.

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

<a name="MerkleTree"></a>

## MerkleTree : <code>object</code>
Class reprensenting a Merkle Tree

**Kind**: global namespace

* [MerkleTree](#MerkleTree) : <code>object</code>
    * [new MerkleTree(leaves, hashAlgorithm, options)](#new_MerkleTree_new)
    * [.getLeaves()](#MerkleTree+getLeaves) ⇒ <code>Array.&lt;Buffer&gt;</code>
    * [.getLayers()](#MerkleTree+getLayers) ⇒ <code>Array.&lt;Buffer&gt;</code>
    * [.getRoot()](#MerkleTree+getRoot) ⇒ <code>Buffer</code>
    * [.getProof(leaf, [index])](#MerkleTree+getProof) ⇒ <code>Array.&lt;Buffer&gt;</code>
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

### merkleTree.getProof(leaf, [index]) ⇒ <code>Array.&lt;Buffer&gt;</code>
Returns the proof for a target leaf.

**Kind**: instance method of [<code>MerkleTree</code>](#MerkleTree)
**Returns**: <code>Array.&lt;Buffer&gt;</code> - - Array of Buffer hashes.

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

# Test

```bash
npm test
```

# Notes

As is, this implemenation is vulnerable to a [second pre-image attack](https://en.wikipedia.org/wiki/Merkle_tree#Second_preimage_attack). Use a difference hashing algorithm function for leaves and nodes, so that `H(x) != H'(x)`.

Also, as is, this implementation is vulnerable to a forgery attack for an unbalanced tree, where the last leaf node can be duplicated to create an artificial balanced tree, resulting in the same Merkle root hash. Do not accept unbalanced tree to prevent this.

# Resources

- [Bitcoin mining the hard way: the algorithms, protocols, and bytes](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html)

- [Bitcoin Talk - Merkle Trees](https://bitcointalk.org/index.php?topic=403231.msg9054025#msg9054025)

- [How Log Proofs Work](https://www.certificate-transparency.org/log-proofs-work)

- [Raiden Merkle Tree Implemenation](https://github.com/raiden-network/raiden/blob/f9cf12571891cdf54feb4667cd2fffcb3d5daa89/raiden/mtree.py)

- [Why aren't Solidity sha3 hashes not matching what other sha3 libraries produce?](https://ethereum.stackexchange.com/questions/559/why-arent-solidity-sha3-hashes-not-matching-what-other-sha3-libraries-produce)

- [What is the purpose of using different hash functions for the leaves and internals of a hash tree?](https://crypto.stackexchange.com/questions/2106/what-is-the-purpose-of-using-different-hash-functions-for-the-leaves-and-interna)

# License

MIT
