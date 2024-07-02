[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/MerkleRadixTree"](_src_merkleradixtree_.md)

# Module: "src/MerkleRadixTree"

## Index

### Classes

* [MerkleRadixNode](../classes/_src_merkleradixtree_.merkleradixnode.md)
* [MerkleRadixTree](../classes/_src_merkleradixtree_.merkleradixtree.md)

### Type aliases

* [ProofItem](_src_merkleradixtree_.md#proofitem)
* [THashFn](_src_merkleradixtree_.md#thashfn)
* [TValue](_src_merkleradixtree_.md#tvalue)

## Type aliases

###  ProofItem

Ƭ **ProofItem**: *object*

#### Type declaration:

* **hash**: *Buffer*

* **key**: *string*

* **siblings**: *object[]*

___

###  THashFn

Ƭ **THashFn**: *function*

#### Type declaration:

▸ (`value`: [TValue](_src_merkleradixtree_.md#tvalue)): *Buffer*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [TValue](_src_merkleradixtree_.md#tvalue) |

___

###  TValue

Ƭ **TValue**: *Buffer | BigInt | string | number | null | undefined*
