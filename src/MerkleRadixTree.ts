import Base from './Base'

type TValue = Buffer | BigInt | string | number | null | undefined
type THashFn = (value: TValue) => Buffer

type ProofItem = {
  key: string
  hash: Buffer
  siblings: {
    key: string
    hash: Buffer
  }[]
}

class MerkleRadixNode {
  key: string
  value: TValue
  children: Map<string, MerkleRadixNode>
  hash: Buffer
  hashFn: THashFn

  constructor (key = '', value = null, hashFn: THashFn) {
    this.key = key
    this.value = value
    this.children = new Map()
    this.hashFn = hashFn
    this.hash = this.computeHash()
  }

  computeHash (): Buffer {
    let hash = this.hashFn('')
    hash = Buffer.concat([hash, Base.bufferify(this.key), this.value != null ? Base.bufferify(this.value) : Buffer.alloc(0)])
    for (const child of this.children.values()) {
      hash = Buffer.concat([hash, child.hash])
    }

    const result = this.hashFn(hash)
    return result
  }

  updateHash () {
    this.hash = this.computeHash()
  }
}

export class MerkleRadixTree extends Base {
  root: MerkleRadixNode
  hashFn: THashFn

  constructor (hashFn: THashFn) {
    super()
    this.hashFn = this.bufferifyFn(hashFn)
    this.root = new MerkleRadixNode('', null, this.hashFn)
  }

  insert (key: string, value: TValue) {
    let node = this.root
    let commonPrefixLength = 0

    while (key.length > 0) {
      const child = [...node.children.values()].find(child => key.startsWith(child.key))

      if (!child) {
        node.children.set(key, new MerkleRadixNode(key, value, this.hashFn))
        node.updateHash() // Update the hash of the current node
        return
      }

      commonPrefixLength = this.commonPrefixLength(key, child.key)

      if (commonPrefixLength === child.key.length) {
        node = child
        key = key.slice(commonPrefixLength)
      } else {
        const commonPrefix = key.slice(0, commonPrefixLength)
        const childSuffix = child.key.slice(commonPrefixLength)
        const newNode = new MerkleRadixNode(commonPrefix, null, this.hashFn)

        node.children.delete(child.key)
        node.children.set(commonPrefix, newNode)
        newNode.children.set(childSuffix, child)
        child.key = childSuffix

        if (commonPrefixLength < key.length) {
          const suffix = key.slice(commonPrefixLength)
          newNode.children.set(suffix, new MerkleRadixNode(suffix, value, this.hashFn))
        } else {
          newNode.value = value
        }

        node.updateHash()
        newNode.updateHash() // Update the hash of the new node
        return
      }
    }
    node.value = value
    node.updateHash() // Update the hash of the node where the value was inserted
  }

  lookup (key: string) {
    let node = this.root

    while (key.length > 0) {
      const child = [...node.children.values()].find(child => key.startsWith(child.key))

      if (!child) {
        return null
      }

      const commonPrefixLength = this.commonPrefixLength(key, child.key)

      if (commonPrefixLength === child.key.length) {
        node = child
        key = key.slice(commonPrefixLength)
      } else {
        return null
      }
    }

    return node.value
  }

  private commonPrefixLength (str1: string, str2: string) {
    let length = 0
    while (length < str1.length && length < str2.length && str1[length] === str2[length]) {
      length++
    }
    return length
  }

  generateProof (key: string) {
    let node = this.root
    const proof = []

    while (key.length > 0) {
      const siblings = []

      for (const child of node.children.values()) {
        if (child.key !== key) {
          siblings.push({
            key: child.key,
            hash: child.hash
          })
        }
      }

      proof.push({
        key: node.key,
        hash: node.hash,
        siblings
      })

      const child = [...node.children.values()].find(child => key.startsWith(child.key))

      if (!child) {
        return null
      }

      const commonPrefixLength = this.commonPrefixLength(key, child.key)

      if (commonPrefixLength === child.key.length) {
        node = child
        key = key.slice(commonPrefixLength)
      } else {
        return null
      }
    }

    proof.push({
      key: node.key,
      hash: node.hash,
      siblings: []
    })

    return proof
  }

  verifyProof (proof: ProofItem[], rootHash: Buffer): boolean {
    if (!proof || proof.length === 0) {
      return false
    }

    let currentHash = proof[proof.length - 1].hash

    for (let i = proof.length - 2; i >= 0; i--) {
      const item = proof[i]
      let concatenatedHash = Buffer.concat([this.hashFn(''), this.bufferify(item.key), currentHash])
      for (const sibling of item.siblings) {
        concatenatedHash = Buffer.concat([concatenatedHash, sibling.hash])
      }
      currentHash = this.hashFn(concatenatedHash)
    }

    return currentHash.equals(rootHash)
  }
}
