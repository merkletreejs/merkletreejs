[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/MerkleTree"](../modules/_src_merkletree_.md) › [Options](_src_merkletree_.options.md)

# Interface: Options

## Hierarchy

* **Options**

## Index

### Properties

* [complete](_src_merkletree_.options.md#optional-complete)
* [duplicateOdd](_src_merkletree_.options.md#optional-duplicateodd)
* [fillDefaultHash](_src_merkletree_.options.md#optional-filldefaulthash)
* [hashLeaves](_src_merkletree_.options.md#optional-hashleaves)
* [isBitcoinTree](_src_merkletree_.options.md#optional-isbitcointree)
* [sort](_src_merkletree_.options.md#optional-sort)
* [sortLeaves](_src_merkletree_.options.md#optional-sortleaves)
* [sortPairs](_src_merkletree_.options.md#optional-sortpairs)

## Properties

### `Optional` complete

• **complete**? : *boolean*

If set to `true`, the resulting tree will be a complete tree. Recommended for use of multiProofs.

___

### `Optional` duplicateOdd

• **duplicateOdd**? : *boolean*

If set to `true`, an odd node will be duplicated and combined to make a pair to generate the layer hash.

___

### `Optional` fillDefaultHash

• **fillDefaultHash**? : *[TFillDefaultHash](../modules/_src_merkletree_.md#tfilldefaulthash) | Buffer | string*

If defined, the resulting hash of this function will be used to fill in odd numbered layers.

___

### `Optional` hashLeaves

• **hashLeaves**? : *boolean*

If set to `true`, the leaves will hashed using the set hashing algorithms.

___

### `Optional` isBitcoinTree

• **isBitcoinTree**? : *boolean*

If set to `true`, constructs the Merkle Tree using the [Bitcoin Merkle Tree implementation](http://www.righto.com/2014/02/bitcoin-mining-hard-way-algorithms.html). Enable it when you need to replicate Bitcoin constructed Merkle Trees. In Bitcoin Merkle Trees, single nodes are combined with themselves, and each output hash is hashed again.

___

### `Optional` sort

• **sort**? : *boolean*

If set to `true`, the leaves and hashing pairs will be sorted.

___

### `Optional` sortLeaves

• **sortLeaves**? : *boolean*

If set to `true`, the leaves will be sorted. Recommended for use of multiProofs.

___

### `Optional` sortPairs

• **sortPairs**? : *boolean*

If set to `true`, the hashing pairs will be sorted.
