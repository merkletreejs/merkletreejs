/* eslint camelcase: 0 */

const test = require('tape')
const keccak256 = require('keccak256')
const { MerkleRadixTree } = require('../')
const crypto = require('crypto')

const sha256 = (data) => crypto.createHash('sha256').update(data).digest()

test('radix tree - empty', t => {
  t.plan(7)

  const tree = new MerkleRadixTree(keccak256)
  t.equal(tree.lookup(''), null)

  const proof = tree.generateProof('')
  console.log(proof)
  t.equal(proof.length, 1)
  t.equal(proof[0].key, '')
  t.equal(proof[0].siblings.length, 0)
  t.deepEqual(proof[0].hash, keccak256(keccak256(Buffer.alloc(0))))
  t.deepEqual(tree.root.hash, keccak256(keccak256(Buffer.alloc(0))))
  t.equal(tree.verifyProof(proof, tree.root.hash), true)
})

const hashFn = sha256

// Helper function to compute hash
function computeHash (key, value) {
  let hash = hashFn('')
  hash = Buffer.concat([hash, Buffer.from(key), value ? Buffer.from(value) : Buffer.alloc(0)])
  return hashFn(hash)
}

test('radix tree - simple test', t => {
  t.plan(12)

  const tree = new MerkleRadixTree(hashFn)
  tree.insert('test', 'value 1')
  tree.insert('team', 'value 2')
  tree.insert('toast', 'value 3')

  t.equal(tree.lookup('test'), 'value 1')
  t.equal(tree.lookup('team'), 'value 2')
  t.equal(tree.lookup('toast'), 'value 3')
  t.equal(tree.lookup('toaster'), null)

  const proof = tree.generateProof('test')
  t.equal(proof[0].siblings.length, 2)
  t.equal(proof[0].siblings[0].key, 'team')
  t.equal(proof[0].siblings[1].key, 'toast')
  t.equal(proof[1].key, 'test')
  t.equal(proof[1].siblings.length, 0)

  // console.log(proof)
  // console.log(JSON.stringify(proof, null, 2))

  // Compute hashes for individual nodes
  const hashTest = computeHash('test', 'value 1')
  const hashTeam = computeHash('team', 'value 2')
  const hashToast = computeHash('toast', 'value 3')

  // Create the initial nodes
  const nodes = {
    test: { key: 'test', hash: hashTest },
    team: { key: 'team', hash: hashTeam },
    toast: { key: 'toast', hash: hashToast }
  }

  // Manually combine nodes into the radix tree structure
  const rootNodeKey = ''
  const rootNodeChildren = ['test', 'team', 'toast']
  let rootNodeHash = hashFn(rootNodeKey)

  rootNodeChildren.forEach(childKey => {
    rootNodeHash = Buffer.concat([rootNodeHash, nodes[childKey].hash])
  })

  rootNodeHash = hashFn(rootNodeHash)

  t.deepEqual(tree.root.hash, rootNodeHash)
  t.equal(tree.verifyProof(proof, tree.root.hash), true)

  // Start with the hash of the last node in the proof
  let currentHash = proof[proof.length - 1].hash

  // Traverse the proof from leaf to root
  for (let i = proof.length - 2; i >= 0; i--) {
    const item = proof[i]
    let concatenatedHash = Buffer.concat([hashFn(''), Buffer.from(item.key), currentHash])
    for (const sibling of item.siblings) {
      concatenatedHash = Buffer.concat([concatenatedHash, sibling.hash])
    }
    currentHash = hashFn(concatenatedHash)
  }

  // console.log(currentHash.toString('hex'), tree.root.hash.toString('hex'))
  t.deepEqual(currentHash, tree.root.hash)
})
