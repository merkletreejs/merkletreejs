[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/Base"](../modules/_src_base_.md) › [Base](_src_base_.base.md)

# Class: Base

## Hierarchy

* **Base**

  ↳ [MerkleMountainRange](_src_merklemountainrange_.merklemountainrange.md)

  ↳ [MerkleTree](_src_merkletree_.merkletree.md)

## Index

### Methods

* [_bufferIndexOf](_src_base_.base.md#protected-_bufferindexof)
* [_bufferifyFn](_src_base_.base.md#protected-_bufferifyfn)
* [_isHexString](_src_base_.base.md#protected-_ishexstring)
* [_log2](_src_base_.base.md#protected-_log2)
* [_zip](_src_base_.base.md#protected-_zip)
* [bufferToHex](_src_base_.base.md#buffertohex)
* [bufferify](_src_base_.base.md#bufferify)
* [print](_src_base_.base.md#print)
* [bufferToHex](_src_base_.base.md#static-buffertohex)
* [bufferify](_src_base_.base.md#static-bufferify)
* [isHexString](_src_base_.base.md#static-ishexstring)
* [print](_src_base_.base.md#static-print)

## Methods

### `Protected` _bufferIndexOf

▸ **_bufferIndexOf**(`array`: Buffer[], `element`: Buffer): *number*

bufferIndexOf

**`desc`** Returns the first index of which given buffer is found in array.

**`example`** 
```js
const index = tree.bufferIndexOf(haystack, needle)
```

**Parameters:**

Name | Type |
------ | ------ |
`array` | Buffer[] |
`element` | Buffer |

**Returns:** *number*

- Index number

___

### `Protected` _bufferifyFn

▸ **_bufferifyFn**(`f`: any): *any*

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

### `Protected` _isHexString

▸ **_isHexString**(`value`: string): *boolean*

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

### `Protected` _log2

▸ **_log2**(`n`: number): *number*

log2

**`desc`** Returns the log2 of number.

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *number*

___

### `Protected` _zip

▸ **_zip**(`a`: any[], `b`: any[]): *any[][]*

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

###  bufferToHex

▸ **bufferToHex**(`value`: Buffer, `withPrefix`: boolean): *string*

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

###  print

▸ **print**(): *void*

print

**`desc`** Prints out a visual representation of the merkle tree.

**`example`** 
```js
tree.print()
```

**Returns:** *void*

___

### `Static` bufferToHex

▸ **bufferToHex**(`value`: Buffer, `withPrefix`: boolean): *string*

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

### `Static` isHexString

▸ **isHexString**(`v`: string): *boolean*

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

### `Static` print

▸ **print**(`tree`: any): *void*

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
