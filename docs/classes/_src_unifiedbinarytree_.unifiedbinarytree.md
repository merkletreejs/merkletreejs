[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/UnifiedBinaryTree"](../modules/_src_unifiedbinarytree_.md) › [UnifiedBinaryTree](_src_unifiedbinarytree_.unifiedbinarytree.md)

# Class: UnifiedBinaryTree

Main binary tree implementation that stores key-value pairs.
Uses a configurable hash function and supports various operations.

**`example`** 
```typescript
const tree = new BinaryTree(blake3.hash)
tree.insert(key, value)
const root = tree.merkelize()
const serialized = tree.serialize()
```

## Hierarchy

* **UnifiedBinaryTree**

## Index

### Constructors

* [constructor](_src_unifiedbinarytree_.unifiedbinarytree.md#constructor)

### Properties

* [hashFn](_src_unifiedbinarytree_.unifiedbinarytree.md#hashfn)
* [root](_src_unifiedbinarytree_.unifiedbinarytree.md#root)

### Methods

* [insert](_src_unifiedbinarytree_.unifiedbinarytree.md#insert)
* [insertBatch](_src_unifiedbinarytree_.unifiedbinarytree.md#insertbatch)
* [merkelize](_src_unifiedbinarytree_.unifiedbinarytree.md#merkelize)
* [serialize](_src_unifiedbinarytree_.unifiedbinarytree.md#serialize)
* [update](_src_unifiedbinarytree_.unifiedbinarytree.md#update)
* [deserialize](_src_unifiedbinarytree_.unifiedbinarytree.md#static-deserialize)

## Constructors

###  constructor

\+ **new UnifiedBinaryTree**(`hashFn`: [HashFunction](../modules/_src_unifiedbinarytree_.md#hashfunction)): *[UnifiedBinaryTree](_src_unifiedbinarytree_.unifiedbinarytree.md)*

Creates a new BinaryTree instance with the given hash function.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hashFn` | [HashFunction](../modules/_src_unifiedbinarytree_.md#hashfunction) | The hash function to use for key derivation.  |

**Returns:** *[UnifiedBinaryTree](_src_unifiedbinarytree_.unifiedbinarytree.md)*

## Properties

###  hashFn

• **hashFn**: *[HashFunction](../modules/_src_unifiedbinarytree_.md#hashfunction)*

___

###  root

• **root**: *[BinaryTreeNode](../modules/_src_unifiedbinarytree_.md#binarytreenode) | null* = null

## Methods

###  insert

▸ **insert**(`key`: Buffer, `value`: Buffer): *void*

Inserts a key-value pair into the binary tree.
The key is split into two parts:
- stem (first 31 bytes): Determines the path in the tree
- subIndex (last byte): Determines the position within a leaf node

If this is the first insertion, creates a new leaf node.
Otherwise, recursively traverses or builds the tree structure.

**`throws`** Error if key or value is not exactly 32 bytes

**`example`** 
```typescript
const tree = new BinaryTree(hashFn)
const key = getTreeKey(address, 0, 1, hashFn)
const value = Buffer.alloc(32).fill(1)
tree.insert(key, value)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | A 32-byte key that determines where to store the value |
`value` | Buffer | A 32-byte value to store |

**Returns:** *void*

___

###  insertBatch

▸ **insertBatch**(`entries`: object[]): *void*

Performs a batch insertion of key-value pairs.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entries` | object[] | An array of objects with 'key' and 'value' properties.  |

**Returns:** *void*

___

###  merkelize

▸ **merkelize**(): *Buffer*

Computes the Merkle root of the entire tree.
The Merkle root is a single 32-byte hash that uniquely represents the entire tree state.

The computation follows these rules:
1. For Internal nodes: hash(leftChild || rightChild)
2. For Stem nodes: hash(stem || 0x00 || merkleOfValues)
3. For empty nodes: return 32 bytes of zeros

**`example`** 
```typescript
const tree = new BinaryTree(hashFn)
tree.insert(key1, value1)
tree.insert(key2, value2)
const root = tree.merkelize()
// root now contains a 32-byte hash representing the entire tree
```

**Returns:** *Buffer*

A 32-byte Buffer containing the Merkle root

___

###  serialize

▸ **serialize**(): *Buffer*

Serializes the entire tree structure into a JSON Buffer.
Converts the tree into a format that can be stored or transmitted,
preserving the complete structure and all values.

The serialized format for each node type is:
1. Stem Node:
   ```json
   {
     "nodeType": "stem",
     "stem": "hex string of 31 bytes",
     "values": ["hex string or null", ...] // 256 entries
   }
   ```
2. Internal Node:
   ```json
   {
     "nodeType": "internal",
     "left": <node or null>,
     "right": <node or null>
   }
   ```

**`example`** 
```typescript
const tree = new BinaryTree(hashFn)
tree.insert(key, value)
const serialized = tree.serialize()
// Save to file or transmit
const newTree = UnifiedBinaryTree.deserialize(serialized, hashFn)
```

**Returns:** *Buffer*

Buffer containing the JSON string representation of the tree

___

###  update

▸ **update**(`key`: Buffer, `value`: Buffer): *void*

Incrementally updates the value for an existing key.
For our implementation, update is the same as insert.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | Buffer | A 32-byte key. |
`value` | Buffer | A 32-byte value.  |

**Returns:** *void*

___

### `Static` deserialize

▸ **deserialize**(`data`: Buffer, `hashFn`: [HashFunction](../modules/_src_unifiedbinarytree_.md#hashfunction)): *[UnifiedBinaryTree](_src_unifiedbinarytree_.unifiedbinarytree.md)*

Reconstructs a BinaryTree from its serialized form.
This is the inverse operation of serialize().

Expected input format:
```json
{
  "root": {
    "nodeType": "internal"|"stem",
    // For stem nodes:
    "stem": "hex string",
    "values": ["hex string"|null, ...],
    // For internal nodes:
    "left": <node|null>,
    "right": <node|null>
  }
}
```

**`throws`** Error if JSON parsing fails or format is invalid

**`example`** 
```typescript
const serialized = existingTree.serialize()
const newTree = UnifiedBinaryTree.deserialize(serialized, hashFn)
// newTree is now identical to existingTree
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | Buffer | Buffer containing the JSON serialized tree |
`hashFn` | [HashFunction](../modules/_src_unifiedbinarytree_.md#hashfunction) | Hash function to use for the reconstructed tree |

**Returns:** *[UnifiedBinaryTree](_src_unifiedbinarytree_.unifiedbinarytree.md)*

A new BinaryTree instance with the deserialized structure
