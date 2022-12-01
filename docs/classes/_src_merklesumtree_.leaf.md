[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/MerkleSumTree"](../modules/_src_merklesumtree_.md) › [Leaf](_src_merklesumtree_.leaf.md)

# Class: Leaf

## Hierarchy

* **Leaf**

## Index

### Constructors

* [constructor](_src_merklesumtree_.leaf.md#constructor)

### Properties

* [data](_src_merklesumtree_.leaf.md#data)
* [hashFn](_src_merklesumtree_.leaf.md#hashfn)
* [rng](_src_merklesumtree_.leaf.md#rng)

### Methods

* [getBucket](_src_merklesumtree_.leaf.md#getbucket)

## Constructors

###  constructor

\+ **new Leaf**(`hashFn`: [THashFn](../modules/_src_merklesumtree_.md#thashfn), `rng`: (number | BigInt)[], `data`: Buffer | null): *[Leaf](_src_merklesumtree_.leaf.md)*

**Parameters:**

Name | Type |
------ | ------ |
`hashFn` | [THashFn](../modules/_src_merklesumtree_.md#thashfn) |
`rng` | (number &#124; BigInt)[] |
`data` | Buffer &#124; null |

**Returns:** *[Leaf](_src_merklesumtree_.leaf.md)*

## Properties

###  data

• **data**: *Buffer | null*

___

###  hashFn

• **hashFn**: *[THashFn](../modules/_src_merklesumtree_.md#thashfn)*

___

###  rng

• **rng**: *BigInt[]*

## Methods

###  getBucket

▸ **getBucket**(): *[Bucket](_src_merklesumtree_.bucket.md)‹›*

**Returns:** *[Bucket](_src_merklesumtree_.bucket.md)‹›*
