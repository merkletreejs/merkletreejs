[merkletreejs](../README.md) › [Globals](../globals.md) › ["src/MerkleTree"](../modules/_src_merkletree_.md) › [MerkleTree](_src_merkletree_.merkletree.md)

# Class: MerkleTree

Class reprensenting a Merkle Tree

**`namespace`** MerkleTree

## Hierarchy

* [Base](_src_base_.base.md)

  ↳ **MerkleTree**

## Index

### Constructors

* [constructor](_src_merkletree_.merkletree.md#constructor)

### Methods

* [_bufferIndexOf](_src_merkletree_.merkletree.md#protected-_bufferindexof)
* [_isHexString](_src_merkletree_.merkletree.md#protected-_ishexstring)
* [_log2](_src_merkletree_.merkletree.md#protected-_log2)
* [_toTreeString](_src_merkletree_.merkletree.md#protected-_totreestring)
* [_zip](_src_merkletree_.merkletree.md#protected-_zip)
* [addLeaf](_src_merkletree_.merkletree.md#addleaf)
* [addLeaves](_src_merkletree_.merkletree.md#addleaves)
* [binarySearch](_src_merkletree_.merkletree.md#binarysearch)
* [bufferToHex](_src_merkletree_.merkletree.md#buffertohex)
* [bufferify](_src_merkletree_.merkletree.md#bufferify)
* [bufferifyFn](_src_merkletree_.merkletree.md#bufferifyfn)
* [getDepth](_src_merkletree_.merkletree.md#getdepth)
* [getHexLayers](_src_merkletree_.merkletree.md#gethexlayers)
* [getHexLayersFlat](_src_merkletree_.merkletree.md#gethexlayersflat)
* [getHexLeaves](_src_merkletree_.merkletree.md#gethexleaves)
* [getHexMultiProof](_src_merkletree_.merkletree.md#gethexmultiproof)
* [getHexProof](_src_merkletree_.merkletree.md#gethexproof)
* [getHexProofs](_src_merkletree_.merkletree.md#gethexproofs)
* [getHexRoot](_src_merkletree_.merkletree.md#gethexroot)
* [getLayerCount](_src_merkletree_.merkletree.md#getlayercount)
* [getLayers](_src_merkletree_.merkletree.md#getlayers)
* [getLayersAsObject](_src_merkletree_.merkletree.md#getlayersasobject)
* [getLayersFlat](_src_merkletree_.merkletree.md#getlayersflat)
* [getLeaf](_src_merkletree_.merkletree.md#getleaf)
* [getLeafCount](_src_merkletree_.merkletree.md#getleafcount)
* [getLeafIndex](_src_merkletree_.merkletree.md#getleafindex)
* [getLeaves](_src_merkletree_.merkletree.md#getleaves)
* [getMultiProof](_src_merkletree_.merkletree.md#getmultiproof)
* [getPositionalHexProof](_src_merkletree_.merkletree.md#getpositionalhexproof)
* [getProof](_src_merkletree_.merkletree.md#getproof)
* [getProofFlags](_src_merkletree_.merkletree.md#getproofflags)
* [getProofIndices](_src_merkletree_.merkletree.md#getproofindices)
* [getProofs](_src_merkletree_.merkletree.md#getproofs)
* [getProofsDFS](_src_merkletree_.merkletree.md#getproofsdfs)
* [getRoot](_src_merkletree_.merkletree.md#getroot)
* [isUnevenTree](_src_merkletree_.merkletree.md#isuneventree)
* [linearSearch](_src_merkletree_.merkletree.md#linearsearch)
* [print](_src_merkletree_.merkletree.md#print)
* [resetTree](_src_merkletree_.merkletree.md#resettree)
* [toString](_src_merkletree_.merkletree.md#tostring)
* [verify](_src_merkletree_.merkletree.md#verify)
* [verifyMultiProof](_src_merkletree_.merkletree.md#verifymultiproof)
* [verifyMultiProofWithFlags](_src_merkletree_.merkletree.md#verifymultiproofwithflags)
* [binarySearch](_src_merkletree_.merkletree.md#static-binarysearch)
* [bufferToHex](_src_merkletree_.merkletree.md#static-buffertohex)
* [bufferify](_src_merkletree_.merkletree.md#static-bufferify)
* [getMultiProof](_src_merkletree_.merkletree.md#static-getmultiproof)
* [isHexString](_src_merkletree_.merkletree.md#static-ishexstring)
* [linearSearch](_src_merkletree_.merkletree.md#static-linearsearch)
* [marshalLeaves](_src_merkletree_.merkletree.md#static-marshalleaves)
* [marshalProof](_src_merkletree_.merkletree.md#static-marshalproof)
* [print](_src_merkletree_.merkletree.md#static-print)
* [unmarshalLeaves](_src_merkletree_.merkletree.md#static-unmarshalleaves)
* [unmarshalProof](_src_merkletree_.merkletree.md#static-unmarshalproof)
* [verify](_src_merkletree_.merkletree.md#static-verify)

## Constructors

###  constructor

\+ **new MerkleTree**(`leaves`: any[], `hashFn`: any, `options`: [Options](../interfaces/_src_merkletree_.options.md)): *[MerkleTree](_src_merkletree_.merkletree.md)*

**`desc`** Constructs a Merkle Tree.
All nodes and leaves are stored as Buffers.
Lonely leaf nodes are promoted to the next level up without being hashed again.

**`example`** 
```js
const MerkleTree = require('merkletreejs')
const crypto = require('crypto')

function sha256(data) {
 // returns Buffer
 return crypto.createHash('sha256').update(data).digest()
}

const leaves = ['a', 'b', 'c'].map(value => keccak(value))

const tree = new MerkleTree(leaves, sha256)
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`leaves` | any[] | - | Array of hashed leaves. Each leaf must be a Buffer. |
`hashFn` | any | SHA256 | - |
`options` | [Options](../interfaces/_src_merkletree_.options.md) | {} | Additional options |

**Returns:** *[MerkleTree](_src_merkletree_.merkletree.md)*

## Methods

### `Protected` _bufferIndexOf

▸ **_bufferIndexOf**(`array`: Buffer[], `element`: Buffer, `isSorted`: boolean): *number*

*Inherited from [Base](_src_base_.base.md).[_bufferIndexOf](_src_base_.base.md#protected-_bufferindexof)*

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

### `Protected` _isHexString

▸ **_isHexString**(`value`: string): *boolean*

*Inherited from [Base](_src_base_.base.md).[_isHexString](_src_base_.base.md#protected-_ishexstring)*

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

*Inherited from [Base](_src_base_.base.md).[_log2](_src_base_.base.md#protected-_log2)*

log2

**`desc`** Returns the log2 of number.

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *number*

___

### `Protected` _toTreeString

▸ **_toTreeString**(): *string*

toTreeString

**`desc`** Returns a visual representation of the merkle tree as a string.

**`example`** 
```js
console.log(tree.toTreeString())
```

**Returns:** *string*

___

### `Protected` _zip

▸ **_zip**(`a`: any[], `b`: any[]): *any[][]*

*Inherited from [Base](_src_base_.base.md).[_zip](_src_base_.base.md#protected-_zip)*

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

###  addLeaf

▸ **addLeaf**(`leaf`: [TLeaf](../modules/_src_merkletree_.md#tleaf), `shouldHash`: boolean): *void*

addLeaf

**`desc`** Adds a leaf to the tree and re-calculates layers.

**`example`** 
```js
tree.addLeaf(newLeaf)
```

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`leaf` | [TLeaf](../modules/_src_merkletree_.md#tleaf) | - |
`shouldHash` | boolean | false |

**Returns:** *void*

___

###  addLeaves

▸ **addLeaves**(`leaves`: [TLeaf](../modules/_src_merkletree_.md#tleaf)[], `shouldHash`: boolean): *void*

addLeaves

**`desc`** Adds multiple leaves to the tree and re-calculates layers.

**`example`** 
```js
tree.addLeaves(newLeaves)
```

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`leaves` | [TLeaf](../modules/_src_merkletree_.md#tleaf)[] | - |
`shouldHash` | boolean | false |

**Returns:** *void*

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

###  getDepth

▸ **getDepth**(): *number*

getDepth

**`desc`** Returns the tree depth (number of layers)

**`example`** 
```js
const depth = tree.getDepth()
```

**Returns:** *number*

___

###  getHexLayers

▸ **getHexLayers**(): *string[]*

getHexLayers

**`desc`** Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root as hex strings.

**`example`** 
```js
const layers = tree.getHexLayers()
```

**Returns:** *string[]*

___

###  getHexLayersFlat

▸ **getHexLayersFlat**(): *string[]*

getHexLayersFlat

**`desc`** Returns single flat array of all layers of Merkle Tree, including leaves and root as hex string.

**`example`** 
```js
const layers = tree.getHexLayersFlat()
```

**Returns:** *string[]*

___

###  getHexLeaves

▸ **getHexLeaves**(): *string[]*

getHexLeaves

**`desc`** Returns array of leaves of Merkle Tree as hex strings.

**`example`** 
```js
const leaves = tree.getHexLeaves()
```

**Returns:** *string[]*

___

###  getHexMultiProof

▸ **getHexMultiProof**(`tree`: Buffer[] | string[], `indices`: number[]): *string[]*

getHexMultiProof

**`desc`** Returns the multiproof for given tree indices as hex strings.

**`example`** 
```js
const indices = [2, 5, 6]
const proof = tree.getHexMultiProof(indices)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tree` | Buffer[] &#124; string[] | - |
`indices` | number[] | Tree indices. |

**Returns:** *string[]*

- Multiproofs as hex strings.

___

###  getHexProof

▸ **getHexProof**(`leaf`: Buffer | string, `index?`: number): *string[]*

getHexProof

**`desc`** Returns the proof for a target leaf as hex strings.

**`example`** 
```js
const proof = tree.getHexProof(leaves[2])
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`leaf` | Buffer &#124; string | Target leaf |
`index?` | number | - |

**Returns:** *string[]*

- Proof array as hex strings.

___

###  getHexProofs

▸ **getHexProofs**(): *string[]*

getHexProofs

**`desc`** Returns the proofs for all leaves as hex strings.

**`example`** 
```js
const proofs = tree.getHexProofs()
```

**Returns:** *string[]*

- Proofs array as hex strings.

___

###  getHexRoot

▸ **getHexRoot**(): *string*

getHexRoot

**`desc`** Returns the Merkle root hash as a hex string.

**`example`** 
```js
const root = tree.getHexRoot()
```

**Returns:** *string*

___

###  getLayerCount

▸ **getLayerCount**(): *number*

getLayerCount

**`desc`** Returns the total number of layers.

**`example`** 
```js
const count = tree.getLayerCount()
```

**Returns:** *number*

___

###  getLayers

▸ **getLayers**(): *Buffer[]*

getLayers

**`desc`** Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root.

**`example`** 
```js
const layers = tree.getLayers()
```

**Returns:** *Buffer[]*

___

###  getLayersAsObject

▸ **getLayersAsObject**(): *any*

getLayersAsObject

**`desc`** Returns the layers as nested objects instead of an array.

**`example`** 
```js
const layersObj = tree.getLayersAsObject()
```

**Returns:** *any*

___

###  getLayersFlat

▸ **getLayersFlat**(): *Buffer[]*

getLayersFlat

**`desc`** Returns single flat array of all layers of Merkle Tree, including leaves and root.

**`example`** 
```js
const layers = tree.getLayersFlat()
```

**Returns:** *Buffer[]*

___

###  getLeaf

▸ **getLeaf**(`index`: number): *Buffer*

getLeaf

**`desc`** Returns the leaf at the given index.

**`example`** 
```js
const leaf = tree.getLeaf(1)
```

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *Buffer*

___

###  getLeafCount

▸ **getLeafCount**(): *number*

getLeafCount

**`desc`** Returns the total number of leaves.

**`example`** 
```js
const count = tree.getLeafCount()
```

**Returns:** *number*

___

###  getLeafIndex

▸ **getLeafIndex**(`target`: [TLeaf](../modules/_src_merkletree_.md#tleaf)): *number*

getLeafIndex

**`desc`** Returns the index of the given leaf, or -1 if the leaf is not found.

**`example`** 
```js
const leaf = Buffer.from('abc')
const index = tree.getLeafIndex(leaf)
```

**Parameters:**

Name | Type |
------ | ------ |
`target` | [TLeaf](../modules/_src_merkletree_.md#tleaf) |

**Returns:** *number*

___

###  getLeaves

▸ **getLeaves**(`values?`: any[]): *Buffer[]*

getLeaves

**`desc`** Returns array of leaves of Merkle Tree.

**`example`** 
```js
const leaves = tree.getLeaves()
```

**Parameters:**

Name | Type |
------ | ------ |
`values?` | any[] |

**Returns:** *Buffer[]*

___

###  getMultiProof

▸ **getMultiProof**(`tree?`: any[], `indices?`: any[]): *Buffer[]*

getMultiProof

**`desc`** Returns the multiproof for given tree indices.

**`example`** 
```js
const indices = [2, 5, 6]
const proof = tree.getMultiProof(indices)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tree?` | any[] | - |
`indices?` | any[] | Tree indices. |

**Returns:** *Buffer[]*

- Multiproofs

___

###  getPositionalHexProof

▸ **getPositionalHexProof**(`leaf`: Buffer | string, `index?`: number): *(string | number)[][]*

getPositionalHexProof

**`desc`** Returns the proof for a target leaf as hex strings and the position in binary (left == 0).

**`example`** 
```js
const proof = tree.getPositionalHexProof(leaves[2])
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`leaf` | Buffer &#124; string | Target leaf |
`index?` | number | - |

**Returns:** *(string | number)[][]*

- Proof array as hex strings. position at index 0

___

###  getProof

▸ **getProof**(`leaf`: Buffer | string, `index?`: number): *object[]*

getProof

**`desc`** Returns the proof for a target leaf.

**`example`** 
```js
const proof = tree.getProof(leaves[2])
```

**`example`** 
```js
const leaves = ['a', 'b', 'a'].map(value => keccak(value))
const tree = new MerkleTree(leaves, keccak)
const proof = tree.getProof(leaves[2], 2)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`leaf` | Buffer &#124; string | Target leaf |
`index?` | number | - |

**Returns:** *object[]*

- Array of objects containing a position property of type string
with values of 'left' or 'right' and a data property of type Buffer.

___

###  getProofFlags

▸ **getProofFlags**(`leaves`: any[], `proofs`: Buffer[] | string[]): *boolean[]*

getProofFlags

**`desc`** Returns list of booleans where proofs should be used instead of hashing.
Proof flags are used in the Solidity multiproof verifiers.

**`example`** 
```js
const indices = [2, 5, 6]
const proof = tree.getMultiProof(indices)
const proofFlags = tree.getProofFlags(leaves, proof)
```

**Parameters:**

Name | Type |
------ | ------ |
`leaves` | any[] |
`proofs` | Buffer[] &#124; string[] |

**Returns:** *boolean[]*

- Boolean flags

___

###  getProofIndices

▸ **getProofIndices**(`treeIndices`: number[], `depth`: number): *number[]*

getProofIndices

**`desc`** Returns the proof indices for given tree indices.

**`example`** 
```js
const proofIndices = tree.getProofIndices([2,5,6], 4)
console.log(proofIndices) // [ 23, 20, 19, 8, 3 ]
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`treeIndices` | number[] | Tree indices |
`depth` | number | Tree depth; number of layers. |

**Returns:** *number[]*

- Proof indices

___

###  getProofs

▸ **getProofs**(): *any[]*

getProofs

**`desc`** Returns the proofs for all leaves.

**`example`** 
```js
const proofs = tree.getProofs()
```

**`example`** 
```js
const leaves = ['a', 'b', 'a'].map(value => keccak(value))
const tree = new MerkleTree(leaves, keccak)
const proofs = tree.getProofs()
```

**Returns:** *any[]*

- Array of objects containing a position property of type string
with values of 'left' or 'right' and a data property of type Buffer for all leaves.

___

###  getProofsDFS

▸ **getProofsDFS**(`currentLayer`: any, `index`: any, `proof`: any, `proofs`: any): *any[]*

getProofsDFS

**`desc`** Get all proofs through single traverse

**`example`** 
```js
const layers = tree.getLayers()
const index = 0;
let proof = [];
let proofs = [];
const proof = tree.getProofsDFS(layers, index, proof, proofs)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`currentLayer` | any | Current layer index in traverse. |
`index` | any | Current tarvese node index in traverse. |
`proof` | any | Proof chain for single leaf. |
`proofs` | any | Proofs for all leaves |

**Returns:** *any[]*

___

###  getRoot

▸ **getRoot**(): *Buffer*

getRoot

**`desc`** Returns the Merkle root hash as a Buffer.

**`example`** 
```js
const root = tree.getRoot()
```

**Returns:** *Buffer*

___

###  isUnevenTree

▸ **isUnevenTree**(`treeLayers?`: any[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`treeLayers?` | any[] |

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

###  resetTree

▸ **resetTree**(): *void*

resetTree

**`desc`** Resets the tree by clearing the leaves and layers.

**`example`** 
```js
tree.resetTree()
```

**Returns:** *void*

___

###  toString

▸ **toString**(): *string*

toString

**`desc`** Returns a visual representation of the merkle tree as a string.

**`example`** 
```js
console.log(tree.toString())
```

**Returns:** *string*

___

###  verify

▸ **verify**(`proof`: any[], `targetNode`: Buffer | string, `root`: Buffer | string): *boolean*

verify

**`desc`** Returns true if the proof path (array of hashes) can connect the target node
to the Merkle root.

**`example`** 
```js
const root = tree.getRoot()
const proof = tree.getProof(leaves[2])
const verified = tree.verify(proof, leaves[2], root)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`proof` | any[] | Array of proof objects that should connect target node to Merkle root. |
`targetNode` | Buffer &#124; string | Target node Buffer |
`root` | Buffer &#124; string | Merkle root Buffer |

**Returns:** *boolean*

___

###  verifyMultiProof

▸ **verifyMultiProof**(`root`: Buffer | string, `proofIndices`: number[], `proofLeaves`: Buffer[] | string[], `leavesCount`: number, `proof`: Buffer[] | string[]): *boolean*

verifyMultiProof

**`desc`** Returns true if the multiproofs can connect the leaves to the Merkle root.

**`example`** 
```js
const leaves = tree.getLeaves()
const root = tree.getRoot()
const treeFlat = tree.getLayersFlat()
const leavesCount = leaves.length
const proofIndices = [2, 5, 6]
const proofLeaves = proofIndices.map(i => leaves[i])
const proof = tree.getMultiProof(treeFlat, indices)
const verified = tree.verifyMultiProof(root, proofIndices, proofLeaves, leavesCount, proof)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`root` | Buffer &#124; string | Merkle tree root |
`proofIndices` | number[] | Leave indices for proof |
`proofLeaves` | Buffer[] &#124; string[] | Leaf values at indices for proof |
`leavesCount` | number | Count of original leaves |
`proof` | Buffer[] &#124; string[] | Multiproofs given indices |

**Returns:** *boolean*

___

###  verifyMultiProofWithFlags

▸ **verifyMultiProofWithFlags**(`root`: Buffer | string, `leaves`: [TLeaf](../modules/_src_merkletree_.md#tleaf)[], `proofs`: Buffer[] | string[], `proofFlag`: boolean[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`root` | Buffer &#124; string |
`leaves` | [TLeaf](../modules/_src_merkletree_.md#tleaf)[] |
`proofs` | Buffer[] &#124; string[] |
`proofFlag` | boolean[] |

**Returns:** *boolean*

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

### `Static` getMultiProof

▸ **getMultiProof**(`tree`: Buffer[] | string[], `indices`: number[]): *Buffer[]*

getMultiProof

**`desc`** Returns the multiproof for given tree indices.

**`example`** 
```js
const flatTree = tree.getLayersFlat()
const indices = [2, 5, 6]
const proof = MerkleTree.getMultiProof(flatTree, indices)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`tree` | Buffer[] &#124; string[] | Tree as a flat array. |
`indices` | number[] | Tree indices. |

**Returns:** *Buffer[]*

- Multiproofs

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

### `Static` marshalLeaves

▸ **marshalLeaves**(`leaves`: any[]): *string*

marshalLeaves

**`desc`** Returns array of leaves of Merkle Tree as a JSON string.

**`example`** 
```js
const jsonStr = MerkleTree.marshalLeaves(leaves)
```

**Parameters:**

Name | Type |
------ | ------ |
`leaves` | any[] |

**Returns:** *string*

- List of leaves as JSON string

___

### `Static` marshalProof

▸ **marshalProof**(`proof`: any[]): *string*

marshalProof

**`desc`** Returns proof array as JSON string.

**`example`** 
```js
const jsonStr = MerkleTree.marshalProof(proof)
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`proof` | any[] | Merkle tree proof array |

**Returns:** *string*

- Proof array as JSON string.

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

___

### `Static` unmarshalLeaves

▸ **unmarshalLeaves**(`jsonStr`: string | object): *Buffer[]*

unmarshalLeaves

**`desc`** Returns array of leaves of Merkle Tree as a Buffers.

**`example`** 
```js
const leaves = MerkleTree.unmarshalLeaves(jsonStr)
```

**Parameters:**

Name | Type |
------ | ------ |
`jsonStr` | string &#124; object |

**Returns:** *Buffer[]*

- Unmarshalled list of leaves

___

### `Static` unmarshalProof

▸ **unmarshalProof**(`jsonStr`: string | object): *any[]*

unmarshalProof

**`desc`** Returns the proof for a target leaf as a list of Buffers.

**`example`** 
```js
const proof = MerkleTree.unmarshalProof(jsonStr)
```

**Parameters:**

Name | Type |
------ | ------ |
`jsonStr` | string &#124; object |

**Returns:** *any[]*

- Marshalled proof

___

### `Static` verify

▸ **verify**(`proof`: any[], `targetNode`: Buffer | string, `root`: Buffer | string, `hashFn`: any, `options`: [Options](../interfaces/_src_merkletree_.options.md)): *boolean*

verify

**`desc`** Returns true if the proof path (array of hashes) can connect the target node
to the Merkle root.

**`example`** 
```js
const verified = MerkleTree.verify(proof, leaf, root, sha256, options)
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`proof` | any[] | - | Array of proof objects that should connect target node to Merkle root. |
`targetNode` | Buffer &#124; string | - | Target node Buffer |
`root` | Buffer &#124; string | - | Merkle root Buffer |
`hashFn` | any | SHA256 | - |
`options` | [Options](../interfaces/_src_merkletree_.options.md) | {} | Additional options |

**Returns:** *boolean*
