const test = require('tape')
const { IncrementalMerkleTree } = require('../')
const { buildPoseidon } = require('circomlibjs')

test('poseidon - 2 depth 2 arity', async t => {
  t.plan(18)

  const _poseidon = await buildPoseidon()
  const poseidon = (inputs) => {
    const hash = _poseidon(inputs.map(IncrementalMerkleTree.bigNumberify))
    const bn = IncrementalMerkleTree.bigNumberify(_poseidon.F.toString(hash))
    return bn
  }
  const tree = new IncrementalMerkleTree(poseidon, {
    depth: 2,
    arity: 2,
    zeroValue: BigInt(0)
  })

  t.equal(tree.getDepth(), 2)
  t.equal(tree.getArity(), 2)
  t.equal(tree.getMaxLeaves(), 4)
  t.equal(tree.getHexRoot(), '0x1069673dcdb12263df301a6ff584a7ec261a44cb9dc68df067a4774460b1f1e1')
  tree.insert(poseidon([BigInt(1)]))
  t.equal(tree.getHexRoot(), '0x19da8f56a40748020782233bc94fd32e81ba9bb9884e8848310878aa205b0497')

  t.deepEqual(tree.getLayers(),
    [
      [
        18586133768512220936620570745912940619677854269274689475585506675881198879027n,
        0n,
        0n,
        0n
      ],
      [
        5094515486147324152810396339294786824839256615363920109013032939290670981070n,
        14744269619966411208579211824598458697587494354926760081771325075741142829156n
      ],
      [
        11693983160260563097655073427752835408055631740894534147682792587184540681367n
      ]
    ]
  )

  tree.insert(poseidon([BigInt(2)]))
  t.equal(tree.getHexRoot(), '0x2c2ea920619c56f8dba3b19e5c3d76d346527e772ef6d90ef0dd323631ef1cb6')
  t.equal(tree.indexOf(poseidon([BigInt(2)])), 1)
  tree.delete(1)
  t.equal(tree.getHexRoot(), '0x19da8f56a40748020782233bc94fd32e81ba9bb9884e8848310878aa205b0497')
  tree.update(0, poseidon([BigInt(3)]))
  t.equal(tree.getHexRoot(), '0x2e94d2b74c9ea1cafeb6da975a5475e7d4c848e6cb3346484b146d5cfaec87eb')
  tree.update(1, poseidon([BigInt(2)]))
  t.deepEqual(tree.getLeaves(),
    [
      6018413527099068561047958932369318610297162528491556075919075208700178480084n,
      8645981980787649023086883978738420856660271013038108762834452721572614684349n,
      0n,
      0n
    ]
  )
  t.deepEqual(tree.getLayers(),
    [
      [
        6018413527099068561047958932369318610297162528491556075919075208700178480084n,
        8645981980787649023086883978738420856660271013038108762834452721572614684349n,
        0n,
        0n
      ],
      [
        14909064445584595308539830952419236478129618691160103903001052664000042483490n,
        14744269619966411208579211824598458697587494354926760081771325075741142829156n
      ],
      [
        3510912107467918110461523845783070983430853155915191132694596979334180474120n
      ]
    ])
  tree.insert(poseidon([BigInt(3)]))
  t.deepEqual(tree.getLayers(),
    [
      [
        6018413527099068561047958932369318610297162528491556075919075208700178480084n,
        8645981980787649023086883978738420856660271013038108762834452721572614684349n,
        6018413527099068561047958932369318610297162528491556075919075208700178480084n,
        0n
      ],
      [
        14909064445584595308539830952419236478129618691160103903001052664000042483490n,
        21239441820082410876343833288590122027808783310040459823992255344659808702818n
      ],
      [
        13634681385965571274925238151540568262573782028276541919047631799812805578309n
      ]
    ])

  tree.insert(poseidon([BigInt(4)]))
  t.deepEqual(tree.getLayers(),
    [
      [
        6018413527099068561047958932369318610297162528491556075919075208700178480084n,
        8645981980787649023086883978738420856660271013038108762834452721572614684349n,
        6018413527099068561047958932369318610297162528491556075919075208700178480084n,
        9900412353875306532763997210486973311966982345069434572804920993370933366268n
      ],
      [
        14909064445584595308539830952419236478129618691160103903001052664000042483490n,
        15866811995824089293749468808478915337040145970836273016636380754543464442080n
      ],
      [
        16131156821127350901643174230980638228438939582106721266118265564186720968083n
      ]
    ])
  t.equal(tree.getRoot(), 16131156821127350901643174230980638228438939582106721266118265564186720968083n)
  t.equal(tree.getHexRoot(), '0x23a9e944fc7d734b6ef70b73c9ecc9ae97051b709c29f41339b039b701e99d93')
  t.deepEqual(tree.getLayersAsObject(),
    {
      '23a9e944fc7d734b6ef70b73c9ecc9ae97051b709c29f41339b039b701e99d93': {
        '20f63b3f6cf280e6a4a488a825d7fdc948ee0a02a2714a532f6d0e747bbfbf22': {
          d4e4d24b890fe6799be4cf57ad13078ec0fbaa9fe91423ba8bbd0c2d7043bd: null,
          '131d73cf6b30079aca0dff6a561cd0ee50b540879abe379a25a06b24bde2bebd': null
        },
        '23144c1e7794f62515c2ccbaee3076d2e40b673fcba5da8a6457387e054068e0': {
          d4e4d24b890fe6799be4cf57ad13078ec0fbaa9fe91423ba8bbd0c2d7043bd: null,
          '15e36f4ff92e2211fa8ed9f7af707f6c8c0f1442252a85150d2b8d2038890dfc': null
        }
      }
    }
  )
  t.equal(tree.toString(),
`└─ 23a9e944fc7d734b6ef70b73c9ecc9ae97051b709c29f41339b039b701e99d93
   ├─ 20f63b3f6cf280e6a4a488a825d7fdc948ee0a02a2714a532f6d0e747bbfbf22
   │  ├─ d4e4d24b890fe6799be4cf57ad13078ec0fbaa9fe91423ba8bbd0c2d7043bd
   │  └─ 131d73cf6b30079aca0dff6a561cd0ee50b540879abe379a25a06b24bde2bebd
   └─ 23144c1e7794f62515c2ccbaee3076d2e40b673fcba5da8a6457387e054068e0
      ├─ d4e4d24b890fe6799be4cf57ad13078ec0fbaa9fe91423ba8bbd0c2d7043bd
      └─ 15e36f4ff92e2211fa8ed9f7af707f6c8c0f1442252a85150d2b8d2038890dfc
`)
})

test('poseidon - 2 depth 3 arity', async t => {
  t.plan(3)

  const _poseidon = await buildPoseidon()
  const poseidon = (inputs) => {
    const hash = _poseidon(inputs.map(IncrementalMerkleTree.bigNumberify))
    const bn = IncrementalMerkleTree.bigNumberify(_poseidon.F.toString(hash))
    return bn
  }
  const tree = new IncrementalMerkleTree(poseidon, {
    depth: 2,
    arity: 3,
    zeroValue: BigInt(0)
  })

  t.equal(tree.getDepth(), 2)
  t.equal(tree.getArity(), 3)
  tree.insert(poseidon([BigInt(1)]))
  tree.insert(poseidon([BigInt(2)]))
  tree.insert(poseidon([BigInt(3)]))
  tree.insert(poseidon([BigInt(4)]))
  tree.insert(poseidon([BigInt(5)]))
  tree.insert(poseidon([BigInt(6)]))
  tree.insert(poseidon([BigInt(7)]))
  tree.insert(poseidon([BigInt(8)]))
  t.equal(tree.getHexRoot(), '0xe38e8da4dd7c981fb9e47ca06a88447d3111a3796e2ed8ecc0c80c341b945a')
})

test('poseidon - proof', async t => {
  t.plan(4)

  const _poseidon = await buildPoseidon()
  const poseidon = (inputs) => {
    const hash = _poseidon(inputs.map(IncrementalMerkleTree.bigNumberify))
    const bn = IncrementalMerkleTree.bigNumberify(_poseidon.F.toString(hash))
    return bn
  }
  const tree = new IncrementalMerkleTree(poseidon, {
    depth: 2,
    arity: 2,
    zeroValue: BigInt(0)
  })

  t.equal(tree.getDepth(), 2)
  t.equal(tree.getArity(), 2)
  tree.insert(poseidon([BigInt(1)]))
  tree.insert(poseidon([BigInt(2)]))
  tree.insert(poseidon([BigInt(3)]))
  tree.insert(poseidon([BigInt(4)]))
  const proof = tree.getProof(2)
  t.deepEqual(proof,
    {
      root: 4924824719679653695544344112002466960362482050425504983922056625160325123496n,
      leaf: 6018413527099068561047958932369318610297162528491556075919075208700178480084n,
      pathIndices: [0, 1],
      siblings: [
        [
          9900412353875306532763997210486973311966982345069434572804920993370933366268n
        ],
        [
          10058687713083746196667355667918512760470030038024584531967182749893253193558n
        ]
      ]
    }
  )
  t.true(tree.verify(proof))
})
