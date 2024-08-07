const test = require('tape')
const { Base } = require('../dist/Base')

test('bufferify', t => {
  t.plan(10)

  const base = new Base()
  t.deepEqual(base.bufferify(''), Buffer.alloc(0))
  t.deepEqual(base.bufferify('0x123'), Buffer.from('0123', 'hex'))
  t.deepEqual(base.bufferify('0x1234'), Buffer.from('1234', 'hex'))
  t.deepEqual(base.bufferify('123'), Buffer.from('0123', 'hex'))
  t.deepEqual(base.bufferify('1234'), Buffer.from('1234', 'hex'))
  t.deepEqual(base.bufferify(Buffer.from('123')), Buffer.from('123'))
  t.deepEqual(base.bufferify(BigInt('0x123')), Buffer.from('0123', 'hex'))
  t.deepEqual(base.bufferify(BigInt('0x1234')), Buffer.from('1234', 'hex'))
  t.deepEqual(base.bufferify(new Uint8Array([123])), Buffer.from([123]))
  t.deepEqual(base.bufferify(new Uint8Array((new Uint8Array([0, 123])).buffer, 1, 1)), Buffer.from([123]))
})

test('bufferifyFn', t => {
  t.plan(8)

  const base = new Base()
  const fn = base.bufferifyFn(value => value)
  t.deepEqual(fn('123'), Buffer.from('0123', 'hex'))
  t.deepEqual(fn('1234'), Buffer.from('1234', 'hex'))
  t.deepEqual(fn('0x123'), Buffer.from('0123', 'hex'))
  t.deepEqual(fn('0x1234'), Buffer.from('1234', 'hex'))
  t.deepEqual(fn('XYZ'), Buffer.from('XYZ'))
  t.deepEqual(fn(BigInt('0x123')), Buffer.from('0123', 'hex'))
  t.deepEqual(fn(BigInt('0x1234')), Buffer.from('1234', 'hex'))
  t.deepEqual(fn(new Uint8Array([123])), Buffer.from([123]))
})

test('bigNumberify', t => {
  t.plan(8)

  const base = new Base()
  t.deepEqual(base.bigNumberify(123), BigInt(123))
  t.deepEqual(base.bigNumberify(''), BigInt(0))
  t.deepEqual(base.bigNumberify(0), BigInt(0))
  t.deepEqual(base.bigNumberify('0x'), BigInt(0))
  t.deepEqual(base.bigNumberify('0x0'), BigInt(0))
  t.deepEqual(base.bigNumberify('0x123'), BigInt('0x123'))
  t.deepEqual(base.bigNumberify(BigInt(123)), BigInt(123))
  t.deepEqual(base.bigNumberify(new Uint8Array([123])), BigInt(123))
})

test('bufferToHex', t => {
  t.plan(5)

  const base = new Base()
  t.deepEqual(base.bufferToHex(Buffer.alloc(0)), '0x')
  t.deepEqual(base.bufferToHex(Buffer.from('')), '0x')
  t.deepEqual(base.bufferToHex(Buffer.from('x')), '0x78')
  t.deepEqual(base.bufferToHex(''), '0x')
  t.deepEqual(base.bufferToHex(0), '0x')
})

test('binarySearch', t => {
  t.plan(3)

  const base = new Base()
  const compareFunction = (a, b) => {
    if (a === b) return 0
    else if (a < b) return -1
    else return 1
  }
  t.equal(base.binarySearch([2, 2, 3, 3, 3, 4, 4, 4, 4], 3, compareFunction), 2)
  t.equal(base.binarySearch([3, 3, 3, 3, 3, 4, 4, 4, 4], 3, compareFunction), 0)
  t.equal(base.binarySearch([2, 2, 3, 3, 3, 4, 4, 4, 4], 1, compareFunction), -1)
})

test('bufferArrayIncludes', t => {
  t.plan(4)

  const base = new Base()
  t.equal(base.bufferArrayIncludes([Buffer.from('123'), Buffer.from('456')], Buffer.from('123')), true)
  t.equal(base.bufferArrayIncludes([Buffer.from('123'), Buffer.from('456')], Buffer.from('789')), false)
  t.equal(base.bufferArrayIncludes([Buffer.from('123'), Buffer.from('456')], null), false)
  t.equal(base.bufferArrayIncludes([Buffer.from('123'), Buffer.alloc(0)], null), true)
})
