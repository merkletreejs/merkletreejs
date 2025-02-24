const tape = require('tape')
const {
  oldStyleAddressToAddress32,
  getTreeKeyForBasicData,
  getTreeKeyForCodeChunk,
  getTreeKeyForStorageSlot,
  getTreeKeyForCodeHash,
  chunkifyCode,
  treeHash,
  UnifiedBinaryTree,
  StemNode,
  InternalNode
} = require('../dist/UnifiedBinaryTree')

const { hash: blake3, load: blake3Load } = require('blake3')
const { blake3: blake3NobleImpl } = require('@noble/hashes/blake3')
const { createBLAKE3: createBlake3HashWasm } = require('hash-wasm')

// Encapsulate hash-wasm implementation
const { hash: blake3Wasm, load: blake3LoadHashWasm } = (() => {
  let hasher = null

  return {
    load: async () => {
      hasher = await createBlake3HashWasm()
    },
    hash: (input) => {
      if (!hasher) {
        throw new Error('Hash-wasm BLAKE3 not initialized. Call load() first.')
      }
      hasher.init()
      hasher.update(input)
      return Buffer.from(hasher.digest('binary'), 'binary')
    }
  }
})()

async function runTest (hashFn, libName) {
  // ---------------------------
  // Helper: getHeight function test
  // ---------------------------
  /**
   * Recursively computes the height of the tree.
   * A StemNode has a height of 1; an InternalNode's height is 1 plus
   * the maximum height of its children.
   *
   * @param {BinaryTreeNode|null} node - The current node.
   * @returns {number} Tree height.
   */
  function getHeight (node) {
    if (!node) return 0
    if (node instanceof StemNode) return 1
    return 1 + Math.max(getHeight(node.left), getHeight(node.right))
  }

  tape(`UnifiedBinaryTree: getHeight() correctly calculates tree depth (${libName})`, (t) => {
    // Test with an empty tree.
    const treeEmpty = new UnifiedBinaryTree(hashFn)
    t.equal(getHeight(treeEmpty.root), 0, 'Empty tree has height 0')

    // Test with one inserted entry.
    const treeSingle = new UnifiedBinaryTree(hashFn)
    treeSingle.insert(Buffer.alloc(32, 0), Buffer.alloc(32, 1))
    t.equal(getHeight(treeSingle.root), 1, 'Tree with one stem has height 1')

    // Manually create a tree with an internal node:
    const stem1 = new StemNode(Buffer.alloc(31, 0x00))
    stem1.setValue(0, Buffer.alloc(32, 0x01))
    const stem2 = new StemNode(Buffer.alloc(31, 0xff))
    stem2.setValue(0, Buffer.alloc(32, 0x02))
    const internal = new InternalNode()
    internal.left = stem1
    internal.right = stem2
    // Height should be 1 (for internal) + max(1, 1) = 2.
    t.equal(getHeight(internal), 2, 'Manually constructed internal node has height 2')
    t.end()
  })

  // ---------------------------
  // Tree-Utils Tests
  // ---------------------------
  tape(`UnifiedBinaryTree: Tree utility functions handle address and key generation correctly (${libName})`, (t) => {
    try {
      const address20 = Buffer.from(
        '1234567890abcdef1234567890abcdef12345678',
        'hex'
      )
      const address32 = oldStyleAddressToAddress32(address20)
      t.ok(address32, 'Converted address32 exists')

      const basicDataKey = getTreeKeyForBasicData(address32, hashFn)
      t.ok(basicDataKey, 'Basic Data Key derived')
      t.comment('Basic Data Key: ' + basicDataKey.toString('hex'))

      const codeHashKey = getTreeKeyForCodeHash(address32, hashFn)
      t.ok(codeHashKey, 'Code Hash Key derived')
      t.comment('Code Hash Key: ' + codeHashKey.toString('hex'))

      const codeText = 'example code for EVM push instructions'
      const codeChunks = chunkifyCode(Buffer.from(codeText))
      t.ok(Array.isArray(codeChunks), 'Code chunks is an array')
      codeChunks.forEach((chunk, i) =>
        t.comment(`Chunk #${i}: ${chunk.toString('hex')}`)
      )

      const exampleHash = treeHash(Buffer.from('Hello BLAKE3!'), hashFn)
      t.ok(exampleHash, 'Example hash computed')
      t.comment('Example Hash: ' + exampleHash.toString('hex'))

      t.end()
    } catch (err) {
      t.error(err)
      t.end()
    }
  })

  // ---------------------------
  // UnifiedBinaryTree Tests
  // ---------------------------
  tape(`UnifiedBinaryTree: Single entry insertion maintains correct structure and hash (${libName})`, (t) => {
    const tree = new UnifiedBinaryTree(hashFn)
    tree.insert(Buffer.alloc(32, 0), Buffer.alloc(32, 1))
    t.equal(getHeight(tree.root), 1, 'Tree height should be 1')

    const merkle = tree.merkelize()
    t.equal(
      merkle.toString('hex'),
      '694545468677064fd833cddc8455762fe6b21c6cabe2fc172529e0f573181cd5',
      'Merkle root should match expected value'
    )
    t.end()
  })

  tape(`UnifiedBinaryTree: Two entries with different first bit create balanced structure (${libName})`, (t) => {
    const tree = new UnifiedBinaryTree(hashFn)
    tree.insert(Buffer.alloc(32, 0), Buffer.alloc(32, 1))
    tree.insert(
      Buffer.concat([Buffer.from([0x80]), Buffer.alloc(31, 0)]),
      Buffer.alloc(32, 2)
    )
    t.equal(getHeight(tree.root), 2, 'Tree height should be 2')

    const merkle = tree.merkelize()
    t.equal(
      merkle.toString('hex'),
      '85fc622076752a6fcda2c886c18058d639066a83473d9684704b5a29455ed2ed',
      'Merkle root should match expected value'
    )
    t.end()
  })

  tape(`UnifiedBinaryTree: Multiple values in single stem node are stored correctly (${libName})`, (t) => {
    const tree = new UnifiedBinaryTree(hashFn)
    tree.insert(
      Buffer.concat([Buffer.alloc(31, 0), Buffer.from([0x03])]),
      Buffer.alloc(32, 1)
    )
    tree.insert(
      Buffer.concat([Buffer.alloc(31, 0), Buffer.from([0x04])]),
      Buffer.alloc(32, 2)
    )
    tree.insert(
      Buffer.concat([Buffer.alloc(31, 0), Buffer.from([0x09])]),
      Buffer.alloc(32, 3)
    )
    tree.insert(
      Buffer.concat([Buffer.alloc(31, 0), Buffer.from([0xff])]),
      Buffer.alloc(32, 4)
    )
    t.equal(getHeight(tree.root), 1, 'Tree height should be 1')
    t.equal(
      tree.merkelize().toString('hex'),
      'aa12acb5689a2dc03e9d7ab0350449c70cdad286750dc8ba1dd092f5e100191a',
      'Merkle root for one stem, colocated values should match expected value'
    )
    t.end()
  })

  tape(`UnifiedBinaryTree: Multiple values across two stem nodes maintain correct structure (${libName})`, (t) => {
    const tree = new UnifiedBinaryTree(hashFn)
    tree.insert(
      Buffer.concat([Buffer.alloc(31, 0), Buffer.from([0x03])]),
      Buffer.alloc(32, 1)
    )
    tree.insert(
      Buffer.concat([Buffer.alloc(31, 0), Buffer.from([0x04])]),
      Buffer.alloc(32, 2)
    )
    tree.insert(
      Buffer.concat([Buffer.alloc(31, 0x80), Buffer.from([0x03])]),
      Buffer.alloc(32, 1)
    )
    tree.insert(
      Buffer.concat([Buffer.alloc(31, 0x80), Buffer.from([0x04])]),
      Buffer.alloc(32, 2)
    )
    t.equal(getHeight(tree.root), 2, 'Tree height should be 2')
    t.equal(
      tree.merkelize().toString('hex'),
      'd8cb5a1f0611c2af9413c9fa179a4a1bf0eb6debc8d9e10d439b3e32371085ad',
      'Merkle root for two stems, colocated values should match expected value'
    )
    t.end()
  })

  tape(`UnifiedBinaryTree: Keys matching first 42 bits create correct tree height (${libName})`, (t) => {
    const tree = new UnifiedBinaryTree(hashFn)
    const key1 = Buffer.concat([Buffer.alloc(5, 0), Buffer.alloc(27, 0xc0)])
    const key2 = Buffer.concat([Buffer.alloc(5, 0), Buffer.from([0xe0]), Buffer.alloc(26, 0)])
    tree.insert(key1, Buffer.alloc(32, 1))
    tree.insert(key2, Buffer.alloc(32, 2))
    t.equal(getHeight(tree.root), 44, 'Tree height should be 44')
    t.end()
  })

  tape(`UnifiedBinaryTree: Duplicate key insertion updates existing value (${libName})`, (t) => {
    const tree = new UnifiedBinaryTree(hashFn)
    const key = Buffer.alloc(32, 0x01)
    tree.insert(key, Buffer.alloc(32, 0x01))
    tree.insert(key, Buffer.alloc(32, 0x02))
    t.equal(getHeight(tree.root), 1, 'Tree height should be 1')
    t.equal(
      tree.root.values[1].toString('hex'),
      Buffer.alloc(32, 0x02).toString('hex'),
      'Value should be updated to 0x02 * 32'
    )
    t.end()
  })

  tape(`UnifiedBinaryTree: Large number of entries (256) creates balanced tree (${libName})`, (t) => {
    const tree = new UnifiedBinaryTree(hashFn)
    for (let i = 0; i < 256; i++) {
      const key = Buffer.concat([Buffer.from([i]), Buffer.alloc(31, 0)])
      tree.insert(key, Buffer.alloc(32, 0xff))
    }
    t.equal(getHeight(tree.root), 9, 'Tree height should be 9')
    t.end()
  })

  tape(`UnifiedBinaryTree: Multiple entries produce correct Merkle root hash (${libName})`, (t) => {
    const tree = new UnifiedBinaryTree(hashFn)
    const keys = [
      Buffer.alloc(32, 0),
      Buffer.concat([Buffer.from([0x80]), Buffer.alloc(31, 0)]),
      Buffer.concat([Buffer.from([0x01]), Buffer.alloc(31, 0)]),
      Buffer.concat([Buffer.from([0x81]), Buffer.alloc(31, 0)])
    ]
    function intTo32LE (i) {
      const buf = Buffer.alloc(32, 0)
      buf.writeUIntLE(i, 0, 6)
      return buf
    }
    for (let i = 0; i < keys.length; i++) {
      tree.insert(keys[i], intTo32LE(i + 1))
    }
    const got = tree.merkelize()
    const expected = 'e93c209026b8b00d76062638102ece415028bd104e1d892d5399375a323f2218'
    t.equal(
      got.toString('hex'),
      expected,
      'Merkle root should match expected value'
    )
    t.end()
  })

  // Incremental Updates Test (assumes an 'update' method exists)
  tape(`UnifiedBinaryTree: Incremental updates modify values correctly (${libName})`, (t) => {
    const tree = new UnifiedBinaryTree(hashFn)
    const key = Buffer.alloc(32, 0x0A)
    tree.insert(key, Buffer.alloc(32, 0x01))
    if (typeof tree.update === 'function') {
      tree.update(key, Buffer.alloc(32, 0x05))
      t.equal(
        tree.root.values[key[31]].toString('hex'),
        Buffer.alloc(32, 0x05).toString('hex'),
        'Value should be updated to 0x05 * 32'
      )
    } else {
      t.comment('update() method not implemented, skipping incremental update test')
    }
    t.end()
  })

  // Batch Insertion Test (assumes an 'insertBatch' method exists)
  tape(`UnifiedBinaryTree: Batch insertion handles multiple entries efficiently (${libName})`, (t) => {
    const tree = new UnifiedBinaryTree(hashFn)
    if (typeof tree.insertBatch === 'function') {
      const entries = []
      for (let i = 0; i < 50; i++) {
        const key = Buffer.concat([Buffer.from([i]), Buffer.alloc(31, 0)])
        const value = Buffer.alloc(32, i)
        entries.push({ key, value })
      }
      tree.insertBatch(entries)
      t.ok(getHeight(tree.root) > 0, 'Batch insertion completed')
    } else {
      t.comment('insertBatch() method not implemented, skipping batch insertion test')
    }
    t.end()
  })

  // Persistent Storage/Serialization Test (assumes serialize() and BinaryTree.deserialize() exist)
  tape(`UnifiedBinaryTree: Serialization/Deserialization preserves tree structure and values (${libName})`, (t) => {
    const tree = new UnifiedBinaryTree(hashFn)
    for (let i = 0; i < 20; i++) {
      const key = Buffer.concat([Buffer.from([i]), Buffer.alloc(31, 0)])
      tree.insert(key, Buffer.alloc(32, i))
    }
    if (
      typeof tree.serialize === 'function' &&
      typeof UnifiedBinaryTree.deserialize === 'function'
    ) {
      const serialized = tree.serialize()
      const newTree = UnifiedBinaryTree.deserialize(serialized, hashFn)
      t.equal(
        newTree.merkelize().toString('hex'),
        tree.merkelize().toString('hex'),
        'Deserialized tree should have the same Merkle root'
      )
    } else {
      t.comment('serialize()/deserialize() not implemented, skipping persistent storage test')
    }
    t.end()
  })

  // ---------------------------
  // Demo Test
  // ---------------------------
  tape(`UnifiedBinaryTree: Basic operations demo with key generation and hashing (${libName})`, (t) => {
    const demoTree = new UnifiedBinaryTree(hashFn)
    const demoKey = Buffer.alloc(32, 1)
    const demoValue = Buffer.alloc(32, 2)
    demoTree.insert(demoKey, demoValue)
    const demoMerkleRoot = demoTree.merkelize()
    t.comment('Merkle root: ' + demoMerkleRoot.toString('hex'))

    const demoAddress20 = Buffer.from(
      '1234567890abcdef1234567890abcdef12345678',
      'hex'
    )
    const demoAddress32 = oldStyleAddressToAddress32(demoAddress20)
    const demoBasicDataKey = getTreeKeyForBasicData(demoAddress32, hashFn)
    t.comment('basicDataKey = ' + demoBasicDataKey.toString('hex'))

    const demoCodeHashKey = getTreeKeyForCodeHash(demoAddress32, hashFn)
    t.comment('codeHashKey = ' + demoCodeHashKey.toString('hex'))

    const demoCodeChunks = chunkifyCode(
      Buffer.from('example code for EVM push instructions')
    )
    demoCodeChunks.forEach((chunk, i) => {
      t.comment(`Chunk #${i} = ${chunk.toString('hex')}`)
    })

    const demoExampleHash = treeHash(Buffer.from('Hello BLAKE3!'), hashFn)
    t.comment('Example BLAKE3 hash: ' + demoExampleHash.toString('hex'))

    t.end()
  })

  // ---------------------------
  // EIP-7864 Example Test
  // ---------------------------
  tape(`UnifiedBinaryTree: EIP-7864 example with complete account state management (${libName})`, (t) => {
    // Create a new BinaryTree.
    const tree = new UnifiedBinaryTree(hashFn)

    // Convert a 20-byte address to a 32-byte address.
    const address20 = Buffer.from('1234567890abcdef1234567890abcdef12345678', 'hex')
    const address32 = oldStyleAddressToAddress32(address20)

    // Construct the basic_data value.
    // Layout: version (1 byte) | reserved (4 bytes) | code_size (3 bytes) | nonce (8 bytes) | balance (16 bytes)
    const version = Buffer.alloc(1, 0)
    const reserved = Buffer.alloc(4, 0)
    const codeSize = Buffer.alloc(3)
    codeSize.writeUIntBE(100, 0, 3)
    const nonce = Buffer.alloc(8, 0)
    nonce.writeBigUInt64BE(BigInt(5))
    const balance = Buffer.alloc(16, 0)
    balance.writeBigUInt64BE(BigInt(10 ** 9))
    const basicDataValue = Buffer.concat([version, reserved, codeSize, nonce, balance])
    if (basicDataValue.length !== 32) {
      throw new Error('basicDataValue must be exactly 32 bytes')
    }
    const basicDataKey = getTreeKeyForBasicData(address32, hashFn)
    tree.insert(basicDataKey, basicDataValue)

    // Insert code hash.
    const codeHashKey = getTreeKeyForCodeHash(address32, hashFn)
    const codeHashValue = treeHash(Buffer.from('example code'), hashFn)
    tree.insert(codeHashKey, codeHashValue)

    // Insert the first code chunk.
    const codeChunks = chunkifyCode(Buffer.from('example code for EVM push instructions'))
    const chunk0Key = getTreeKeyForCodeChunk(address32, 0, hashFn)
    tree.insert(chunk0Key, codeChunks[0])

    // Insert storage slot 0.
    const storageKey0 = getTreeKeyForStorageSlot(address32, 0, hashFn)
    const storageValue = Buffer.alloc(32, 0)
    storageValue.writeBigUInt64BE(BigInt(999))
    tree.insert(storageKey0, storageValue)

    // Compute the Merkle root.
    const merkleRoot = tree.merkelize().toString('hex')
    t.equal(
      merkleRoot,
      // '05365b5087255d6122832dc3149f0fa5aec5b3a347891c42c1f16981414187ac', // incorrect?
      '57d021b50413e22d2202e6a4eb00351f8ef87de5c5c2780ee101f2d72af54568',
      'Merkle root should match expected value from Python example'
    )
    t.end()
  })
}

async function main () {
  // Run tests with two different hash functions.

  // Test 1: using the hash function from the 'blake3' package.
  await blake3Load()
  await runTest(blake3, 'blake3')

  // Test 2: using the hash function from '@noble/hashes/blake3'.
  await runTest(blake3NobleImpl, 'noble-blake3')

  // Test 3: using the hash function from 'hash-wasm'.
  await blake3LoadHashWasm()
  await runTest(blake3Wasm, 'hash-wasm-blake3')
}

main().catch(console.error)
