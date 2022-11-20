import Base from './Base'
import treeify from 'treeify'

export interface Options {
  depth?: number
  // how many inputs per node
  arity?: number
  zeroValue?: any
}

export class IncrementalMerkleTree extends Base {
  private depth?: number
  private arity?: number
  private zeroes?: any[]
  private root?: any
  private nodes?: any[]
  private hashFn: any
  private zeroValue: any

  constructor (hashFn: any, options: Options) {
    super()
    this.hashFn = hashFn
    if (options.depth) {
      this.depth = options.depth
    }
    if (options.arity) {
      this.arity = options.arity
    }

    if (this.depth < 1) {
      throw new Error('depth must be greater than 0')
    }

    if (this.arity < 1) {
      throw new Error('arity must be greater than 0')
    }

    const nodes = []
    let zeroValue = options.zeroValue
    this.zeroValue = zeroValue
    this.zeroes = []
    if (this.depth) {
      for (let i = 0; i < this.depth; i++) {
        this.zeroes.push(zeroValue)
        nodes[i] = []
        zeroValue = this.hashFn(Array(this.arity).fill(zeroValue))
      }
    }

    this.nodes = nodes
    this.root = zeroValue
  }

  getRoot () {
    return this.root
  }

  getHexRoot () {
    return this.bufferToHex(this.bufferify(this.getRoot()))
  }

  insert (leaf: any) {
    if (this.depth && this.arity) {
      if (this.nodes[0].length >= this.getMaxLeaves()) {
        throw new Error('tree is full')
      }
    }

    let node = leaf
    let index = this.nodes[0].length

    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity
      const levelStartIndex = index - position
      const levelEndIndex = levelStartIndex + this.arity

      const children = []
      this.nodes[level][index] = node

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i < this.nodes[level].length) {
          children.push(this.nodes[level][i])
        } else {
          children.push(this.zeroes[level])
        }
      }

      node = this.hashFn(children)
      index = Math.floor(index / this.arity)
    }

    this.root = node
  }

  delete (index: number) {
    this.update(index, this.zeroValue)
  }

  update (index: number, newLeaf: any) {
    if (index < 0 || index >= this.nodes[0].length) {
      throw new Error('out of bounds')
    }

    let node = newLeaf

    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity
      const levelStartIndex = index - position
      const levelEndIndex = levelStartIndex + this.arity

      const children = []
      this.nodes[level][index] = node

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i < this.nodes[level].length) {
          children.push(this.nodes[level][i])
        } else {
          children.push(this.zeroes[level])
        }
      }

      node = this.hashFn(children)
      index = Math.floor(index / this.arity)
    }

    this.root = node
  }

  getDepth (): number {
    return this.depth
  }

  getArity (): number {
    return this.arity
  }

  getMaxLeaves (): number {
    return this.depth ** this.arity
  }

  indexOf (leaf: any): number {
    return this.nodes[0].indexOf(leaf)
  }

  getLeaves () {
    const leaves = this.copyList(this.nodes[0])
    const index = this.nodes[0].length
    for (let i = index; i < this.getMaxLeaves(); i++) {
      leaves[i] = this.zeroValue
    }
    return leaves
  }

  copyList (list: any[]) {
    return list.map((x: any) => BigInt(x))
  }

  getLayers ():any[] {
    const layers = []

    for (const list of this.nodes) {
      layers.push(this.copyList(list))
    }

    if (layers[0].length < this.getMaxLeaves()) {
      let index = layers[0].length
      for (let i = index; i < this.getMaxLeaves(); i++) {
        layers[0][i] = this.zeroValue
      }
      for (let level = 0; level < this.depth; level++) {
        const position = index % this.arity
        const levelStartIndex = index - position
        const levelEndIndex = levelStartIndex + this.arity

        for (let i = levelStartIndex; i < levelEndIndex; i++) {
          if (i >= layers[level].length) {
            layers[level][i] = this.zeroes[level]
          }
        }
        index = Math.floor(index / this.arity)
      }
    }

    layers.push([this.root])
    return layers
  }

  getHexLayers ():string[] {
    return this.getLayers().reduce((acc: string[][], item: Buffer[]) => {
      if (Array.isArray(item)) {
        acc.push(item.map(layer => this.bufferToHex(this.bufferify(layer))))
      } else {
        acc.push(item)
      }

      return acc
    }, [])
  }

  getLayersAsObject ():any {
    const layers: any[] = this.getLayers().map((layer: any) => layer.map((value: any) => this.bufferToHex(this.bufferify(value), false)))
    const objs = []
    for (let i = 0; i < layers.length; i++) {
      const arr = []
      for (let j = 0; j < layers[i].length; j++) {
        const obj = { [layers[i][j]]: null }
        if (objs.length) {
          obj[layers[i][j]] = {}
          const a = objs.shift()
          const akey = Object.keys(a)[0]
          obj[layers[i][j]][akey] = a[akey]
          if (objs.length) {
            const b = objs.shift()
            const bkey = Object.keys(b)[0]
            obj[layers[i][j]][bkey] = b[bkey]
          }
        }

        arr.push(obj)
      }

      objs.push(...arr)
    }

    return objs[0]
  }

  computeRoot () {
    let node : any
    let index = this.nodes[0].length
    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity
      const levelStartIndex = index - position
      const levelEndIndex = levelStartIndex + this.arity

      const children = []

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i < this.nodes[level].length) {
          children.push(this.nodes[level][i])
        } else {
          children.push(this.zeroes[level])
        }
      }

      node = this.hashFn(children)
      index = Math.floor(index / this.arity)
    }

    return node
  }

  getProof (index: number): any {
    if (index < 0 || index >= this.nodes[0].length) {
      throw new Error('The leaf does not exist in this tree')
    }

    const siblings: Node[][] = []
    const pathIndices: number[] = []
    const leafIndex = index

    for (let level = 0; level < this.depth; level += 1) {
      const position = index % this.arity
      const levelStartIndex = index - position
      const levelEndIndex = levelStartIndex + this.arity

      pathIndices[level] = position
      siblings[level] = []

      for (let i = levelStartIndex; i < levelEndIndex; i += 1) {
        if (i !== index) {
          if (i < this.nodes[level].length) {
            siblings[level].push(this.nodes[level][i])
          } else {
            siblings[level].push(this.zeroes[level])
          }
        }
      }

      index = Math.floor(index / this.arity)
    }

    return { root: this.root, leaf: this.nodes[0][leafIndex], pathIndices, siblings }
  }

  verify (proof: any): boolean {
    let node = proof.leaf

    for (let i = 0; i < proof.siblings.length; i += 1) {
      const children = proof.siblings[i].slice()

      children.splice(proof.pathIndices[i], 0, node)

      node = this.hashFn(children)
    }

    return proof.root === node
  }

  toString ():string {
    return this.toTreeString()
  }

  protected toTreeString ():string {
    const obj = this.getLayersAsObject()
    return treeify.asTree(obj, true)
  }
}

if (typeof window !== 'undefined') {
  ;(window as any).IncrementalMerkleTree = IncrementalMerkleTree
}

export default IncrementalMerkleTree
