/* eslint camelcase: 0 */

const test = require('tape')
const keccak256 = require('keccak256')
const { MerkleRadixTree } = require('../')
const crypto = require('crypto')

/**
 * Helper function to create SHA-256 hashes
 * @param {Buffer|string} data - Data to hash
 * @returns {Buffer} 32-byte SHA-256 hash
 */
const sha256 = (data) => crypto.createHash('sha256').update(data).digest()

/**
 * Test: Empty Radix Tree Properties
 * Verifies the behavior of an empty Merkle Radix Tree:
 * 1. Lookup on empty key returns null
 * 2. Proof generation for empty key
 * 3. Root hash calculation for empty tree
 * 4. Proof verification for empty tree
 */
test('radix tree - empty', t => {
  t.plan(7)

  const tree = new MerkleRadixTree(keccak256)
  t.equal(tree.lookup(''), null, 'Empty key lookup should return null')

  const proof = tree.generateProof('')
  console.log(proof)
  t.equal(proof.length, 1, 'Empty tree proof should have one node')
  t.equal(proof[0].key, '', 'Root node should have empty key')
  t.equal(proof[0].siblings.length, 0, 'Root node should have no siblings')
  t.deepEqual(proof[0].hash, keccak256(keccak256(Buffer.alloc(0))), 'Empty tree hash should match expected value')
  t.deepEqual(tree.root.hash, keccak256(keccak256(Buffer.alloc(0))), 'Root hash should match empty tree hash')
  t.equal(tree.verifyProof(proof, tree.root.hash), true, 'Empty tree proof should verify')
})

const hashFn = sha256

/**
 * Helper function to compute node hashes in the Merkle Radix Tree
 * Hash computation follows the format: H(H('') || key || value)
 * where H is the hash function and || denotes concatenation
 *
 * @param {string} key - Node key
 * @param {string|null} value - Node value, if any
 * @returns {Buffer} Computed hash for the node
 */
function computeHash (key, value) {
  let hash = hashFn('')
  hash = Buffer.concat([hash, Buffer.from(key), value ? Buffer.from(value) : Buffer.alloc(0)])
  return hashFn(hash)
}

/**
 * Test: Basic Radix Tree Operations
 * Tests core functionality of the Merkle Radix Tree:
 * 1. Insertion of multiple key-value pairs
 * 2. Lookup of existing and non-existing keys
 * 3. Proof generation for a specific key
 * 4. Manual hash computation and verification
 * 5. Proof verification against root hash
 *
 * Tree structure tested:
 * root
 * ├── test -> "value 1"
 * ├── team -> "value 2"
 * └── toast -> "value 3"
 */
test('radix tree - simple test', t => {
  t.plan(12)

  // Create and populate the tree
  const tree = new MerkleRadixTree(hashFn)
  tree.insert('test', 'value 1')
  tree.insert('team', 'value 2')
  tree.insert('toast', 'value 3')

  // Test 1: Verify lookups work correctly
  t.equal(tree.lookup('test'), 'value 1', 'Should find value for key "test"')
  t.equal(tree.lookup('team'), 'value 2', 'Should find value for key "team"')
  t.equal(tree.lookup('toast'), 'value 3', 'Should find value for key "toast"')
  t.equal(tree.lookup('toaster'), null, 'Should return null for non-existent key')

  // Test 2: Generate and verify proof structure
  const proof = tree.generateProof('test')
  t.equal(proof[0].siblings.length, 2, 'Root should have two siblings')
  t.equal(proof[0].siblings[0].key, 'team', 'First sibling should be "team"')
  t.equal(proof[0].siblings[1].key, 'toast', 'Second sibling should be "toast"')
  t.equal(proof[1].key, 'test', 'Target node should be "test"')
  t.equal(proof[1].siblings.length, 0, 'Target node should have no siblings')

  // Test 3: Manual hash computation to verify tree structure
  const hashTest = computeHash('test', 'value 1')
  const hashTeam = computeHash('team', 'value 2')
  const hashToast = computeHash('toast', 'value 3')

  // Create node objects for manual tree construction
  const nodes = {
    test: { key: 'test', hash: hashTest },
    team: { key: 'team', hash: hashTeam },
    toast: { key: 'toast', hash: hashToast }
  }

  // Manually compute root hash by combining all node hashes
  const rootNodeKey = ''
  const rootNodeChildren = ['test', 'team', 'toast']
  let rootNodeHash = hashFn(rootNodeKey)

  rootNodeChildren.forEach(childKey => {
    rootNodeHash = Buffer.concat([rootNodeHash, nodes[childKey].hash])
  })
  rootNodeHash = hashFn(rootNodeHash)

  // Test 4: Verify computed root hash matches tree's root hash
  t.deepEqual(tree.root.hash, rootNodeHash, 'Manually computed root hash should match tree root hash')
  t.equal(tree.verifyProof(proof, tree.root.hash), true, 'Proof should verify against root hash')

  // Test 5: Manual proof verification by reconstructing hashes
  let currentHash = proof[proof.length - 1].hash

  // Traverse proof from leaf to root, combining hashes
  for (let i = proof.length - 2; i >= 0; i--) {
    const item = proof[i]
    let concatenatedHash = Buffer.concat([hashFn(''), Buffer.from(item.key), currentHash])
    for (const sibling of item.siblings) {
      concatenatedHash = Buffer.concat([concatenatedHash, sibling.hash])
    }
    currentHash = hashFn(concatenatedHash)
  }

  // Verify reconstructed hash matches root hash
  t.deepEqual(currentHash, tree.root.hash, 'Reconstructed hash from proof should match root hash')
})
