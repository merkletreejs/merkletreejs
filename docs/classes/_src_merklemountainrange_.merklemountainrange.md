[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/MerkleMountainRange"](../modules/_src_merklemountainrange_.md) › [MerkleMountainRange](_src_merklemountainrange_.merklemountainrange.md)

# Class: MerkleMountainRange

**`desc`** The index of this MMR implementation starts from 1 not 0.

## Hierarchy

* [Base](_src_base_.base.md)

  ↳ **MerkleMountainRange**

## Index

### Constructors

* [constructor](_src_merklemountainrange_.merklemountainrange.md#constructor)

### Properties

* [data](_src_merklemountainrange_.merklemountainrange.md#data)
* [hashBranchFn](_src_merklemountainrange_.merklemountainrange.md#hashbranchfn)
* [hashLeafFn](_src_merklemountainrange_.merklemountainrange.md#hashleaffn)
* [hashes](_src_merklemountainrange_.merklemountainrange.md#hashes)
* [peakBaggingFn](_src_merklemountainrange_.merklemountainrange.md#peakbaggingfn)
* [root](_src_merklemountainrange_.merklemountainrange.md#root)
* [size](_src_merklemountainrange_.merklemountainrange.md#size)
* [width](_src_merklemountainrange_.merklemountainrange.md#width)

### Methods

* [append](_src_merklemountainrange_.merklemountainrange.md#append)
* [bigNumberify](_src_merklemountainrange_.merklemountainrange.md#bignumberify)
* [binarySearch](_src_merklemountainrange_.merklemountainrange.md#binarysearch)
* [bufferArrayIncludes](_src_merklemountainrange_.merklemountainrange.md#bufferarrayincludes)
* [bufferIndexOf](_src_merklemountainrange_.merklemountainrange.md#protected-bufferindexof)
* [bufferToHex](_src_merklemountainrange_.merklemountainrange.md#buffertohex)
* [bufferify](_src_merklemountainrange_.merklemountainrange.md#bufferify)
* [bufferifyFn](_src_merklemountainrange_.merklemountainrange.md#bufferifyfn)
* [getChildren](_src_merklemountainrange_.merklemountainrange.md#getchildren)
* [getHexRoot](_src_merklemountainrange_.merklemountainrange.md#gethexroot)
* [getLeafIndex](_src_merklemountainrange_.merklemountainrange.md#getleafindex)
* [getMerkleProof](_src_merklemountainrange_.merklemountainrange.md#getmerkleproof)
* [getNode](_src_merklemountainrange_.merklemountainrange.md#getnode)
* [getPeakIndexes](_src_merklemountainrange_.merklemountainrange.md#getpeakindexes)
* [getPeaks](_src_merklemountainrange_.merklemountainrange.md#getpeaks)
* [getRoot](_src_merklemountainrange_.merklemountainrange.md#getroot)
* [getSize](_src_merklemountainrange_.merklemountainrange.md#getsize)
* [hashBranch](_src_merklemountainrange_.merklemountainrange.md#hashbranch)
* [hashLeaf](_src_merklemountainrange_.merklemountainrange.md#hashleaf)
* [heightAt](_src_merklemountainrange_.merklemountainrange.md#heightat)
* [isHexString](_src_merklemountainrange_.merklemountainrange.md#protected-ishexstring)
* [isLeaf](_src_merklemountainrange_.merklemountainrange.md#isleaf)
* [linearSearch](_src_merklemountainrange_.merklemountainrange.md#linearsearch)
* [log2](_src_merklemountainrange_.merklemountainrange.md#protected-log2)
* [mountainHeight](_src_merklemountainrange_.merklemountainrange.md#mountainheight)
* [numOfPeaks](_src_merklemountainrange_.merklemountainrange.md#numofpeaks)
* [peakBagging](_src_merklemountainrange_.merklemountainrange.md#peakbagging)
* [peakMapToPeaks](_src_merklemountainrange_.merklemountainrange.md#peakmaptopeaks)
* [peakUpdate](_src_merklemountainrange_.merklemountainrange.md#peakupdate)
* [peaksToPeakMap](_src_merklemountainrange_.merklemountainrange.md#peakstopeakmap)
* [print](_src_merklemountainrange_.merklemountainrange.md#print)
* [rollUp](_src_merklemountainrange_.merklemountainrange.md#rollup)
* [verify](_src_merklemountainrange_.merklemountainrange.md#verify)
* [zip](_src_merklemountainrange_.merklemountainrange.md#protected-zip)
* [bigNumberify](_src_merklemountainrange_.merklemountainrange.md#static-bignumberify)
* [binarySearch](_src_merklemountainrange_.merklemountainrange.md#static-binarysearch)
* [bufferToHex](_src_merklemountainrange_.merklemountainrange.md#static-buffertohex)
* [bufferify](_src_merklemountainrange_.merklemountainrange.md#static-bufferify)
* [bufferifyFn](_src_merklemountainrange_.merklemountainrange.md#static-bufferifyfn)
* [hexZeroPad](_src_merklemountainrange_.merklemountainrange.md#static-hexzeropad)
* [isHexString](_src_merklemountainrange_.merklemountainrange.md#static-ishexstring)
* [linearSearch](_src_merklemountainrange_.merklemountainrange.md#static-linearsearch)
* [print](_src_merklemountainrange_.merklemountainrange.md#static-print)

## Constructors

###  constructor

\+ **new MerkleMountainRange**(`hashFn`: any, `leaves`: any[], `hashLeafFn?`: any, `peakBaggingFn?`: any, `hashBranchFn?`: any): *[MerkleMountainRange](_src_merklemountainrange_.merklemountainrange.md)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`hashFn` | any | SHA256 |
`leaves` | any[] | [] |
`hashLeafFn?` | any | - |
`peakBaggingFn?` | any | - |
`hashBranchFn?` | any | - |

**Returns:** *[MerkleMountainRange](_src_merklemountainrange_.merklemountainrange.md)*

## Properties

###  data

• **data**: *any*

___

###  hashBranchFn

• **hashBranchFn**: *any*

___

###  hashLeafFn

• **hashLeafFn**: *any*

___

###  hashes

• **hashes**: *any*

___

###  peakBaggingFn

• **peakBaggingFn**: *any*

___

###  root

• **root**: *Buffer* = Buffer.alloc(0)

___

###  size

• **size**: *number* = 0

___

###  width

• **width**: *number* = 0

## Methods

###  append

▸ **append**(`data`: Buffer | string): *void*

**`desc`** This only stores the hashed value of the leaf.
If you need to retrieve the detail data later, use a map to store them.

**Parameters:**

Name | Type |
------ | ------ |
`data` | Buffer &#124; string |

**Returns:** *void*

___

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

###  getChildren

▸ **getChildren**(`index`: number): *number[]*

**`desc`** It returns the children when it is a parent node.

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *number[]*

___

###  getHexRoot

▸ **getHexRoot**(): *any*

**Returns:** *any*

___

###  getLeafIndex

▸ **getLeafIndex**(`width`: number): *number*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |

**Returns:** *number*

___

###  getMerkleProof

▸ **getMerkleProof**(`index`: number): *object*

**`desc`** It returns a merkle proof for a leaf. Note that the index starts from 1.

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *object*

* **peakBagging**: *any[]*

* **root**: *Buffer‹›*

* **siblings**: *any[]*

* **width**: *number*

___

###  getNode

▸ **getNode**(`index`: number): *any*

**`dev`** It returns the hash value of a node for the given position. Note that the index starts from 1.

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *any*

___

###  getPeakIndexes

▸ **getPeakIndexes**(`width`: number): *number[]*

**`desc`** It returns all peaks of the smallest merkle mountain range tree which includes
      the given index(size).

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |

**Returns:** *number[]*

___

###  getPeaks

▸ **getPeaks**(): *any[]*

**Returns:** *any[]*

___

###  getRoot

▸ **getRoot**(): *any*

**`desc`** It returns the root value of the tree.

**Returns:** *any*

___

###  getSize

▸ **getSize**(`width`: number): *number*

**`desc`** It returns the size of the tree.

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |

**Returns:** *number*

___

###  hashBranch

▸ **hashBranch**(`index`: number, `left`: any, `right`: any): *any*

**`desc`** It returns the hash a parent node with hash(M | Left child | Right child)
      M is the index of the node.

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`left` | any |
`right` | any |

**Returns:** *any*

___

###  hashLeaf

▸ **hashLeaf**(`index`: number, `dataHash`: Buffer | string): *any*

**`desc`** It returns the hash of a leaf node with hash(M | DATA )
      M is the index of the node.

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |
`dataHash` | Buffer &#124; string |

**Returns:** *any*

___

###  heightAt

▸ **heightAt**(`index`: number): *number*

**`desc`** It returns the height of the index.

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *number*

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

###  isLeaf

▸ **isLeaf**(`index`: number): *boolean*

**`desc`** It returns whether the index is the leaf node or not

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

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

###  mountainHeight

▸ **mountainHeight**(`size`: number): *number*

**`desc`** It returns the height of the highest peak.

**Parameters:**

Name | Type |
------ | ------ |
`size` | number |

**Returns:** *number*

___

###  numOfPeaks

▸ **numOfPeaks**(`width`: number): *number*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |

**Returns:** *number*

___

###  peakBagging

▸ **peakBagging**(`width`: number, `peaks`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |
`peaks` | any[] |

**Returns:** *any*

___

###  peakMapToPeaks

▸ **peakMapToPeaks**(`width`: number, `peakMap`: any): *any[]*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |
`peakMap` | any |

**Returns:** *any[]*

___

###  peakUpdate

▸ **peakUpdate**(`width`: number, `prevPeakMap`: any, `itemHash`: any): *object*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |
`prevPeakMap` | any |
`itemHash` | any |

**Returns:** *object*

___

###  peaksToPeakMap

▸ **peaksToPeakMap**(`width`: number, `peaks`: any[]): *object*

**Parameters:**

Name | Type |
------ | ------ |
`width` | number |
`peaks` | any[] |

**Returns:** *object*

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

###  rollUp

▸ **rollUp**(`root`: any, `width`: number, `peaks`: any[], `itemHashes`: any[]): *any*

**Parameters:**

Name | Type |
------ | ------ |
`root` | any |
`width` | number |
`peaks` | any[] |
`itemHashes` | any[] |

**Returns:** *any*

___

###  verify

▸ **verify**(`root`: any, `width`: number, `index`: number, `value`: Buffer | string, `peaks`: any[], `siblings`: any[]): *boolean*

**`desc`** It returns true when the given params verifies that the given value exists in the tree or reverts the transaction.

**Parameters:**

Name | Type |
------ | ------ |
`root` | any |
`width` | number |
`index` | number |
`value` | Buffer &#124; string |
`peaks` | any[] |
`siblings` | any[] |

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
