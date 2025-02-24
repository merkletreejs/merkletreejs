import { Buffer } from 'buffer'
import { Base } from './Base'

// -----------------------------------------------------------------------------
// Type Aliases
// -----------------------------------------------------------------------------
/**
 * Type aliases for fixed-length byte sequences used throughout the codebase.
 * These help maintain type safety and clarify the expected byte lengths.
 */
export type Address = Buffer // 20 bytes in practice, e.g., Ethereum address
export type Address32 = Buffer // 32 bytes in practice, e.g., padded Ethereum address
export type Bytes32 = Buffer // 32 bytes in practice, e.g., hash output

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------
/**
 * Constants used for key derivation and tree organization.
 * These define the structure and layout of the binary tree.
 */
// Leaf key types
export const BASIC_DATA_LEAF_KEY = 0 // Used for account basic data (nonce, balance, etc.)
export const CODE_HASH_LEAF_KEY = 1 // Used for contract code hash
// Storage layout offsets
export const HEADER_STORAGE_OFFSET = 64 // Start of header storage slots
export const CODE_OFFSET = 128 // Start of code chunks
export const STEM_SUBTREE_WIDTH = 256 // Width of each stem subtree (8 bits)
export const MAIN_STORAGE_OFFSET = 256 // Start of main storage slots

// EVM PUSH instruction constants
export const pushOffset = 95 // Base offset for PUSH instructions
export const push1 = pushOffset + 1 // PUSH1 opcode (0x60)
export const push32 = pushOffset + 32 // PUSH32 opcode (0x7F)

/** Function type for hash operations */
export type HashFunction = (data: any) => any

// -----------------------------------------------------------------------------
// Utility Functions for Key Derivation and Code Chunkification
// -----------------------------------------------------------------------------

/**
 * Converts a 20-byte Ethereum address to a 32-byte address by left-padding with zeros.
 *
 * @example
 * ```typescript
 * const addr20 = Buffer.from('1234567890123456789012345678901234567890', 'hex')
 * const addr32 = oldStyleAddressToAddress32(addr20)
 * // addr32 = 0x000000000000123456789012345678901234567890 (32 bytes)
 * ```
 */
export function oldStyleAddressToAddress32 (address: Address): Address32 {
  if (address.length !== 20) {
    throw new Error('Address must be 20 bytes.')
  }
  return Buffer.concat([Buffer.alloc(12, 0), address]) as Address32
}

/**
 * Applies a hash function to input data with proper buffering.
 *
 * @example
 * ```typescript
 * const input = Buffer.from('Hello World')
 * const hashFn = (data) => blake3.hash(data)
 * const hash = treeHash(input, hashFn)
 * // hash = 32-byte BLAKE3 hash of 'Hello World'
 * ```
 */
export function treeHash (input: Buffer, hashFn: HashFunction): Bytes32 {
  return treeHashFn(hashFn)(input) as Bytes32
}

function treeHashFn (hashFn: HashFunction) {
  return Base.bufferifyFn(hashFn)
}

/**
 * Derives a tree key from an address and indices using a hash function.
 * Used to generate unique keys for different parts of the tree structure.
 * The resulting key is composed of a 31-byte stem (derived from address and treeIndex)
 * and a 1-byte subIndex.
 *
 * @param address - A 32-byte address to derive the key from
 * @param treeIndex - Primary index used to derive different trees for the same address
 * @param subIndex - Secondary index used to derive different keys within the same tree
 * @param hashFn - Hash function to use for key derivation
 * @returns A 32-byte key that uniquely identifies this storage slot
 * @throws Error if address is not 32 bytes
 *
 * @example
 * ```typescript
 * const addr32 = oldStyleAddressToAddress32(address)
 * const treeKey = getTreeKey(addr32, 0, 1, blake3.hash)
 * // Returns a unique key for this address's tree at index 0, subIndex 1
 * ```
 */
export function getTreeKey (
  address: Address32,
  treeIndex: number,
  subIndex: number,
  hashFn: HashFunction
): Address32 {
  // Validate address length
  if (address.length !== 32) {
    throw new Error('Address must be 32 bytes.')
  }

  // Get the tree-specific hash function
  const treeHash = treeHashFn(hashFn)

  // Create a buffer to store the tree index
  const indexBuffer = Buffer.alloc(32, 0)
  indexBuffer.writeUInt32LE(treeIndex, 0)

  // Generate the stem by:
  // 1. Concatenating address and index buffer
  // 2. Hashing the result
  // 3. Taking first 31 bytes
  const stem = treeHash(Buffer.concat([address, indexBuffer]), hashFn).subarray(0, 31)

  // Combine the stem with the subIndex to create the final 32-byte key
  return Buffer.concat([stem, Buffer.from([subIndex])]) as Address32
}

/**
 * Derives a key for storing an account's basic data (nonce, balance, etc.).
 *
 * @example
 * ```typescript
 * const addr32 = oldStyleAddressToAddress32(address)
 * const basicDataKey = getTreeKeyForBasicData(addr32, hashFn)
 * tree.insert(basicDataKey, accountData)
 * ```
 */
export function getTreeKeyForBasicData (address: Address32, hashFn: HashFunction): Address32 {
  return getTreeKey(address, 0, BASIC_DATA_LEAF_KEY, hashFn)
}

/**
 * Derives a key for storing a contract's code hash.
 *
 * @example
 * ```typescript
 * const addr32 = oldStyleAddressToAddress32(contractAddress)
 * const codeHashKey = getTreeKeyForCodeHash(addr32, hashFn)
 * tree.insert(codeHashKey, codeHash)
 * ```
 */
export function getTreeKeyForCodeHash (address: Address32, hashFn: HashFunction): Address32 {
  return getTreeKey(address, 0, CODE_HASH_LEAF_KEY, hashFn)
}

/**
 * Derives a tree key for a storage slot in a contract's storage.
 * Handles two types of storage:
 * 1. Header storage (slots 0-63): Used for contract metadata and special storage
 * 2. Main storage (slots 256+): Used for regular contract storage
 *
 * The storage layout is:
 * - Header storage: slots [0, 63] mapped to positions [64, 127]
 * - Main storage: slots [256+] mapped to positions [384+]
 * This creates gaps in the tree to allow for future extensions.
 *
 * @param address - The 32-byte contract address
 * @param storageKey - The storage slot number to access
 * @param hashFn - Hash function to use for key derivation
 * @returns A 32-byte key that uniquely identifies this storage slot
 *
 * @example
 * ```typescript
 * const addr32 = oldStyleAddressToAddress32(contractAddress)
 * // Get key for a header storage slot (0-63)
 * const headerKey = getTreeKeyForStorageSlot(addr32, 5, blake3.hash)
 * // Get key for a main storage slot (256+)
 * const mainKey = getTreeKeyForStorageSlot(addr32, 300, blake3.hash)
 * ```
 */
export function getTreeKeyForStorageSlot (
  address: Address32,
  storageKey: number,
  hashFn: HashFunction
): Address32 {
  let pos: number
  // If storage key is in header range (0-63), map it to positions 64-127
  if (storageKey < CODE_OFFSET - HEADER_STORAGE_OFFSET) {
    pos = HEADER_STORAGE_OFFSET + storageKey
  } else {
    // Otherwise, map it to main storage starting at position 384
    pos = MAIN_STORAGE_OFFSET + storageKey
  }

  // Convert the position to tree coordinates:
  // - treeIndex: Which subtree to use (pos / 256)
  // - subIndex: Which leaf in the subtree (pos % 256)
  return getTreeKey(
    address,
    Math.floor(pos / STEM_SUBTREE_WIDTH),
    pos % STEM_SUBTREE_WIDTH,
    hashFn
  )
}

/**
 * Derives a key for storing a chunk of contract code.
 * Used when contract code is split into 32-byte chunks.
 *
 * @example
 * ```typescript
 * const addr32 = oldStyleAddressToAddress32(contractAddress)
 * const chunks = chunkifyCode(contractCode)
 * chunks.forEach((chunk, i) => {
 *   const key = getTreeKeyForCodeChunk(addr32, i, hashFn)
 *   tree.insert(key, chunk)
 * })
 * ```
 */
export function getTreeKeyForCodeChunk (
  address: Address32,
  chunkId: number,
  hashFn: HashFunction
): Address32 {
  const pos = CODE_OFFSET + chunkId
  return getTreeKey(
    address,
    Math.floor(pos / STEM_SUBTREE_WIDTH),
    pos % STEM_SUBTREE_WIDTH,
    hashFn
  )
}

/**
 * Splits EVM bytecode into 31-byte chunks with metadata.
 * Each chunk is prefixed with a byte indicating the number of bytes
 * that are part of PUSH data in the next chunk.
 *
 * @example
 * ```typescript
 * const code = Buffer.from('6001600201', 'hex') // PUSH1 01 PUSH1 02 ADD
 * const chunks = chunkifyCode(code)
 * // chunks[0] = [0x01, 0x60, 0x01, 0x60, 0x02, 0x01, 0x00...] (32 bytes)
 * ```
 */
export function chunkifyCode (code: Buffer): Bytes32[] {
  // If code length is not divisible by 31, pad it with zeros
  // This ensures all chunks (except last) are exactly 31 bytes
  const remainder = code.length % 31
  if (remainder !== 0) {
    code = Buffer.concat([code, Buffer.alloc(31 - remainder, 0)])
  }

  // Create array to track how many bytes of PUSH data follow each position
  // Size is code.length + 32 to handle edge cases where PUSH data crosses chunk boundaries
  const bytesToExecData = new Array<number>(code.length + 32).fill(0)

  // Iterate through the bytecode to identify PUSH operations and their data
  let pos = 0
  while (pos < code.length) {
    const opcode = code[pos]
    let pushdataBytes = 0

    // Check if opcode is a PUSH operation (0x60 to 0x7F)
    if (opcode >= push1 && opcode <= push32) {
      // Calculate number of bytes to push (PUSH1 = 1 byte, PUSH2 = 2 bytes, etc.)
      pushdataBytes = opcode - pushOffset
    }
    pos += 1 // Move past the opcode

    // For each byte of PUSH data, store how many remaining PUSH bytes follow
    // This helps identify which bytes are executable vs PUSH data when chunking
    for (let x = 0; x < pushdataBytes; x++) {
      bytesToExecData[pos + x] = pushdataBytes - x
    }
    pos += pushdataBytes // Skip over the PUSH data bytes
  }

  // Split the code into 32-byte chunks (1 prefix byte + 31 code bytes)
  const chunks: Bytes32[] = []
  for (let start = 0; start < code.length; start += 31) {
    // First byte of chunk indicates how many PUSH data bytes are at start of next chunk
    const prefix = Math.min(bytesToExecData[start], 31)

    // Create a new chunk by combining:
    // 1. Single prefix byte indicating PUSH data count
    // 2. 31 bytes of code starting at current position
    const chunk = Buffer.concat([
      Buffer.from([prefix]),
      code.slice(start, start + 31)
    ]) as Bytes32
    chunks.push(chunk)
  }
  return chunks
}

// -----------------------------------------------------------------------------
// Binary Tree Implementation
// -----------------------------------------------------------------------------

/**
 * Node types in the binary tree.
 * - StemNode: Leaf node containing up to 256 values
 * - InternalNode: Internal node with left and right children
 */
export type BinaryTreeNode = StemNode | InternalNode

/**
 * Leaf node in the binary tree that stores actual values.
 * Contains a 31-byte stem and an array of 256 possible values.
 *
 * @example
 * ```typescript
 * const stem = Buffer.alloc(31, 0)
 * const node = new StemNode(stem)
 * node.setValue(0, Buffer.alloc(32).fill(1)) // Set value at index 0
 * ```
 */
export class StemNode {
  public stem: Buffer
  public values: Array<Buffer | null>
  public nodeType: 'stem' = 'stem'

  /**
   * Creates a new StemNode with the given stem.
   *
   * @param stem - The 31-byte stem for this node.
   */
  constructor (stem: Buffer) {
    if (stem.length !== 31) {
      throw new Error('Stem must be 31 bytes.')
    }
    this.stem = stem
    this.values = new Array(256).fill(null)
  }

  /**
   * Sets the value at the given index.
   *
   * @param index - The index to set the value at.
   * @param value - The 32-byte value to set.
   */
  public setValue (index: number, value: Buffer): void {
    if (value.length !== 32) {
      throw new Error('Value must be 32 bytes.')
    }
    this.values[index] = value
  }
}

/**
 * Internal node in the binary tree with left and right children.
 * Used to create the tree structure based on key bit patterns.
 *
 * @example
 * ```typescript
 * const node = new InternalNode()
 * node.left = new StemNode(Buffer.alloc(31, 0))
 * node.right = new StemNode(Buffer.alloc(31, 1))
 * ```
 */
export class InternalNode {
  public left: BinaryTreeNode | null = null
  public right: BinaryTreeNode | null = null
  public nodeType: 'internal' = 'internal'
}

/**
 * Main binary tree implementation that stores key-value pairs.
 * Uses a configurable hash function and supports various operations.
 *
 * @example
 * ```typescript
 * const tree = new BinaryTree(blake3.hash)
 * tree.insert(key, value)
 * const root = tree.merkelize()
 * const serialized = tree.serialize()
 * ```
 */
export class UnifiedBinaryTree {
  public root: BinaryTreeNode | null = null;
  hashFn: HashFunction

  /**
   * Creates a new BinaryTree instance with the given hash function.
   *
   * @param hashFn - The hash function to use for key derivation.
   */
  constructor (hashFn: HashFunction) {
    this.hashFn = Base.bufferifyFn(hashFn)
  }

  /**
   * Inserts a key-value pair into the binary tree.
   * The key is split into two parts:
   * - stem (first 31 bytes): Determines the path in the tree
   * - subIndex (last byte): Determines the position within a leaf node
   *
   * If this is the first insertion, creates a new leaf node.
   * Otherwise, recursively traverses or builds the tree structure.
   *
   * @param key - A 32-byte key that determines where to store the value
   * @param value - A 32-byte value to store
   * @throws Error if key or value is not exactly 32 bytes
   *
   * @example
   * ```typescript
   * const tree = new BinaryTree(hashFn)
   * const key = getTreeKey(address, 0, 1, hashFn)
   * const value = Buffer.alloc(32).fill(1)
   * tree.insert(key, value)
   * ```
   */
  public insert (key: Buffer, value: Buffer): void {
    // Validate input lengths
    if (key.length !== 32) {
      throw new Error('Key must be 32 bytes.')
    }
    if (value.length !== 32) {
      throw new Error('Value must be 32 bytes.')
    }

    // Split key into stem (path) and subIndex (leaf position)
    const stem = key.slice(0, 31)
    const subIndex = key[31]

    // If tree is empty, create first leaf node
    if (this.root === null) {
      this.root = new StemNode(stem)
      this.root.setValue(subIndex, value)
      return
    }

    // Otherwise, recursively insert into existing tree
    // Starting at depth 0 (root level)
    this.root = this.insertRecursive(this.root, stem, subIndex, value, 0)
  }

  /**
   * Recursively inserts a key-value pair into the tree.
   * This method handles three cases:
   * 1. Empty node: Creates a new leaf node
   * 2. Stem node: Either updates value or splits into internal node
   * 3. Internal node: Recursively traverses left or right based on stem bits
   *
   * @param node - Current node in traversal (null if empty)
   * @param stem - The 31-byte path component of the key
   * @param subIndex - The leaf position component of the key
   * @param value - The 32-byte value to store
   * @param depth - Current depth in the tree (max 247 to prevent hash collisions)
   * @returns The new or updated node
   * @throws Error if tree depth exceeds 247 levels
   */
  private insertRecursive (
    node: BinaryTreeNode | null,
    stem: Buffer,
    subIndex: number,
    value: Buffer,
    depth: number
  ): BinaryTreeNode {
    // Prevent deep recursion that could lead to hash collisions
    if (depth >= 248) {
      throw new Error('Depth must be less than 248.')
    }

    // Case 1: Empty node - create new leaf
    if (node === null) {
      const newNode = new StemNode(stem)
      newNode.setValue(subIndex, value)
      return newNode
    }

    // Convert stem to bit array for path decisions
    const stemBits = this.bytesToBits(stem)

    // Case 2: Reached a leaf node (StemNode)
    if (node instanceof StemNode) {
      // If stems match, just update the value
      if (node.stem.equals(stem)) {
        node.setValue(subIndex, value)
        return node
      }

      // If stems differ, need to split this leaf node
      const existingStemBits = this.bytesToBits(node.stem)
      return this.splitLeaf(node, stemBits, existingStemBits, subIndex, value, depth)
    } else { // Case 3: Internal node - traverse left or right
      // Use current depth's bit to decide path (0 = left, 1 = right)
      const bit = stemBits[depth]
      if (bit === 0) {
        node.left = this.insertRecursive(node.left, stem, subIndex, value, depth + 1)
      } else {
        node.right = this.insertRecursive(node.right, stem, subIndex, value, depth + 1)
      }
      return node
    }
  }

  /**
   * Converts a byte array to an array of individual bits.
   * Each byte is converted to 8 bits, maintaining the most-significant-bit first order.
   * Used for making path decisions in the binary tree based on stem bytes.
   *
   * @param data - Buffer containing bytes to convert
   * @returns Array of bits (0s and 1s) in MSB-first order
   *
   * @example
   * ```typescript
   * const bytes = Buffer.from([0xA5]) // Binary: 10100101
   * const bits = bytesToBits(bytes)
   * // bits = [1,0,1,0,0,1,0,1]
   * //         ^ MSB        LSB ^
   * ```
   *
   * Process for each byte:
   * 1. Right shift by (7-i) positions to get desired bit to LSB
   * 2. AND with 1 to isolate that bit
   * 3. Push result (0 or 1) to output array
   */
  private bytesToBits (data: Buffer): number[] {
    const bits: number[] = []

    // Process each byte in the input buffer
    for (const byte of data) {
      // Extract each bit from the byte, MSB first
      for (let i = 0; i < 8; i++) {
        // Right shift to position + mask to get bit value
        // i=0: shift 7 (10100101 -> 00000001)
        // i=1: shift 6 (10100101 -> 00000000)
        // i=2: shift 5 (10100101 -> 00000001)
        // etc.
        bits.push((byte >> (7 - i)) & 1)
      }
    }
    return bits
  }

  /**
   * Converts an array of bits back into a Buffer of bytes.
   * This is the inverse operation of bytesToBits.
   * Processes bits in groups of 8, maintaining MSB-first order.
   *
   * @param bits - Array of 0s and 1s to convert to bytes
   * @returns Buffer containing the reconstructed bytes
   * @throws Error if the number of bits is not divisible by 8
   *
   * @example
   * ```typescript
   * const bits = [1,0,1,0,0,1,0,1] // Represents binary 10100101
   * const bytes = bitsToBytes(bits)
   * // bytes = Buffer.from([0xA5])
   * ```
   *
   * Process for each byte:
   * 1. Take 8 bits at a time
   * 2. For each bit:
   *    - Shift it left to its correct position (7-j positions)
   *    - OR it with the accumulating byte value
   * 3. Add completed byte to array
   */
  private bitsToBytes (bits: number[]): Buffer {
    // Ensure we have complete bytes (groups of 8 bits)
    if (bits.length % 8 !== 0) {
      throw new Error('Number of bits must be a multiple of 8.')
    }

    const bytes: number[] = []
    // Process bits in groups of 8
    for (let i = 0; i < bits.length; i += 8) {
      let byte = 0
      // Build each byte bit by bit
      for (let j = 0; j < 8; j++) {
        // Left shift each bit to its position and OR with current byte
        // j=0: bit goes to position 7 (MSB)
        // j=1: bit goes to position 6
        // j=2: bit goes to position 5
        // etc.
        byte |= bits[i + j] << (7 - j)
      }
      bytes.push(byte)
    }
    return Buffer.from(bytes)
  }

  /**
   * Applies the hash function to the given data with special handling for null values.
   * Used primarily for Merkle tree calculations and node hashing.
   *
   * Special cases:
   * - null input -> returns 32-byte zero buffer
   * - 64-byte zero buffer -> returns 32-byte zero buffer
   * This handling ensures consistent treatment of empty/uninitialized nodes.
   *
   * @param data - Buffer to hash, must be either 32 or 64 bytes, or null
   * @returns A 32-byte hash of the data, or zero32 for empty cases
   * @throws Error if data length is not 32 or 64 bytes
   *
   * @example
   * ```typescript
   * // Regular hashing
   * const hash1 = hashData(nodeBuffer) // Returns hash of data
   *
   * // Empty cases - all return 32 zeros
   * const hash2 = hashData(null)
   * const hash3 = hashData(Buffer.alloc(64, 0))
   * ```
   */
  private hashData (data: Buffer | null): Buffer {
    // Pre-allocate zero buffers for comparison and return values
    const zero64 = Buffer.alloc(64, 0) // Used to detect empty 64-byte input
    const zero32 = Buffer.alloc(32, 0) // Returned for empty/zero cases

    // Return zero32 for either null input or a 64-byte zero buffer
    // This treats empty nodes consistently in the tree
    if (data === null || data.equals(zero64)) {
      return zero32
    }

    // Validate input size - must be either a single node (32 bytes)
    // or a pair of nodes being combined (64 bytes)
    if (data.length !== 32 && data.length !== 64) {
      throw new Error('Data must be 32 or 64 bytes.')
    }

    // Apply the configured hash function to valid data
    return this.hashFn(data)
  }

  /**
   * Computes the Merkle root of the entire tree.
   * The Merkle root is a single 32-byte hash that uniquely represents the entire tree state.
   *
   * The computation follows these rules:
   * 1. For Internal nodes: hash(leftChild || rightChild)
   * 2. For Stem nodes: hash(stem || 0x00 || merkleOfValues)
   * 3. For empty nodes: return 32 bytes of zeros
   *
   * @returns A 32-byte Buffer containing the Merkle root
   *
   * @example
   * ```typescript
   * const tree = new BinaryTree(hashFn)
   * tree.insert(key1, value1)
   * tree.insert(key2, value2)
   * const root = tree.merkelize()
   * // root now contains a 32-byte hash representing the entire tree
   * ```
   */
  public merkelize (): Buffer {
    /**
     * Recursive helper function to compute the Merkle root of a subtree
     * @param node - Root of the subtree to compute hash for
     * @returns 32-byte Buffer containing the node's Merkle hash
     */
    const computeMerkle = (node: BinaryTreeNode | null): Buffer => {
      const zero32 = Buffer.alloc(32, 0)

      // Base case: empty node returns zero hash
      if (node === null) {
        return zero32
      }

      // Case 1: Internal node
      if (node instanceof InternalNode) {
        // Recursively compute hashes of left and right children
        const leftHash = computeMerkle(node.left)
        const rightHash = computeMerkle(node.right)
        // Combine and hash the children
        return this.hashData(Buffer.concat([leftHash, rightHash]))
      }

      // Case 2: Stem node (leaf)
      // First compute Merkle tree of the 256 values in this node
      const level: Buffer[] = node.values.map(val => this.hashData(val))

      // Build a balanced binary tree from the value hashes
      // Each iteration combines pairs of hashes until only root remains
      while (level.length > 1) {
        const newLevel: Buffer[] = []
        for (let i = 0; i < level.length; i += 2) {
          // Combine each pair of hashes
          newLevel.push(this.hashData(Buffer.concat([level[i], level[i + 1]])))
        }
        // Replace old level with new level
        level.splice(0, level.length, ...newLevel)
      }

      // Final stem node hash combines:
      // 1. The stem (31 bytes)
      // 2. A zero byte (1 byte)
      // 3. The Merkle root of values (32 bytes)
      return this.hashData(Buffer.concat([
        node.stem, // 31-byte stem
        Buffer.from([0]), // 1-byte zero
        level[0] // 32-byte value root
      ]))
    }

    // Start computation from root
    return computeMerkle(this.root)
  }

  // -------------------------------------------------------------
  // New Features
  // -------------------------------------------------------------

  /**
   * Incrementally updates the value for an existing key.
   * For our implementation, update is the same as insert.
   *
   * @param key - A 32-byte key.
   * @param value - A 32-byte value.
   */
  public update (key: Buffer, value: Buffer): void {
    // Simply re-insert; our insert() method will update an existing key.
    this.insert(key, value)
  }

  /**
   * Performs a batch insertion of key-value pairs.
   *
   * @param entries - An array of objects with 'key' and 'value' properties.
   */
  public insertBatch (entries: { key: Buffer, value: Buffer }[]): void {
    for (const { key, value } of entries) {
      this.insert(key, value)
    }
  }

  /**
   * Serializes the entire tree structure into a JSON Buffer.
   * Converts the tree into a format that can be stored or transmitted,
   * preserving the complete structure and all values.
   *
   * The serialized format for each node type is:
   * 1. Stem Node:
   *    ```json
   *    {
   *      "nodeType": "stem",
   *      "stem": "hex string of 31 bytes",
   *      "values": ["hex string or null", ...] // 256 entries
   *    }
   *    ```
   * 2. Internal Node:
   *    ```json
   *    {
   *      "nodeType": "internal",
   *      "left": <node or null>,
   *      "right": <node or null>
   *    }
   *    ```
   *
   * @returns Buffer containing the JSON string representation of the tree
   *
   * @example
   * ```typescript
   * const tree = new BinaryTree(hashFn)
   * tree.insert(key, value)
   * const serialized = tree.serialize()
   * // Save to file or transmit
   * const newTree = UnifiedBinaryTree.deserialize(serialized, hashFn)
   * ```
   */
  public serialize (): Buffer {
    /**
     * Helper function to recursively serialize each node in the tree
     * Converts Buffer data to hex strings for JSON compatibility
     *
     * @param node - The node to serialize
     * @returns JSON-compatible object representation of the node
     */
    function serializeNode (node: BinaryTreeNode | null): any {
      // Handle empty nodes
      if (!node) return null

      // Case 1: Stem (leaf) node
      if (node instanceof StemNode) {
        return {
          nodeType: 'stem',
          stem: node.stem.toString('hex'), // Convert 31-byte stem to hex
          values: node.values.map(val => // Convert 256 values to hex
            (val ? val.toString('hex') : null)) // Preserve null values
        }
      } else { // Case 2: Internal node
        return {
          nodeType: 'internal',
          left: serializeNode(node.left), // Recursively serialize left subtree
          right: serializeNode(node.right) // Recursively serialize right subtree
        }
      }
    }

    // Wrap the serialized tree in a root object and convert to Buffer
    const obj = { root: serializeNode(this.root) }
    return Buffer.from(JSON.stringify(obj), 'utf8')
  }

  /**
   * Reconstructs a BinaryTree from its serialized form.
   * This is the inverse operation of serialize().
   *
   * Expected input format:
   * ```json
   * {
   *   "root": {
   *     "nodeType": "internal"|"stem",
   *     // For stem nodes:
   *     "stem": "hex string",
   *     "values": ["hex string"|null, ...],
   *     // For internal nodes:
   *     "left": <node|null>,
   *     "right": <node|null>
   *   }
   * }
   * ```
   *
   * @param data - Buffer containing the JSON serialized tree
   * @param hashFn - Hash function to use for the reconstructed tree
   * @returns A new BinaryTree instance with the deserialized structure
   * @throws Error if JSON parsing fails or format is invalid
   *
   * @example
   * ```typescript
   * const serialized = existingTree.serialize()
   * const newTree = UnifiedBinaryTree.deserialize(serialized, hashFn)
   * // newTree is now identical to existingTree
   * ```
   */
  public static deserialize (data: Buffer, hashFn: HashFunction): UnifiedBinaryTree {
    // Parse the JSON string from the buffer
    const json = JSON.parse(data.toString('utf8'))

    /**
     * Helper function to recursively deserialize nodes
     * Converts hex strings back to Buffers and reconstructs the tree structure
     *
     * @param obj - JSON object representing a node
     * @returns Reconstructed BinaryTreeNode or null
     */
    function deserializeNode (obj: any): BinaryTreeNode | null {
      // Handle null nodes
      if (obj === null) return null

      // Case 1: Reconstruct stem (leaf) node
      if (obj.nodeType === 'stem') {
        // Convert hex stem back to Buffer
        const node = new StemNode(Buffer.from(obj.stem, 'hex'))
        // Convert hex values back to Buffers, preserving nulls
        node.values = obj.values.map((v: string | null) =>
          (v !== null ? Buffer.from(v, 'hex') : null))
        return node
      } else if (obj.nodeType === 'internal') { // Case 2: Reconstruct internal node
        const node = new InternalNode()
        // Recursively deserialize left and right subtrees
        node.left = deserializeNode(obj.left)
        node.right = deserializeNode(obj.right)
        return node
      }

      // Invalid node type
      return null
    }

    // Create new tree with provided hash function
    const tree = new UnifiedBinaryTree(hashFn)
    // Deserialize and set the root node
    tree.root = deserializeNode(json.root)
    return tree
  }

  /**
   * Splits a leaf node when inserting a new key with a different stem.
   * This method handles two cases:
   * 1. Matching bits at current depth: Continue splitting recursively
   * 2. Different bits at current depth: Create new internal node and arrange leaves
   *
   * The process ensures that keys with different stems are properly distributed
   * in the tree based on their binary representation.
   *
   * @param leaf - The existing leaf node to split
   * @param stemBits - Binary representation of the new stem
   * @param existingStemBits - Binary representation of the existing stem
   * @param subIndex - Position within leaf node for new value
   * @param value - Value to store at the new position
   * @param depth - Current depth in the tree
   * @returns A new internal node containing both the existing and new data
   *
   * Example:
   * If stems differ at bit 3:
   * - New stem:      [1,0,1,0,...]
   * - Existing stem: [1,0,1,1,...]
   *                        ^ split here
   * Creates an internal node with the leaf nodes arranged based on bit 3
   */
  private splitLeaf (
    leaf: StemNode,
    stemBits: number[],
    existingStemBits: number[],
    subIndex: number,
    value: Buffer,
    depth: number
  ): InternalNode {
    // Case 1: Bits match at current depth, need to go deeper
    if (stemBits[depth] === existingStemBits[depth]) {
      const newInternal = new InternalNode()
      const bit = stemBits[depth]

      // Continue splitting recursively in the matching direction
      if (bit === 0) {
        newInternal.left = this.splitLeaf(leaf, stemBits, existingStemBits, subIndex, value, depth + 1)
      } else {
        newInternal.right = this.splitLeaf(leaf, stemBits, existingStemBits, subIndex, value, depth + 1)
      }
      return newInternal
    } else { // Case 2: Bits differ at current depth, create split point
      const newInternal = new InternalNode()
      const bit = stemBits[depth]

      // Create new leaf node for the new stem
      const newStem = this.bitsToBytes(stemBits)
      const newNode = new StemNode(newStem)
      newNode.setValue(subIndex, value)

      // Arrange nodes based on their bits at current depth
      // bit = 0: new node goes left, existing goes right
      // bit = 1: new node goes right, existing goes left
      if (bit === 0) {
        newInternal.left = newNode
        newInternal.right = leaf
      } else {
        newInternal.right = newNode
        newInternal.left = leaf
      }
      return newInternal
    }
  }
}
