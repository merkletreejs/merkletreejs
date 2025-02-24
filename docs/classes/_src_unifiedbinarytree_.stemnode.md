[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/UnifiedBinaryTree"](../modules/_src_unifiedbinarytree_.md) › [StemNode](_src_unifiedbinarytree_.stemnode.md)

# Class: StemNode

Leaf node in the binary tree that stores actual values.
Contains a 31-byte stem and an array of 256 possible values.

**`example`** 
```typescript
const stem = Buffer.alloc(31, 0)
const node = new StemNode(stem)
node.setValue(0, Buffer.alloc(32).fill(1)) // Set value at index 0
```

## Hierarchy

* **StemNode**

## Index

### Constructors

* [constructor](_src_unifiedbinarytree_.stemnode.md#constructor)

### Properties

* [nodeType](_src_unifiedbinarytree_.stemnode.md#nodetype)
* [stem](_src_unifiedbinarytree_.stemnode.md#stem)
* [values](_src_unifiedbinarytree_.stemnode.md#values)

### Methods

* [setValue](_src_unifiedbinarytree_.stemnode.md#setvalue)

## Constructors

###  constructor

\+ **new StemNode**(`stem`: Buffer): *[StemNode](_src_unifiedbinarytree_.stemnode.md)*

Creates a new StemNode with the given stem.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`stem` | Buffer | The 31-byte stem for this node.  |

**Returns:** *[StemNode](_src_unifiedbinarytree_.stemnode.md)*

## Properties

###  nodeType

• **nodeType**: *"stem"* = "stem"

___

###  stem

• **stem**: *Buffer*

___

###  values

• **values**: *Array‹Buffer | null›*

## Methods

###  setValue

▸ **setValue**(`index`: number, `value`: Buffer): *void*

Sets the value at the given index.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | The index to set the value at. |
`value` | Buffer | The 32-byte value to set.  |

**Returns:** *void*
