[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/IncrementalMerkleTree"](../modules/_src_incrementalmerkletree_.md) › [IncrementalMerkleTree](_src_incrementalmerkletree_.incrementalmerkletree.md)

# Class: IncrementalMerkleTree

## Hierarchy

* [Base](_src_base_.base.md)

  ↳ **IncrementalMerkleTree**

## Index

### Constructors

* [constructor](_src_incrementalmerkletree_.incrementalmerkletree.md#constructor)

### Methods

* [bigNumberify](_src_incrementalmerkletree_.incrementalmerkletree.md#bignumberify)
* [binarySearch](_src_incrementalmerkletree_.incrementalmerkletree.md#binarysearch)
* [bufferIndexOf](_src_incrementalmerkletree_.incrementalmerkletree.md#protected-bufferindexof)
* [bufferToHex](_src_incrementalmerkletree_.incrementalmerkletree.md#buffertohex)
* [bufferify](_src_incrementalmerkletree_.incrementalmerkletree.md#bufferify)
* [bufferifyFn](_src_incrementalmerkletree_.incrementalmerkletree.md#bufferifyfn)
* [computeRoot](_src_incrementalmerkletree_.incrementalmerkletree.md#computeroot)
* [copyList](_src_incrementalmerkletree_.incrementalmerkletree.md#copylist)
* [delete](_src_incrementalmerkletree_.incrementalmerkletree.md#delete)
* [getArity](_src_incrementalmerkletree_.incrementalmerkletree.md#getarity)
* [getDepth](_src_incrementalmerkletree_.incrementalmerkletree.md#getdepth)
* [getHexLayers](_src_incrementalmerkletree_.incrementalmerkletree.md#gethexlayers)
* [getHexRoot](_src_incrementalmerkletree_.incrementalmerkletree.md#gethexroot)
* [getLayers](_src_incrementalmerkletree_.incrementalmerkletree.md#getlayers)
* [getLayersAsObject](_src_incrementalmerkletree_.incrementalmerkletree.md#getlayersasobject)
* [getLeaves](_src_incrementalmerkletree_.incrementalmerkletree.md#getleaves)
* [getMaxLeaves](_src_incrementalmerkletree_.incrementalmerkletree.md#getmaxleaves)
* [getProof](_src_incrementalmerkletree_.incrementalmerkletree.md#getproof)
* [getRoot](_src_incrementalmerkletree_.incrementalmerkletree.md#getroot)
* [indexOf](_src_incrementalmerkletree_.incrementalmerkletree.md#indexof)
* [insert](_src_incrementalmerkletree_.incrementalmerkletree.md#insert)
* [isHexString](_src_incrementalmerkletree_.incrementalmerkletree.md#protected-ishexstring)
* [linearSearch](_src_incrementalmerkletree_.incrementalmerkletree.md#linearsearch)
* [log2](_src_incrementalmerkletree_.incrementalmerkletree.md#protected-log2)
* [print](_src_incrementalmerkletree_.incrementalmerkletree.md#print)
* [toString](_src_incrementalmerkletree_.incrementalmerkletree.md#tostring)
* [toTreeString](_src_incrementalmerkletree_.incrementalmerkletree.md#protected-totreestring)
* [update](_src_incrementalmerkletree_.incrementalmerkletree.md#update)
* [verify](_src_incrementalmerkletree_.incrementalmerkletree.md#verify)
* [zip](_src_incrementalmerkletree_.incrementalmerkletree.md#protected-zip)
* [bigNumberify](_src_incrementalmerkletree_.incrementalmerkletree.md#static-bignumberify)
* [binarySearch](_src_incrementalmerkletree_.incrementalmerkletree.md#static-binarysearch)
* [bufferToHex](_src_incrementalmerkletree_.incrementalmerkletree.md#static-buffertohex)
* [bufferify](_src_incrementalmerkletree_.incrementalmerkletree.md#static-bufferify)
* [hexZeroPad](_src_incrementalmerkletree_.incrementalmerkletree.md#static-hexzeropad)
* [isHexString](_src_incrementalmerkletree_.incrementalmerkletree.md#static-ishexstring)
* [linearSearch](_src_incrementalmerkletree_.incrementalmerkletree.md#static-linearsearch)
* [print](_src_incrementalmerkletree_.incrementalmerkletree.md#static-print)

## Constructors

###  constructor

\+ **new IncrementalMerkleTree**(`hashFn`: any, `options`: [Options](../interfaces/_src_incrementalmerkletree_.options.md)): *[IncrementalMerkleTree](_src_incrementalmerkletree_.incrementalmerkletree.md)*

**Parameters:**

Name | Type |
------ | ------ |
`hashFn` | any |
`options` | [Options](../interfaces/_src_incrementalmerkletree_.options.md) |

**Returns:** *[IncrementalMerkleTree](_src_incrementalmerkletree_.incrementalmerkletree.md)*

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

*Inherited from [Base](_src_base_.base.md).[bufferifyFn](_src_base_.base.md#bufferifyfn)*

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

###  computeRoot

▸ **computeRoot**(): *any*

**Returns:** *any*

___

###  copyList

▸ **copyList**(`list`: any[]): *bigint[]*

**Parameters:**

Name | Type |
------ | ------ |
`list` | any[] |

**Returns:** *bigint[]*

___

###  delete

▸ **delete**(`index`: number): *void*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *void*

___

###  getArity

▸ **getArity**(): *number*

**Returns:** *number*

___

###  getDepth

▸ **getDepth**(): *number*

**Returns:** *number*

___

###  getHexLayers

▸ **getHexLayers**(): *string[]*

**Returns:** *string[]*

___

###  getHexRoot

▸ **getHexRoot**(): *string*

**Returns:** *string*

___

###  getLayers

▸ **getLayers**(): *any[]*

**Returns:** *any[]*

___

###  getLayersAsObject

▸ **getLayersAsObject**(): *any*

**Returns:** *any*

___

###  getLeaves

▸ **getLeaves**(): *bigint[]*

**Returns:** *bigint[]*

___

###  getMaxLeaves

▸ **getMaxLeaves**(): *number*

**Returns:** *number*

___

###  getProof

▸ **getProof**(`index`: number): *any*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *any*

___

###  getRoot

▸ **getRoot**(): *any*

**Returns:** *any*

___

###  indexOf

▸ **indexOf**(`leaf`: any): *number*

**Parameters:**

Name | Type |
------ | ------ |
`leaf` | any |

**Returns:** *number*

___

###  insert

▸ **insert**(`leaf`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`leaf` | any |

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

###  toString

▸ **toString**(): *string*

**Returns:** *string*

___

### `Protected` toTreeString

▸ **toTreeString**(): *string*

**Returns:** *string*

___

###  update

▸ **update**(`index`: number, `newLeaf`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`newLeaf` | any |

**Returns:** *void*

___

###  verify

▸ **verify**(`proof`: any): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`proof` | any |

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
