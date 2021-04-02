/* eslint camelcase: 0 */

const test = require('tape')
const { keccak } = require('ethereumjs-util')
const { MerkleMountainRange } = require('../')
const { soliditySha3 } = require('web3-utils')

test('merkle mountain range', t => {
  t.plan(6)

  const leaves = [
    '0xf6c5123c17fe0d9c8fc675504ffa8cc8f1613c185d16fc8099ffab31cc0f39b8',
    '0x6579ce25f7cc6797b1386af5acc4ff8acc9f8054b65dad5fb0c3b0a32c6c4610',
    '0x6423808868aca9b46c7ccf2d060ff079cb8cf252f87abe767ea3bdce6c933d0c',
    '0xf0f21a35fc749991e54d26c2a7e6ae3509667bc0d897ac7bcf6a462d1bbe7996',
    '0x2db0abbe3ef9894b15b7e5e25b538b68ce19812792e3245746cb16c6cfc14345',
    '0xfcd354a2e527cb6040e15b1f04aa6df4eb5cd7f250ead21809ef16a348beca6b',
    '0xe747a507a27368d45b0e9df1b6cc2cff173e3f739daff1e8bbdd7159263ba8ad',
    '0x07d438f3191418363c43a92bcf0555a8b2cf5451d6854932259ede6096c59ed4',
    '0xd49690a48a2c2a6772092af6d6eec62cc4285a88997cae9fa4835bf0835c2b4d',
    '0x50b25445c2139a3cec3c593b49273f1f47af0eb7d9d9ed37667ef5673d163bb9',
    '0x22a6e30c867f4109491e90313ebd0b1438bd8b559cbe85ee9239aa8902a67e74',
    '0x1b70b853c66181ccf5d149c263c7cf5e1123d6655bcc0f668c9957db1d98e038',
    '0x527efa47060e8eead056eb3b2b7c20821bf6e246828fdd835f3ccc16946568b1',
    '0x22a33bbf9177edebe708656bcbe42b7cf077965d2d5fe268dff8878654db06d6',
    '0x02c4f6983e8616f6b3e600b3c8b768e71755220a04173b8281440c6b8eb91cd9',
    '0x3ed1f8b63a683529477f8813c0955ae058048b9a4fd9a706454f73f86baf977f',
    '0x70153ddc9ab0028e922b6b2f9eb319a9a6f1ae37866e7f9771f2866dfbecbc1d',
    '0x4c26cfe12f5b2e8b2d992d99c9359a261d0bf50450acb10a5060231b5d41c31c',
    '0x86da6c8cc46b60f9eec99353c42e144525a202880db5c877d6d55ee0568c66e4',
    '0x1b6a474c3e33a28104dd0e75484414b9d35e93c878823bc3b4d9fb5a5109e9eb'
  ]

  const hashLeaf = (index, dataHash) => {
    const hash = soliditySha3({ t: 'uint256', v: index }, { t: 'bytes32', v: '0x' + dataHash.toString('hex') })
    return hash
  }

  const peakBagging = (size, peaks) => {
    const a = [{ t: 'uint256', v: size }, ...peaks.map(x => ({ t: 'bytes32', v: x.toString('hex') }))]
    const x = soliditySha3(...a)
    const b = [{ t: 'uint256', v: size }, { t: 'bytes32', v: x.toString('hex') }]
    const res = soliditySha3(...b)
    return res
  }

  const hashBranch = (index, left, right) => {
    const args = []
    if (index !== undefined) {
      args.push({ t: 'uint256', v: index })
    }
    if (left !== undefined) {
      args.push({ t: 'bytes32', v: '0x' + left.toString('hex') })
    }
    if (right !== undefined) {
      args.push({ t: 'bytes32', v: '0x' + right.toString('hex') })
    }
    const hash = soliditySha3(...args)
    return hash
  }

  const tree = new MerkleMountainRange(keccak, leaves, hashLeaf, peakBagging, hashBranch)
  const root = tree.getHexRoot()

  const proof = tree.getMerkleProof(2)

  t.equal(proof.root.toString('hex'), '5d6caccebed1b6720659b4a6c022b77d7ed5706ece976aaf44b7cf8e34650eb7')
  t.equal(proof.width, leaves.length)
  t.deepEqual(proof.peakBagging.map(x => x.toString('hex')), [
    '4965af1a91b3f41c5440e5fd5b529aae6fbf28c7c04a4fc151be321fabe4a784',
    '581f3f6a99cd8f276fd07845f619d1a271d763dd4ab049c7f8ac98602da58b7f'
  ])
  t.deepEqual(proof.siblings.map(x => x.toString('hex')), [
    'd3185c77a90c0b4f44e9c38468ce303924345c756d19f5ee342a1043f308d606',
    'fc5341e2e1127e54327c793c2b930ca9ca93cd4db16e234b73d04fdb11fa9df7',
    'db3261e4e8d9dcfcc6a4973172a13338a013fb455a7a10ca90bfcc49699688b1',
    '37bc386efc898c6c36b1c2e5a754dafd614398abf146904bcea607af5068605c'
  ])

  t.equal(root, '0x5d6caccebed1b6720659b4a6c022b77d7ed5706ece976aaf44b7cf8e34650eb7')

  const leaf = leaves[1]
  const index = 2
  const verified = tree.verify(proof.root, proof.width, index, leaf, proof.peakBagging, proof.siblings)
  t.equal(verified, true)
})
