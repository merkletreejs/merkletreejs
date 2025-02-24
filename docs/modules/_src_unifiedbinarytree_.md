[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/UnifiedBinaryTree"](_src_unifiedbinarytree_.md)

# Module: "src/UnifiedBinaryTree"

## Index

### Classes

* [InternalNode](../classes/_src_unifiedbinarytree_.internalnode.md)
* [StemNode](../classes/_src_unifiedbinarytree_.stemnode.md)
* [UnifiedBinaryTree](../classes/_src_unifiedbinarytree_.unifiedbinarytree.md)

### Type aliases

* [Address](_src_unifiedbinarytree_.md#address)
* [Address32](_src_unifiedbinarytree_.md#address32)
* [BinaryTreeNode](_src_unifiedbinarytree_.md#binarytreenode)
* [Bytes32](_src_unifiedbinarytree_.md#bytes32)
* [HashFunction](_src_unifiedbinarytree_.md#hashfunction)

### Variables

* [BASIC_DATA_LEAF_KEY](_src_unifiedbinarytree_.md#const-basic_data_leaf_key)
* [CODE_HASH_LEAF_KEY](_src_unifiedbinarytree_.md#const-code_hash_leaf_key)
* [CODE_OFFSET](_src_unifiedbinarytree_.md#const-code_offset)
* [HEADER_STORAGE_OFFSET](_src_unifiedbinarytree_.md#const-header_storage_offset)
* [MAIN_STORAGE_OFFSET](_src_unifiedbinarytree_.md#const-main_storage_offset)
* [STEM_SUBTREE_WIDTH](_src_unifiedbinarytree_.md#const-stem_subtree_width)
* [push1](_src_unifiedbinarytree_.md#const-push1)
* [push32](_src_unifiedbinarytree_.md#const-push32)
* [pushOffset](_src_unifiedbinarytree_.md#const-pushoffset)

### Functions

* [chunkifyCode](_src_unifiedbinarytree_.md#chunkifycode)
* [getTreeKey](_src_unifiedbinarytree_.md#gettreekey)
* [getTreeKeyForBasicData](_src_unifiedbinarytree_.md#gettreekeyforbasicdata)
* [getTreeKeyForCodeChunk](_src_unifiedbinarytree_.md#gettreekeyforcodechunk)
* [getTreeKeyForCodeHash](_src_unifiedbinarytree_.md#gettreekeyforcodehash)
* [getTreeKeyForStorageSlot](_src_unifiedbinarytree_.md#gettreekeyforstorageslot)
* [oldStyleAddressToAddress32](_src_unifiedbinarytree_.md#oldstyleaddresstoaddress32)
* [treeHash](_src_unifiedbinarytree_.md#treehash)
* [treeHashFn](_src_unifiedbinarytree_.md#treehashfn)

## Type aliases

###  Address

Ƭ **Address**: *Buffer*

Type aliases for fixed-length byte sequences used throughout the codebase.
These help maintain type safety and clarify the expected byte lengths.

___

###  Address32

Ƭ **Address32**: *Buffer*

___

###  BinaryTreeNode

Ƭ **BinaryTreeNode**: *[StemNode](../classes/_src_unifiedbinarytree_.stemnode.md) | [InternalNode](../classes/_src_unifiedbinarytree_.internalnode.md)*

Node types in the binary tree.
- StemNode: Leaf node containing up to 256 values
- InternalNode: Internal node with left and right children

___

###  Bytes32

Ƭ **Bytes32**: *Buffer*

___

###  HashFunction

Ƭ **HashFunction**: *function*

Function type for hash operations

#### Type declaration:

▸ (`data`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

## Variables

### `Const` BASIC_DATA_LEAF_KEY

• **BASIC_DATA_LEAF_KEY**: *0* = 0

Constants used for key derivation and tree organization.
These define the structure and layout of the binary tree.

___

### `Const` CODE_HASH_LEAF_KEY

• **CODE_HASH_LEAF_KEY**: *1* = 1

___

### `Const` CODE_OFFSET

• **CODE_OFFSET**: *128* = 128

___

### `Const` HEADER_STORAGE_OFFSET

• **HEADER_STORAGE_OFFSET**: *64* = 64

___

### `Const` MAIN_STORAGE_OFFSET

• **MAIN_STORAGE_OFFSET**: *256* = 256

___

### `Const` STEM_SUBTREE_WIDTH

• **STEM_SUBTREE_WIDTH**: *256* = 256

___

### `Const` push1

• **push1**: *number* = pushOffset + 1

___

### `Const` push32

• **push32**: *number* = pushOffset + 32

___

### `Const` pushOffset

• **pushOffset**: *95* = 95

## Functions

###  chunkifyCode

▸ **chunkifyCode**(`code`: Buffer): *[Bytes32](_src_unifiedbinarytree_.md#bytes32)[]*

Splits EVM bytecode into 31-byte chunks with metadata.
Each chunk is prefixed with a byte indicating the number of bytes
that are part of PUSH data in the next chunk.

**`example`** 
```typescript
const code = Buffer.from('6001600201', 'hex') // PUSH1 01 PUSH1 02 ADD
const chunks = chunkifyCode(code)
// chunks[0] = [0x01, 0x60, 0x01, 0x60, 0x02, 0x01, 0x00...] (32 bytes)
```

**Parameters:**

Name | Type |
------ | ------ |
`code` | Buffer |

**Returns:** *[Bytes32](_src_unifiedbinarytree_.md#bytes32)[]*

___

###  getTreeKey

▸ **getTreeKey**(`address`: [Address32](_src_unifiedbinarytree_.md#address32), `treeIndex`: number, `subIndex`: number, `hashFn`: [HashFunction](_src_unifiedbinarytree_.md#hashfunction)): *[Address32](_src_unifiedbinarytree_.md#address32)*

Derives a tree key from an address and indices using a hash function.
Used to generate unique keys for different parts of the tree structure.
The resulting key is composed of a 31-byte stem (derived from address and treeIndex)
and a 1-byte subIndex.

**`throws`** Error if address is not 32 bytes

**`example`** 
```typescript
const addr32 = oldStyleAddressToAddress32(address)
const treeKey = getTreeKey(addr32, 0, 1, blake3.hash)
// Returns a unique key for this address's tree at index 0, subIndex 1
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | [Address32](_src_unifiedbinarytree_.md#address32) | A 32-byte address to derive the key from |
`treeIndex` | number | Primary index used to derive different trees for the same address |
`subIndex` | number | Secondary index used to derive different keys within the same tree |
`hashFn` | [HashFunction](_src_unifiedbinarytree_.md#hashfunction) | Hash function to use for key derivation |

**Returns:** *[Address32](_src_unifiedbinarytree_.md#address32)*

A 32-byte key that uniquely identifies this storage slot

___

###  getTreeKeyForBasicData

▸ **getTreeKeyForBasicData**(`address`: [Address32](_src_unifiedbinarytree_.md#address32), `hashFn`: [HashFunction](_src_unifiedbinarytree_.md#hashfunction)): *[Address32](_src_unifiedbinarytree_.md#address32)*

Derives a key for storing an account's basic data (nonce, balance, etc.).

**`example`** 
```typescript
const addr32 = oldStyleAddressToAddress32(address)
const basicDataKey = getTreeKeyForBasicData(addr32, hashFn)
tree.insert(basicDataKey, accountData)
```

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address32](_src_unifiedbinarytree_.md#address32) |
`hashFn` | [HashFunction](_src_unifiedbinarytree_.md#hashfunction) |

**Returns:** *[Address32](_src_unifiedbinarytree_.md#address32)*

___

###  getTreeKeyForCodeChunk

▸ **getTreeKeyForCodeChunk**(`address`: [Address32](_src_unifiedbinarytree_.md#address32), `chunkId`: number, `hashFn`: [HashFunction](_src_unifiedbinarytree_.md#hashfunction)): *[Address32](_src_unifiedbinarytree_.md#address32)*

Derives a key for storing a chunk of contract code.
Used when contract code is split into 32-byte chunks.

**`example`** 
```typescript
const addr32 = oldStyleAddressToAddress32(contractAddress)
const chunks = chunkifyCode(contractCode)
chunks.forEach((chunk, i) => {
  const key = getTreeKeyForCodeChunk(addr32, i, hashFn)
  tree.insert(key, chunk)
})
```

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address32](_src_unifiedbinarytree_.md#address32) |
`chunkId` | number |
`hashFn` | [HashFunction](_src_unifiedbinarytree_.md#hashfunction) |

**Returns:** *[Address32](_src_unifiedbinarytree_.md#address32)*

___

###  getTreeKeyForCodeHash

▸ **getTreeKeyForCodeHash**(`address`: [Address32](_src_unifiedbinarytree_.md#address32), `hashFn`: [HashFunction](_src_unifiedbinarytree_.md#hashfunction)): *[Address32](_src_unifiedbinarytree_.md#address32)*

Derives a key for storing a contract's code hash.

**`example`** 
```typescript
const addr32 = oldStyleAddressToAddress32(contractAddress)
const codeHashKey = getTreeKeyForCodeHash(addr32, hashFn)
tree.insert(codeHashKey, codeHash)
```

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address32](_src_unifiedbinarytree_.md#address32) |
`hashFn` | [HashFunction](_src_unifiedbinarytree_.md#hashfunction) |

**Returns:** *[Address32](_src_unifiedbinarytree_.md#address32)*

___

###  getTreeKeyForStorageSlot

▸ **getTreeKeyForStorageSlot**(`address`: [Address32](_src_unifiedbinarytree_.md#address32), `storageKey`: number, `hashFn`: [HashFunction](_src_unifiedbinarytree_.md#hashfunction)): *[Address32](_src_unifiedbinarytree_.md#address32)*

Derives a tree key for a storage slot in a contract's storage.
Handles two types of storage:
1. Header storage (slots 0-63): Used for contract metadata and special storage
2. Main storage (slots 256+): Used for regular contract storage

The storage layout is:
- Header storage: slots [0, 63] mapped to positions [64, 127]
- Main storage: slots [256+] mapped to positions [384+]
This creates gaps in the tree to allow for future extensions.

**`example`** 
```typescript
const addr32 = oldStyleAddressToAddress32(contractAddress)
// Get key for a header storage slot (0-63)
const headerKey = getTreeKeyForStorageSlot(addr32, 5, blake3.hash)
// Get key for a main storage slot (256+)
const mainKey = getTreeKeyForStorageSlot(addr32, 300, blake3.hash)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | [Address32](_src_unifiedbinarytree_.md#address32) | The 32-byte contract address |
`storageKey` | number | The storage slot number to access |
`hashFn` | [HashFunction](_src_unifiedbinarytree_.md#hashfunction) | Hash function to use for key derivation |

**Returns:** *[Address32](_src_unifiedbinarytree_.md#address32)*

A 32-byte key that uniquely identifies this storage slot

___

###  oldStyleAddressToAddress32

▸ **oldStyleAddressToAddress32**(`address`: [Address](_src_unifiedbinarytree_.md#address)): *[Address32](_src_unifiedbinarytree_.md#address32)*

Converts a 20-byte Ethereum address to a 32-byte address by left-padding with zeros.

**`example`** 
```typescript
const addr20 = Buffer.from('1234567890123456789012345678901234567890', 'hex')
const addr32 = oldStyleAddressToAddress32(addr20)
// addr32 = 0x000000000000123456789012345678901234567890 (32 bytes)
```

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address](_src_unifiedbinarytree_.md#address) |

**Returns:** *[Address32](_src_unifiedbinarytree_.md#address32)*

___

###  treeHash

▸ **treeHash**(`input`: Buffer, `hashFn`: [HashFunction](_src_unifiedbinarytree_.md#hashfunction)): *[Bytes32](_src_unifiedbinarytree_.md#bytes32)*

Applies a hash function to input data with proper buffering.

**`example`** 
```typescript
const input = Buffer.from('Hello World')
const hashFn = (data) => blake3.hash(data)
const hash = treeHash(input, hashFn)
// hash = 32-byte BLAKE3 hash of 'Hello World'
```

**Parameters:**

Name | Type |
------ | ------ |
`input` | Buffer |
`hashFn` | [HashFunction](_src_unifiedbinarytree_.md#hashfunction) |

**Returns:** *[Bytes32](_src_unifiedbinarytree_.md#bytes32)*

___

###  treeHashFn

▸ **treeHashFn**(`hashFn`: [HashFunction](_src_unifiedbinarytree_.md#hashfunction)): *any*

**Parameters:**

Name | Type |
------ | ------ |
`hashFn` | [HashFunction](_src_unifiedbinarytree_.md#hashfunction) |

**Returns:** *any*
