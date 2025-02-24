[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/UnifiedBinaryTree"](../modules/_src_unifiedbinarytree_.md) › [InternalNode](_src_unifiedbinarytree_.internalnode.md)

# Class: InternalNode

Internal node in the binary tree with left and right children.
Used to create the tree structure based on key bit patterns.

**`example`** 
```typescript
const node = new InternalNode()
node.left = new StemNode(Buffer.alloc(31, 0))
node.right = new StemNode(Buffer.alloc(31, 1))
```

## Hierarchy

* **InternalNode**

## Index

### Properties

* [left](_src_unifiedbinarytree_.internalnode.md#left)
* [nodeType](_src_unifiedbinarytree_.internalnode.md#nodetype)
* [right](_src_unifiedbinarytree_.internalnode.md#right)

## Properties

###  left

• **left**: *[BinaryTreeNode](../modules/_src_unifiedbinarytree_.md#binarytreenode) | null* = null

___

###  nodeType

• **nodeType**: *"internal"* = "internal"

___

###  right

• **right**: *[BinaryTreeNode](../modules/_src_unifiedbinarytree_.md#binarytreenode) | null* = null
