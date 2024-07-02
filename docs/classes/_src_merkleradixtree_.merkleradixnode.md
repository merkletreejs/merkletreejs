[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/MerkleRadixTree"](../modules/_src_merkleradixtree_.md) › [MerkleRadixNode](_src_merkleradixtree_.merkleradixnode.md)

# Class: MerkleRadixNode

## Hierarchy

* **MerkleRadixNode**

## Index

### Constructors

* [constructor](_src_merkleradixtree_.merkleradixnode.md#constructor)

### Properties

* [children](_src_merkleradixtree_.merkleradixnode.md#children)
* [hash](_src_merkleradixtree_.merkleradixnode.md#hash)
* [hashFn](_src_merkleradixtree_.merkleradixnode.md#hashfn)
* [key](_src_merkleradixtree_.merkleradixnode.md#key)
* [value](_src_merkleradixtree_.merkleradixnode.md#value)

### Methods

* [computeHash](_src_merkleradixtree_.merkleradixnode.md#computehash)
* [updateHash](_src_merkleradixtree_.merkleradixnode.md#updatehash)

## Constructors

###  constructor

\+ **new MerkleRadixNode**(`key`: string, `value`: any, `hashFn`: [THashFn](../modules/_src_merkleradixtree_.md#thashfn)): *[MerkleRadixNode](_src_merkleradixtree_.merkleradixnode.md)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`key` | string | "" |
`value` | any | null |
`hashFn` | [THashFn](../modules/_src_merkleradixtree_.md#thashfn) | - |

**Returns:** *[MerkleRadixNode](_src_merkleradixtree_.merkleradixnode.md)*

## Properties

###  children

• **children**: *Map‹string, [MerkleRadixNode](_src_merkleradixtree_.merkleradixnode.md)›*

___

###  hash

• **hash**: *Buffer*

___

###  hashFn

• **hashFn**: *[THashFn](../modules/_src_merkleradixtree_.md#thashfn)*

___

###  key

• **key**: *string*

___

###  value

• **value**: *[TValue](../modules/_src_merkleradixtree_.md#tvalue)*

## Methods

###  computeHash

▸ **computeHash**(): *Buffer*

**Returns:** *Buffer*

___

###  updateHash

▸ **updateHash**(): *void*

**Returns:** *void*
