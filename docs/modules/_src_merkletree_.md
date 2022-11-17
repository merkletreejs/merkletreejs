[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/MerkleTree"](_src_merkletree_.md)

# Module: "src/MerkleTree"

## Index

### Classes

* [MerkleTree](../classes/_src_merkletree_.merkletree.md)

### Interfaces

* [Options](../interfaces/_src_merkletree_.options.md)

### Type aliases

* [TFillDefaultHash](_src_merkletree_.md#tfilldefaulthash)
* [THashFn](_src_merkletree_.md#thashfn)
* [THashFnResult](_src_merkletree_.md#thashfnresult)
* [TLayer](_src_merkletree_.md#tlayer)
* [TLeaf](_src_merkletree_.md#tleaf)
* [TValue](_src_merkletree_.md#tvalue)

## Type aliases

###  TFillDefaultHash

Ƭ **TFillDefaultHash**: *function*

#### Type declaration:

▸ (`idx?`: number, `hashFn?`: [THashFn](_src_merkletree_.md#thashfn)): *[THashFnResult](_src_merkletree_.md#thashfnresult)*

**Parameters:**

Name | Type |
------ | ------ |
`idx?` | number |
`hashFn?` | [THashFn](_src_merkletree_.md#thashfn) |

___

###  THashFn

Ƭ **THashFn**: *function*

#### Type declaration:

▸ (`value`: [TValue](_src_merkletree_.md#tvalue)): *Buffer*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [TValue](_src_merkletree_.md#tvalue) |

___

###  THashFnResult

Ƭ **THashFnResult**: *Buffer | string*

___

###  TLayer

Ƭ **TLayer**: *any*

___

###  TLeaf

Ƭ **TLeaf**: *Buffer*

___

###  TValue

Ƭ **TValue**: *Buffer | BigInt | string | number | null | undefined*
