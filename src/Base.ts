import { Buffer } from 'buffer'
import CryptoJS from 'crypto-js'

export class Base {
  /**
   * print
   * @desc Prints out a visual representation of the merkle tree.
   * @example
   *```js
   *tree.print()
   *```
   */
  print (): void {
    Base.print(this)
  }

  /**
   * bufferIndexOf
   * @desc Returns the first index of which given buffer is found in array.
   * @param {Buffer[]} haystack - Array of buffers.
   * @param {Buffer} needle - Buffer to find.
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.bufferIndexOf(haystack, needle)
   *```
   */
  protected _bufferIndexOf (
    array: Buffer[],
    element: Buffer,
    isSorted: boolean = false
  ): number {
    if (isSorted) {
      return this.binarySearch(array, element, Buffer.compare)
    }

    const eqChecker = (buffer1, buffer2) => buffer1.equals(buffer2)
    return this.linearSearch(array, element, eqChecker)
  }

  /**
   * binarySearch
   * @desc Returns the first index of which given item is found in array using binary search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} compareFunction
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = MerkleTree.binarySearch(array, element, Buffer.compare)
   *```
   */
  static binarySearch (
    array: Buffer[],
    element: Buffer,
    compareFunction: (a: unknown, b: unknown) => number
  ): number {
    let start = 0
    let end = array.length - 1

    // Iterate while start not meets end
    while (start <= end) {
      // Find the mid index
      const mid = Math.floor((start + end) / 2)

      // Check if the mid value is greater than, equal to, or less than search element.
      const ordering = compareFunction(array[mid], element)

      // If element is present at mid, start iterating for searching first appearance.
      if (ordering === 0) {
        // Linear reverse iteration until the first matching item index is found.
        for (let i = mid - 1; i >= 0; i--) {
          if (compareFunction(array[i], element) === 0) continue
          return i + 1
        }
        return 0
      } /* Else look in left or right half accordingly */ else if (ordering < 0) {
        start = mid + 1
      } else {
        end = mid - 1
      }
    }

    return -1
  }

  /**
   * binarySearch
   * @desc Returns the first index of which given item is found in array using binary search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} compareFunction
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.binarySearch(array, element, Buffer.compare)
   *```
   */
  binarySearch (
    array: Buffer[],
    element: Buffer,
    compareFunction: (a: unknown, b: unknown) => number
  ): number {
    return Base.binarySearch(array, element, compareFunction)
  }

  /**
   * linearSearch
   * @desc Returns the first index of which given item is found in array using linear search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} eqChecker
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = MerkleTree.linearSearch(array, element, (a, b) => a === b)
   *```
   */
  static linearSearch (array: Buffer[], element: Buffer, eqChecker: (a: unknown, b: unknown) => boolean):number {
    for (let i = 0; i < array.length; i++) {
      if (eqChecker(array[i], element)) {
        return i
      }
    }

    return -1
  }

  /**
   * linearSearch
   * @desc Returns the first index of which given item is found in array using linear search.
   * @param {Buffer[]} array - Array of items.
   * @param {Buffer} element - Item to find.
   * @param {Function} eqChecker
   * @return {Number} - Index number
   *
   * @example
   * ```js
   *const index = tree.linearSearch(array, element, (a, b) => a === b)
   *```
   */
  linearSearch (array: Buffer[], element: Buffer, eqChecker: (a: unknown, b: unknown) => boolean):number {
    return Base.linearSearch(array, element, eqChecker)
  }

  /**
   * bufferify
   * @desc Returns a buffer type for the given value.
   * @param {String|Number|Object|Buffer|ArrayBuffer} value
   * @return {Buffer}
   *
   * @example
   * ```js
   *const buf = MerkleTree.bufferify('0x1234')
   *```
   */
  static bufferify (value: any): Buffer {
    if (!Buffer.isBuffer(value)) {
      // crypto-js support
      if (typeof value === 'object' && value.words) {
        return Buffer.from(value.toString(CryptoJS.enc.Hex), 'hex')
      } else if (Base.isHexString(value)) {
        return Buffer.from(value.replace(/^0x/, ''), 'hex')
      } else if (typeof value === 'string') {
        return Buffer.from(value)
      } else if (typeof value === 'number') {
        let s = value.toString()
        if (s.length % 2) {
          s = `0${s}`
        }
        return Buffer.from(s, 'hex')
      } else if (ArrayBuffer.isView(value)) {
        return Buffer.from(value.buffer, value.byteOffset, value.byteLength)
      }
    }

    return value
  }

  /**
   * isHexString
   * @desc Returns true if value is a hex string.
   * @param {String} value
   * @return {Boolean}
   *
   * @example
   * ```js
   *console.log(MerkleTree.isHexString('0x1234'))
   *```
   */
  static isHexString (v: string): boolean {
    return typeof v === 'string' && /^(0x)?[0-9A-Fa-f]*$/.test(v)
  }

  /**
   * print
   * @desc Prints out a visual representation of the given merkle tree.
   * @param {Object} tree - Merkle tree instance.
   * @return {String}
   * @example
   *```js
   *MerkleTree.print(tree)
   *```
   */
  static print (tree: any): void {
    console.log(tree.toString())
  }

  /**
   * bufferToHex
   * @desc Returns a hex string with 0x prefix for given buffer.
   * @param {Buffer} value
   * @return {String}
   * @example
   *```js
   *const hexStr = tree.bufferToHex(Buffer.from('A'))
   *```
   */
  bufferToHex (value: Buffer, withPrefix: boolean = true): string {
    return Base.bufferToHex(value, withPrefix)
  }

  /**
   * bufferToHex
   * @desc Returns a hex string with 0x prefix for given buffer.
   * @param {Buffer} value
   * @return {String}
   * @example
   *```js
   *const hexStr = MerkleTree.bufferToHex(Buffer.from('A'))
   *```
   */
  static bufferToHex (value: Buffer, withPrefix: boolean = true): string {
    return `${withPrefix ? '0x' : ''}${(value || Buffer.alloc(0)).toString(
      'hex'
    )}`
  }

  /**
   * bufferify
   * @desc Returns a buffer type for the given value.
   * @param {String|Number|Object|Buffer} value
   * @return {Buffer}
   *
   * @example
   * ```js
   *const buf = tree.bufferify('0x1234')
   *```
   */
  bufferify (value: any): Buffer {
    return Base.bufferify(value)
  }

  /**
   * bufferifyFn
   * @desc Returns a function that will bufferify the return value.
   * @param {Function}
   * @return {Function}
   *
   * @example
   * ```js
   *const fn = tree.bufferifyFn((value) => sha256(value))
   *```
   */
  bufferifyFn (f: any): any {
    return (value: any): Buffer => {
      const v = f(value)
      if (Buffer.isBuffer(v)) {
        return v
      }

      if (this._isHexString(v)) {
        return Buffer.from(v.replace('0x', ''), 'hex')
      }

      if (typeof v === 'string') {
        return Buffer.from(v)
      }

      if (ArrayBuffer.isView(v)) {
        return Buffer.from(v.buffer, v.byteOffset, v.byteLength)
      }

      // crypto-js support
      return Buffer.from(
        f(CryptoJS.enc.Hex.parse(value.toString('hex'))).toString(
          CryptoJS.enc.Hex
        ),
        'hex'
      )
    }
  }

  /**
   * isHexString
   * @desc Returns true if value is a hex string.
   * @param {String} value
   * @return {Boolean}
   *
   * @example
   * ```js
   *console.log(MerkleTree.isHexString('0x1234'))
   *```
   */
  protected _isHexString (value: string): boolean {
    return Base.isHexString(value)
  }

  /**
   * log2
   * @desc Returns the log2 of number.
   * @param {Number} value
   * @return {Number}
   */
  protected _log2 (n: number): number {
    return n === 1 ? 0 : 1 + this._log2((n / 2) | 0)
  }

  /**
   * zip
   * @desc Returns true if value is a hex string.
   * @param {String[]|Number[]|Buffer[]} a - first array
   * @param {String[]|Number[]|Buffer[]} b -  second array
   * @return {String[][]|Number[][]|Buffer[][]}
   *
   * @example
   * ```js
   *const zipped = tree.zip(['a', 'b'],['A', 'B'])
   *console.log(zipped) // [ [ 'a', 'A' ], [ 'b', 'B' ] ]
   *```
   */
  protected _zip (a: any[], b: any[]): any[][] {
    return a.map((e, i) => [e, b[i]])
  }
}

export default Base
