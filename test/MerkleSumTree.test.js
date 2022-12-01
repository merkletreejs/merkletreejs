const test = require('tape')
const crypto = require('crypto')
const { MerkleSumTree, Leaf } = require('../dist/MerkleSumTree')

const sha256 = (data) => crypto.createHash('sha256').update(data).digest()

test('MerkleSumTree', t => {
  t.plan(4)

  const treeSize = 2n ** 64n
  // const treeSize = 18446744073709551616n
  const leaves = [
    new Leaf(sha256, [0, 4], null),
    new Leaf(sha256, [4, 10], Buffer.from('tx1')),
    new Leaf(sha256, [10, 15], null),
    new Leaf(sha256, [15, 20], Buffer.from('tx2')),
    new Leaf(sha256, [20, 90], Buffer.from('tx4')),
    new Leaf(sha256, [90, treeSize], null)
  ]
  const tree = new MerkleSumTree(leaves, sha256)
  const root = tree.root.hashed.toString('hex')
  t.equal(root, 'b12575680dad581d8b70dcb517f8a2e0c547ffb0eedb5eb59f4db03da3fa1c6d')

  const proof = tree.getProof(3)
  t.deepEqual(proof.length, 3)

  t.true(tree.verifyProof(tree.root, leaves[3], proof))
  t.false(tree.verifyProof(tree.root, leaves[2], proof))
})
