[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/MerkleRadixTree"](../modules/_src_merkleradixtree_.md) › [MerkleRadixTree](_src_merkleradixtree_.merkleradixtree.md)

# Class: MerkleRadixTree

## Hierarchy

* [Base](_src_base_.base.md)

  ↳ **MerkleRadixTree**

## Index

### Constructors

* [constructor](_src_merkleradixtree_.merkleradixtree.md#constructor)

### Properties

* [hashFn](_src_merkleradixtree_.merkleradixtree.md#hashfn)
* [root](_src_merkleradixtree_.merkleradixtree.md#root)

### Methods

* [bigNumberify](_src_merkleradixtree_.merkleradixtree.md#bignumberify)
* [binarySearch](_src_merkleradixtree_.merkleradixtree.md#binarysearch)
* [bufferArrayIncludes](_src_merkleradixtree_.merkleradixtree.md#bufferarrayincludes)
* [bufferIndexOf](_src_merkleradixtree_.merkleradixtree.md#protected-bufferindexof)
* [bufferToHex](_src_merkleradixtree_.merkleradixtree.md#buffertohex)
* [bufferify](_src_merkleradixtree_.merkleradixtree.md#bufferify)
* [bufferifyFn](_src_merkleradixtree_.merkleradixtree.md#bufferifyfn)
* [generateProof](_src_merkleradixtree_.merkleradixtree.md#generateproof)
* [insert](_src_merkleradixtree_.merkleradixtree.md#insert)
* [isHexString](_src_merkleradixtree_.merkleradixtree.md#protected-ishexstring)
* [linearSearch](_src_merkleradixtree_.merkleradixtree.md#linearsearch)
* [log2](_src_merkleradixtree_.merkleradixtree.md#protected-log2)
* [lookup](_src_merkleradixtree_.merkleradixtree.md#lookup)
* [print](_src_merkleradixtree_.merkleradixtree.md#print)
* [verifyProof](_src_merkleradixtree_.merkleradixtree.md#verifyproof)
* [zip](_src_merkleradixtree_.merkleradixtree.md#protected-zip)
* [bigNumberify](_src_merkleradixtree_.merkleradixtree.md#static-bignumberify)
* [binarySearch](_src_merkleradixtree_.merkleradixtree.md#static-binarysearch)
* [bufferToHex](_src_merkleradixtree_.merkleradixtree.md#static-buffertohex)
* [bufferify](_src_merkleradixtree_.merkleradixtree.md#static-bufferify)
* [bufferifyFn](_src_merkleradixtree_.merkleradixtree.md#static-bufferifyfn)
* [hexZeroPad](_src_merkleradixtree_.merkleradixtree.md#static-hexzeropad)
* [isHexString](_src_merkleradixtree_.merkleradixtree.md#static-ishexstring)
* [linearSearch](_src_merkleradixtree_.merkleradixtree.md#static-linearsearch)
* [print](_src_merkleradixtree_.merkleradixtree.md#static-print)

## Constructors

###  constructor

\+ **new MerkleRadixTree**(`hashFn`: [THashFn](../modules/_src_merkleradixtree_.md#thashfn)): *[MerkleRadixTree](_src_merkleradixtree_.merkleradixtree.md)*

**Parameters:**

Name | Type |
------ | ------ |
`hashFn` | [THashFn](../modules/_src_merkleradixtree_.md#thashfn) |

**Returns:** *[MerkleRadixTree](_src_merkleradixtree_.merkleradixtree.md)*

## Properties

###  hashFn

• **hashFn**: *[THashFn](../modules/_src_merkleradixtree_.md#thashfn)*

___

###  root

• **root**: *[MerkleRadixNode](_src_merkleradixtree_.merkleradixnode.md)*

## Methods

###  bigNumberify

▸ **bigNumberify**(`value`: any): *BigInt*

*Inherited from [Base](_src_base_.base.md).[bigNumberify](_src_base_.base.md#bignumberify)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *BigInt*

___

###  binarySearch

▸ **binarySearch**(`array`: Buffer[], `element`: Buffer, `compareFunction`: function): *number*

*Inherited from [Base](_src_base_.base.md).[binarySearch](_src_base_.base.md#static-binarysearch)*

binarySearch

**`desc`** Returns the first index of which given item is found in array using binary search.

**`example`** 
```js
const index = tree.binarySearch(array, element, Buffer.compare)
```

**Parameters:**

▪ **array**: *Buffer[]*

Array of items.

▪ **element**: *Buffer*

Item to find.

▪ **compareFunction**: *function*

▸ (`a`: unknown, `b`: unknown): *number*

**Parameters:**

Name | Type |
------ | ------ |
`a` | unknown |
`b` | unknown |

**Returns:** *number*

- Index number

___

###  bufferArrayIncludes

▸ **bufferArrayIncludes**(`bufferArray`: Buffer[], `targetBuffer`: Buffer): *boolean*

*Inherited from [Base](_src_base_.base.md).[bufferArrayIncludes](_src_base_.base.md#bufferarrayincludes)*

**Parameters:**

Name | Type |
------ | ------ |
`bufferArray` | Buffer[] |
`targetBuffer` | Buffer |

**Returns:** *boolean*

___

### `Protected` bufferIndexOf

▸ **bufferIndexOf**(`array`: Buffer[], `element`: Buffer, `isSorted`: boolean): *number*

*Inherited from [Base](_src_base_.base.md).[bufferIndexOf](_src_base_.base.md#protected-bufferindexof)*

bufferIndexOf

**`desc`** Returns the first index of which given buffer is found in array.

**`example`** 
```js
const index = tree.bufferIndexOf(haystack, needle)
```

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`array` | Buffer[] | - |
`element` | Buffer | - |
`isSorted` | boolean | false |

**Returns:** *number*

- Index number

___

###  bufferToHex

▸ **bufferToHex**(`value`: Buffer, `withPrefix`: boolean): *string*

*Inherited from [Base](_src_base_.base.md).[bufferToHex](_src_base_.base.md#buffertohex)*

bufferToHex

**`desc`** Returns a hex string with 0x prefix for given buffer.

**`example`** 
```js
const hexStr = tree.bufferToHex(Buffer.from('A'))
```

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`value` | Buffer | - |
`withPrefix` | boolean | true |

**Returns:** *string*

___

###  bufferify

▸ **bufferify**(`value`: any): *Buffer*

*Inherited from [Base](_src_base_.base.md).[bufferify](_src_base_.base.md#static-bufferify)*

bufferify

**`desc`** Returns a buffer type for the given value.

**`example`** 
```js
const buf = tree.bufferify('0x1234')
```

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *Buffer*

___

###  bufferifyFn

▸ **bufferifyFn**(`f`: any): *any*

*Inherited from [Base](_src_base_.base.md).[bufferifyFn](_src_base_.base.md#static-bufferifyfn)*

bufferifyFn

**`desc`** Returns a function that will bufferify the return value.

**`example`** 
```js
const fn = tree.bufferifyFn((value) => sha256(value))
```

**Parameters:**

Name | Type |
------ | ------ |
`f` | any |

**Returns:** *any*

___

###  generateProof

▸ **generateProof**(`key`: string): *any[]*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *any[]*

___

###  insert

▸ **insert**(`key`: string, `value`: [TValue](../modules/_src_merkleradixtree_.md#tvalue)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | [TValue](../modules/_src_merkleradixtree_.md#tvalue) |

**Returns:** *void*

___

### `Protected` isHexString

▸ **isHexString**(`value`: string): *boolean*

*Inherited from [Base](_src_base_.base.md).[isHexString](_src_base_.base.md#static-ishexstring)*

isHexString

**`desc`** Returns true if value is a hex string.

**`example`** 
```js
console.log(MerkleTree.isHexString('0x1234'))
```

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *boolean*

___

###  linearSearch

▸ **linearSearch**(`array`: Buffer[], `element`: Buffer, `eqChecker`: function): *number*

*Inherited from [Base](_src_base_.base.md).[linearSearch](_src_base_.base.md#static-linearsearch)*

linearSearch

**`desc`** Returns the first index of which given item is found in array using linear search.

**`example`** 
```js
const index = tree.linearSearch(array, element, (a, b) => a === b)
```

**Parameters:**

▪ **array**: *Buffer[]*

Array of items.

▪ **element**: *Buffer*

Item to find.

▪ **eqChecker**: *function*

▸ (`a`: unknown, `b`: unknown): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`a` | unknown |
`b` | unknown |

**Returns:** *number*

- Index number

___

### `Protected` log2

▸ **log2**(`n`: number): *number*

*Inherited from [Base](_src_base_.base.md).[log2](_src_base_.base.md#protected-log2)*

log2

**`desc`** Returns the log2 of number.

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *number*

___

###  lookup

▸ **lookup**(`key`: string): *string | number | Buffer‹› | BigInt*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *string | number | Buffer‹› | BigInt*

___

###  print

▸ **print**(): *void*

*Inherited from [Base](_src_base_.base.md).[print](_src_base_.base.md#print)*

print

**`desc`** Prints out a visual representation of the merkle tree.

**`example`** 
```js
tree.print()
```

**Returns:** *void*

___

###  verifyProof

▸ **verifyProof**(`proof`: [ProofItem](../modules/_src_merkleradixtree_.md#proofitem)[], `rootHash`: Buffer): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`proof` | [ProofItem](../modules/_src_merkleradixtree_.md#proofitem)[] |
`rootHash` | Buffer |

**Returns:** *boolean*

___

### `Protected` zip

▸ **zip**(`a`: any[], `b`: any[]): *any[][]*

*Inherited from [Base](_src_base_.base.md).[zip](_src_base_.base.md#protected-zip)*

zip

**`desc`** Returns true if value is a hex string.

**`example`** 
```js
const zipped = tree.zip(['a', 'b'],['A', 'B'])
console.log(zipped) // [ [ 'a', 'A' ], [ 'b', 'B' ] ]
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | any[] | first array |
`b` | any[] | second array |

**Returns:** *any[][]*

___

### `Static` bigNumberify

▸ **bigNumberify**(`value`: any): *BigInt*

*Inherited from [Base](_src_base_.base.md).[bigNumberify](_src_base_.base.md#bignumberify)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *BigInt*

___

### `Static` binarySearch

▸ **binarySearch**(`array`: Buffer[], `element`: Buffer, `compareFunction`: function): *number*

*Inherited from [Base](_src_base_.base.md).[binarySearch](_src_base_.base.md#static-binarysearch)*

binarySearch

**`desc`** Returns the first index of which given item is found in array using binary search.

**`example`** 
```js
const index = MerkleTree.binarySearch(array, element, Buffer.compare)
```

**Parameters:**

▪ **array**: *Buffer[]*

Array of items.

▪ **element**: *Buffer*

Item to find.

▪ **compareFunction**: *function*

▸ (`a`: unknown, `b`: unknown): *number*

**Parameters:**

Name | Type |
------ | ------ |
`a` | unknown |
`b` | unknown |

**Returns:** *number*

- Index number

___

### `Static` bufferToHex

▸ **bufferToHex**(`value`: Buffer, `withPrefix`: boolean): *string*

*Inherited from [Base](_src_base_.base.md).[bufferToHex](_src_base_.base.md#buffertohex)*

bufferToHex

**`desc`** Returns a hex string with 0x prefix for given buffer.

**`example`** 
```js
const hexStr = MerkleTree.bufferToHex(Buffer.from('A'))
```

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`value` | Buffer | - |
`withPrefix` | boolean | true |

**Returns:** *string*

___

### `Static` bufferify

▸ **bufferify**(`value`: any): *Buffer*

*Inherited from [Base](_src_base_.base.md).[bufferify](_src_base_.base.md#static-bufferify)*

bufferify

**`desc`** Returns a buffer type for the given value.

**`example`** 
```js
const buf = MerkleTree.bufferify('0x1234')
```

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *Buffer*

___

### `Static` bufferifyFn

▸ **bufferifyFn**(`f`: any): *any*

*Inherited from [Base](_src_base_.base.md).[bufferifyFn](_src_base_.base.md#static-bufferifyfn)*

bufferifyFn

**`desc`** Returns a function that will bufferify the return value.

**`example`** 
```js
const fn = MerkleTree.bufferifyFn((value) => sha256(value))
```

**Parameters:**

Name | Type |
------ | ------ |
`f` | any |

**Returns:** *any*

___

### `Static` hexZeroPad

▸ **hexZeroPad**(`hexStr`: string, `length`: number): *string*

*Inherited from [Base](_src_base_.base.md).[hexZeroPad](_src_base_.base.md#static-hexzeropad)*

**Parameters:**

Name | Type |
------ | ------ |
`hexStr` | string |
`length` | number |

**Returns:** *string*

___

### `Static` isHexString

▸ **isHexString**(`v`: string): *boolean*

*Inherited from [Base](_src_base_.base.md).[isHexString](_src_base_.base.md#static-ishexstring)*

isHexString

**`desc`** Returns true if value is a hex string.

**`example`** 
```js
console.log(MerkleTree.isHexString('0x1234'))
```

**Parameters:**

Name | Type |
------ | ------ |
`v` | string |

**Returns:** *boolean*

___

### `Static` linearSearch

▸ **linearSearch**(`array`: Buffer[], `element`: Buffer, `eqChecker`: function): *number*

*Inherited from [Base](_src_base_.base.md).[linearSearch](_src_base_.base.md#static-linearsearch)*

linearSearch

**`desc`** Returns the first index of which given item is found in array using linear search.

**`example`** 
```js
const index = MerkleTree.linearSearch(array, element, (a, b) => a === b)
```

**Parameters:**

▪ **array**: *Buffer[]*

Array of items.

▪ **element**: *Buffer*

Item to find.

▪ **eqChecker**: *function*

▸ (`a`: unknown, `b`: unknown): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`a` | unknown |
`b` | unknown |

**Returns:** *number*

- Index number

___

### `Static` print

▸ **print**(`tree`: any): *void*

*Inherited from [Base](_src_base_.base.md).[print](_src_base_.base.md#print)*

print

**`desc`** Prints out a visual representation of the given merkle tree.

**`example`** 
```js
MerkleTree.print(tree)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tree` | any | Merkle tree instance. |

**Returns:** *void*
