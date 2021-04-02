import Base from './Base'
import SHA256 from 'crypto-js/sha256'

// @credit: https://github.com/wanseob/solidity-mmr
export class MerkleMountainRange extends Base {
  root: Buffer = Buffer.alloc(0)
  size: number = 0
  width: number = 0
  hashes: any = {}
  data: any = {}
  hashLeafFn: any
  peakBaggingFn: any
  hashBranchFn: any
  private hashFn: any

  constructor (hashFn = SHA256, leaves: any[] = [], hashLeafFn?: any, peakBaggingFn?: any, hashBranchFn?: any) {
    super()
    leaves = leaves.map(this.bufferify)
    this.hashFn = this._bufferifyFn(hashFn)
    this.hashLeafFn = hashLeafFn
    this.peakBaggingFn = peakBaggingFn
    this.hashBranchFn = hashBranchFn

    for (const leaf of leaves) {
      this.append(leaf)
    }
  }

  append (data: any) {
    data = this.bufferify(data)
    const dataHash = this.hashFn(data)
    const dataHashHex = this.bufferToHex(dataHash)
    if (!this.data[dataHashHex] || this.bufferToHex(this.hashFn(this.data[dataHashHex])) !== dataHashHex) {
      this.data[dataHashHex] = data
    }

    const leaf = this.hashLeaf(this.size + 1, dataHash)
    this.hashes[this.size + 1] = leaf
    this.width += 1

    // find peaks for enlarged tree
    const peakIndexes = this.getPeakIndexes(this.width)

    // the right most peak's value is the new size of the updated tree
    this.size = this.getSize(this.width)

    // starting from the left-most peak, get all peak hashes
    const peaks = []
    for (let i = 0; i < peakIndexes.length; i++) {
      peaks[i] = this._getOrCreateNode(peakIndexes[i])
    }

    // update the tree root hash
    this.root = this.peakBagging(this.width, peaks)
  }

  hashLeaf (index: number, dataHash: Buffer | string) {
    dataHash = this.bufferify(dataHash)
    if (this.hashLeafFn) {
      return this.bufferify(this.hashLeafFn(index, dataHash))
    }
    return this.hashFn(Buffer.concat([this.bufferify(index), dataHash]))
  }

  hashBranch (index: number, left: any, right: any): any {
    if (this.hashBranchFn) {
      return this.bufferify(this.hashBranchFn(index, left, right))
    }
    return this.hashFn(Buffer.concat([this.bufferify(index), this.bufferify(left), this.bufferify(right)]))
  }

  getPeaks () {
    const peakIndexes = this.getPeakIndexes(this.width)
    const peaks = []
    for (let i = 0; i < peakIndexes.length; i++) {
      peaks[i] = this.hashes[peakIndexes[i]]
    }
    return peaks
  }

  getLeafIndex (width: number) {
    if (width % 2 === 1) {
      return this.getSize(width)
    }

    return this.getSize(width - 1) + 1
  }

  getPeakIndexes (width: number): number[] {
    const numPeaks = this.numOfPeaks(width)
    const peakIndexes = []
    let count = 0
    let size = 0
    for (let i = 255; i > 0; i--) {
      if ((width & (1 << (i - 1))) !== 0) {
        // peak exists
        size = size + (1 << i) - 1
        peakIndexes[count++] = size
        if (peakIndexes.length >= numPeaks) {
          break
        }
      }
    }

    if (count !== peakIndexes.length) {
      throw new Error('Invalid bit calculation')
    }

    return peakIndexes
  }

  numOfPeaks (width: number): number {
    let bits = width
    let num = 0
    while (bits > 0) {
      if (bits % 2 === 1) {
        num++
      }
      bits = bits >> 1
    }
    return num
  }

  peakBagging (width: number, peaks: any[]): any {
    const size = this.getSize(width)
    if (this.numOfPeaks(width) !== peaks.length) {
      throw new Error('Received invalid number of peaks')
    }

    if (this.peakBaggingFn) {
      return this.bufferify(this.peakBaggingFn(size, peaks))
    }

    return this.hashFn(Buffer.concat([this.bufferify(size), ...peaks.map(this.bufferify)]))
  }

  getSize (width: number): number {
    return (width << 1) - this.numOfPeaks(width)
  }

  getRoot (): any {
    return this.root
  }

  getHexRoot (): any {
    return this.bufferToHex(this.getRoot())
  }

  getNode (index: number): any {
    return this.hashes[index]
  }

  mountainHeight (size: number): number {
    let height = 1
    while (1 << height <= size + height) {
      height++
    }
    return height - 1
  }

  heightAt (index: number): number {
    let reducedIndex = index
    let peakIndex = 0
    let height = 0

    // if an index has a left mountain then subtract the mountain
    while (reducedIndex > peakIndex) {
      reducedIndex -= (1 << height) - 1
      height = this.mountainHeight(reducedIndex)
      peakIndex = (1 << height) - 1
    }

    // index is on the right slope
    return height - (peakIndex - reducedIndex)
  }

  isLeaf (index: number): boolean {
    return this.heightAt(index) === 1
  }

  getChildren (index: number) {
    const left = index - (1 << (this.heightAt(index) - 1))
    const right = index - 1
    if (left === right) {
      throw new Error('Not a parent')
    }

    return [left, right]
  }

  _getOrCreateNode (index: number) {
    if (index > this.size) {
      throw new Error('Out of range')
    }

    if (!this.hashes[index]) {
      const [leftIndex, rightIndex] = this.getChildren(index)
      const leftHash = this._getOrCreateNode(leftIndex)
      const rightHash = this._getOrCreateNode(rightIndex)
      this.hashes[index] = this.hashBranch(index, leftHash, rightHash)
    }

    return this.hashes[index]
  }

  getMerkleProof (index: number) {
    if (index >= this.size) {
      throw new Error('Out of range')
    }
    if (!this.isLeaf(index)) {
      throw new Error('Not a leaf')
    }

    const root = this.root
    const width = this.width

    // find all peaks for bagging
    const peaks = this.getPeakIndexes(this.width)
    const peakBagging = []
    let cursor = 0

    for (let i = 0; i < peaks.length; i++) {
      // collect the hash of all peaks
      peakBagging[i] = this.hashes[peaks[i]]

      // find the peak which includes the target index
      if (peaks[i] >= index && cursor === 0) {
        cursor = peaks[i]
      }
    }

    let left = 0
    let right = 0

    // get hashes of the siblings in the mountain which the index belgons to.
    // it moves the cursor from the summit of the mountain down to the target index
    let height = this.heightAt(cursor)
    const siblings = []
    while (cursor !== index) {
      height--
      ([left, right] = this.getChildren(cursor))

      // move the cursor down to the left size or right size
      cursor = index <= left ? left : right

      // remaining node is the sibling
      siblings[height - 1] = this.hashes[index < left ? right : left]
    }

    return {
      root,
      width,
      peakBagging,
      siblings
    }
  }

  verify (root: any, width: number, index: number, value: Buffer | string, peaks: any[], siblings: any[]) {
    value = this.bufferify(value)
    const size = this.getSize(width)
    if (size < index) {
      throw new Error('Index is out of range')
    }

    // check the root equals the peak bagging hash
    if (!root.equals(this.peakBagging(width, peaks))) {
      throw new Error('Invalid root hash from the peaks')
    }

    // find the mountain where the target index belongs to
    let cursor = 0
    let targetPeak

    const peakIndexes = this.getPeakIndexes(width)
    for (let i = 0; i < peakIndexes.length; i++) {
      if (peakIndexes[i] >= index) {
        targetPeak = peaks[i]
        cursor = peakIndexes[i]
        break
      }
    }

    if (!targetPeak) {
      throw new Error('target not found')
    }

    // find the path climbing down
    let height = siblings.length + 1
    const path = new Array(height)
    let left = 0
    let right = 0

    while (height > 0) {
      // record the current cursor and climb down
      path[--height] = cursor
      if (cursor === index) {
        // on the leaf node. Stop climbing down
        break
      } else {
        // on the parent node. Go left or right
        ([left, right] = this.getChildren(cursor))
        cursor = index > left ? right : left
        continue
      }
    }

    // calculate the summit hash climbing up again
    let node
    while (height < path.length) {
      // move cursor
      cursor = path[height]
      if (height === 0) {
        // cusor is on the leaf
        node = this.hashLeaf(cursor, this.hashFn(value))
      } else if (cursor - 1 === path[height - 1]) {
        // cursor is on a parent and a siblings is on the left
        node = this.hashBranch(cursor, siblings[height - 1], node)
      } else {
        // cursor is on a parent and a siblings is on the right
        node = this.hashBranch(cursor, node, siblings[height - 1])
      }
      // climb up
      height++
    }

    // computed hash value of the summit should equal to the target peak hash
    if (!node.equals(targetPeak)) {
      throw new Error('hashed peak is invalid')
    }

    return true
  }

  peaksToPeakMap (width: number, peaks: any[]) {
    throw new Error('not implemented')
  }

  peakMapToPeaks (width: number, peakMap: any) {
    throw new Error('not implemented')
  }

  peakUpdate (width: number, prevPeakMap: any, itemHash: any) {
    throw new Error('not implemented')
  }

  rollUp (root: any, width: number, peaks: any[], itemHashes: any[]) {
    throw new Error('not implemented')
  }
}

export default MerkleMountainRange
