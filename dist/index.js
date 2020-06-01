"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var reverse = require("buffer-reverse");
var CryptoJS = require("crypto-js");
var treeify = require("treeify");
/**
 * Class reprensenting a Merkle Tree
 * @namespace MerkleTree
 */
var MerkleTree = /** @class */ (function () {
    /**
     * @desc Constructs a Merkle Tree.
     * All nodes and leaves are stored as Buffers.
     * Lonely leaf nodes are promoted to the next level up without being hashed again.
     * @param {Buffer[]} leaves - Array of hashed leaves. Each leaf must be a Buffer.
     * @param {Function} hashAlgorithm - Algorithm used for hashing leaves and nodes
     * @param {Object} options - Additional options
     * @example
     *```js
     *const MerkleTree = require('merkletreejs')
     *const crypto = require('crypto')
     *
     *function sha256(data) {
     *  // returns Buffer
     *  return crypto.createHash('sha256').update(data).digest()
     *}
     *
     *const leaves = ['a', 'b', 'c'].map(x => keccak(x))
     *
     *const tree = new MerkleTree(leaves, sha256)
     *```
     */
    function MerkleTree(leaves, hashAlgorithm, options) {
        if (options === void 0) { options = {}; }
        this.isBitcoinTree = !!options.isBitcoinTree;
        this.hashLeaves = !!options.hashLeaves;
        this.sortLeaves = !!options.sortLeaves;
        this.sortPairs = !!options.sortPairs;
        this.sort = !!options.sort;
        if (this.sort) {
            this.sortLeaves = true;
            this.sortPairs = true;
        }
        this.duplicateOdd = !!options.duplicateOdd;
        this.singleOdd = !!options.singleOdd;
        this.hashAlgo = this._bufferifyFn(hashAlgorithm);
        if (this.hashLeaves) {
            leaves = leaves.map(this.hashAlgo);
        }
        this.leaves = leaves.map(this._bufferify);
        if (this.sortLeaves) {
            this.leaves = this.leaves.sort(Buffer.compare);
        }
        this.layers = [this.leaves];
        this.createHashes(this.leaves);
    }
    // TODO: documentation
    MerkleTree.prototype.createHashes = function (nodes) {
        while (nodes.length > 1) {
            var layerIndex = this.layers.length;
            this.layers.push([]);
            for (var i = 0; i < nodes.length; i += 2) {
                if (i + 1 === nodes.length) {
                    if (nodes.length % 2 === 1) {
                        var data_1 = nodes[nodes.length - 1];
                        var hash_1 = data_1;
                        // is bitcoin tree
                        if (this.isBitcoinTree) {
                            // Bitcoin method of duplicating the odd ending nodes
                            data_1 = Buffer.concat([reverse(data_1), reverse(data_1)]);
                            hash_1 = this.hashAlgo(data_1);
                            hash_1 = reverse(this.hashAlgo(hash_1));
                            this.layers[layerIndex].push(hash_1);
                            continue;
                        }
                        else {
                            if (!this.duplicateOdd && !this.singleOdd) {
                                this.layers[layerIndex].push(nodes[i]);
                                continue;
                            }
                        }
                    }
                }
                var left = nodes[i];
                var right = i + 1 === nodes.length ? left : nodes[i + 1];
                var data = null;
                var combined = null;
                if (this.isBitcoinTree) {
                    combined = [reverse(left), reverse(right)];
                }
                else {
                    if (this.singleOdd) {
                        right = nodes[i + 1];
                        if (!left) {
                            combined = [right];
                        }
                        else if (!right) {
                            combined = [left];
                        }
                        else {
                            combined = [left, right];
                        }
                    }
                    else {
                        combined = [left, right];
                    }
                }
                if (this.sortPairs) {
                    combined.sort(Buffer.compare);
                }
                data = Buffer.concat(combined);
                var hash = this.hashAlgo(data);
                // double hash if bitcoin tree
                if (this.isBitcoinTree) {
                    hash = reverse(this.hashAlgo(hash));
                }
                this.layers[layerIndex].push(hash);
            }
            nodes = this.layers[layerIndex];
        }
    };
    /**
     * getLeaves
     * @desc Returns array of leaves of Merkle Tree.
     * @return {Buffer[]}
     * @example
     *```js
     *const leaves = tree.getLeaves()
     *```
     */
    MerkleTree.prototype.getLeaves = function (data) {
        var _this = this;
        if (Array.isArray(data)) {
            if (this.hashLeaves) {
                data = data.map(this.hashAlgo);
                if (this.sortLeaves) {
                    data = data.sort(Buffer.compare);
                }
            }
            return this.leaves.filter(function (x) { return _this.bufIndexOf(data, x) !== -1; });
        }
        return this.leaves;
    };
    /**
     * getHexLeaves
     * @desc Returns array of leaves of Merkle Tree as hex strings.
     * @return {String[]}
     * @example
     *```js
     *const leaves = tree.getHexLeaves()
     *```
     */
    MerkleTree.prototype.getHexLeaves = function () {
        var _this = this;
        return this.leaves.map(function (x) { return _this._bufferToHex(x); });
    };
    /**
     * getLayers
     * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root.
     * @return {Buffer[]}
     * @example
     *```js
     *const layers = tree.getLayers()
     *```
     */
    MerkleTree.prototype.getLayers = function () {
        return this.layers;
    };
    /**
     * getHexLayers
     * @desc Returns multi-dimensional array of all layers of Merkle Tree, including leaves and root as hex strings.
     * @return {String[]}
     * @example
     *```js
     *const layers = tree.getHexLayers()
     *```
     */
    MerkleTree.prototype.getHexLayers = function () {
        var _this = this;
        return this.layers.reduce(function (acc, item, i) {
            if (Array.isArray(item)) {
                acc.push(item.map(function (x) { return _this._bufferToHex(x); }));
            }
            else {
                acc.push(item);
            }
            return acc;
        }, []);
    };
    /**
     * getLayersFlat
     * @desc Returns single flat array of all layers of Merkle Tree, including leaves and root.
     * @return {Buffer[]}
     * @example
     *```js
     *const layers = tree.getLayersFlat()
     *```
     */
    MerkleTree.prototype.getLayersFlat = function () {
        var layers = this.layers.reduce(function (acc, item, i) {
            if (Array.isArray(item)) {
                acc.unshift.apply(acc, __spread(item));
            }
            else {
                acc.unshift(item);
            }
            return acc;
        }, []);
        layers.unshift(Buffer.from([0]));
        return layers;
    };
    /**
     * getHexLayersFlat
     * @desc Returns single flat array of all layers of Merkle Tree, including leaves and root as hex string.
     * @return {String[]}
     * @example
     *```js
     *const layers = tree.getHexLayersFlat()
     *```
     */
    MerkleTree.prototype.getHexLayersFlat = function () {
        var _this = this;
        return this.getLayersFlat().map(function (x) { return _this._bufferToHex(x); });
    };
    /**
     * getRoot
     * @desc Returns the Merkle root hash as a Buffer.
     * @return {Buffer}
     * @example
     *```js
     *const root = tree.getRoot()
     *```
     */
    MerkleTree.prototype.getRoot = function () {
        return this.layers[this.layers.length - 1][0] || Buffer.from([]);
    };
    /**
     * getHexRoot
     * @desc Returns the Merkle root hash as a hex string.
     * @return {String}
     * @example
     *```js
     *const root = tree.getHexRoot()
     *```
     */
    MerkleTree.prototype.getHexRoot = function () {
        return this._bufferToHex(this.getRoot());
    };
    /**
     * getProof
     * @desc Returns the proof for a target leaf.
     * @param {Buffer} leaf - Target leaf
     * @param {Number} [index] - Target leaf index in leaves array.
     * Use if there are leaves containing duplicate data in order to distinguish it.
     * @return {Object[]} - Array of objects containing a position property of type string
     * with values of 'left' or 'right' and a data property of type Buffer.
     *@example
     * ```js
     *const proof = tree.getProof(leaves[2])
     *```
     *
     * @example
     *```js
     *const leaves = ['a', 'b', 'a'].map(x => keccak(x))
     *const tree = new MerkleTree(leaves, keccak)
     *const proof = tree.getProof(leaves[2], 2)
     *```
     */
    MerkleTree.prototype.getProof = function (leaf, index) {
        leaf = this._bufferify(leaf);
        var proof = [];
        if (typeof index !== 'number') {
            index = -1;
            for (var i = 0; i < this.leaves.length; i++) {
                if (Buffer.compare(leaf, this.leaves[i]) === 0) {
                    index = i;
                }
            }
        }
        if (index <= -1) {
            return [];
        }
        if (this.isBitcoinTree && index === (this.leaves.length - 1)) {
            // Proof Generation for Bitcoin Trees
            for (var i = 0; i < this.layers.length - 1; i++) {
                var layer = this.layers[i];
                var isRightNode = index % 2;
                var pairIndex = (isRightNode ? index - 1 : index);
                if (pairIndex < layer.length) {
                    proof.push({
                        data: layer[pairIndex]
                    });
                }
                // set index to parent index
                index = (index / 2) | 0;
            }
            return proof;
        }
        else {
            // Proof Generation for Non-Bitcoin Trees
            for (var i = 0; i < this.layers.length; i++) {
                var layer = this.layers[i];
                var isRightNode = index % 2;
                var pairIndex = (isRightNode ? index - 1 : index + 1);
                if (pairIndex < layer.length) {
                    proof.push({
                        position: isRightNode ? 'left' : 'right',
                        data: layer[pairIndex]
                    });
                }
                // set index to parent index
                index = (index / 2) | 0;
            }
            return proof;
        }
    };
    // TODO: documentation
    MerkleTree.prototype.getProofIndices = function (treeIndices, depth) {
        var e_1, _a, e_2, _b;
        var leafCount = Math.pow(2, depth);
        var maximalIndices = new Set();
        try {
            for (var treeIndices_1 = __values(treeIndices), treeIndices_1_1 = treeIndices_1.next(); !treeIndices_1_1.done; treeIndices_1_1 = treeIndices_1.next()) {
                var index = treeIndices_1_1.value;
                var x = leafCount + index;
                while (x > 1) {
                    maximalIndices.add(x ^ 1);
                    x = (x / 2) | 0;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (treeIndices_1_1 && !treeIndices_1_1.done && (_a = treeIndices_1["return"])) _a.call(treeIndices_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var a = treeIndices.map(function (index) { return leafCount + index; });
        var b = Array.from(maximalIndices).sort(function (a, b) { return a - b; }).reverse();
        maximalIndices = a.concat(b);
        var redundantIndices = new Set();
        var proof = [];
        try {
            for (var maximalIndices_1 = __values(maximalIndices), maximalIndices_1_1 = maximalIndices_1.next(); !maximalIndices_1_1.done; maximalIndices_1_1 = maximalIndices_1.next()) {
                var index = maximalIndices_1_1.value;
                if (!redundantIndices.has(index)) {
                    proof.push(index);
                    while (index > 1) {
                        redundantIndices.add(index);
                        if (!redundantIndices.has(index ^ 1))
                            break;
                        index = (index / 2) | 0;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (maximalIndices_1_1 && !maximalIndices_1_1.done && (_b = maximalIndices_1["return"])) _b.call(maximalIndices_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return proof.filter(function (index) {
            return !treeIndices.includes(index - leafCount);
        });
    };
    // TODO: documentation
    MerkleTree.prototype.getMultiProof = function (tree, indices) {
        var _this = this;
        if (!indices) {
            indices = tree;
            tree = this.getLayersFlat();
            if (!indices.every(function (x) { return typeof x === 'number'; })) {
                var els = indices;
                if (this.sortPairs) {
                    els = els.sort(Buffer.compare);
                }
                var ids = els.map(function (el) { return _this.bufIndexOf(_this.leaves, el); }).sort(function (a, b) { return a === b ? 0 : a > b ? 1 : -1; });
                if (!ids.every(function (idx) { return idx !== -1; })) {
                    throw new Error('Element does not exist in Merkle tree');
                }
                var hashes_1 = [];
                var proof = [];
                var nextIds = [];
                for (var i = 0; i < this.layers.length; i++) {
                    var layer = this.layers[i];
                    for (var j = 0; j < ids.length; j++) {
                        var idx = ids[j];
                        var pairElement = this.getPairElement(idx, layer);
                        hashes_1.push(layer[idx]);
                        if (pairElement) {
                            proof.push(pairElement);
                        }
                        nextIds.push((idx / 2) | 0);
                    }
                    ids = nextIds.filter(function (value, i, self) { return self.indexOf(value) === i; });
                    nextIds = [];
                }
                return proof.filter(function (value) { return !hashes_1.includes(value); });
            }
        }
        return this.getProofIndices(indices, this._log2((tree.length / 2) | 0)).map(function (index) { return tree[index]; });
    };
    // TODO: documentation
    MerkleTree.prototype.getHexMultiProof = function (tree, indices) {
        return this.getMultiProof(tree, indices).map(this._bufferToHex);
    };
    // TODO: documentation
    MerkleTree.prototype.bufIndexOf = function (arr, el) {
        for (var i = 0; i < arr.length; i++) {
            if (el.equals(arr[i])) {
                return i;
            }
        }
        return -1;
    };
    // TODO: documentation
    MerkleTree.prototype.getProofFlags = function (els, proofs) {
        var _this = this;
        var ids = els.map(function (el) { return _this.bufIndexOf(_this.leaves, el); }).sort(function (a, b) { return a === b ? 0 : a > b ? 1 : -1; });
        if (!ids.every(function (idx) { return idx !== -1; })) {
            throw new Error('Element does not exist in Merkle tree');
        }
        var tested = [];
        var flags = [];
        var _loop_1 = function (index) {
            var layer = this_1.layers[index];
            ids = ids.reduce(function (ids, idx) {
                var skipped = tested.includes(layer[idx]);
                if (!skipped) {
                    var pairElement = _this.getPairElement(idx, layer);
                    var proofUsed = proofs.includes(layer[idx]) || proofs.includes(pairElement);
                    pairElement && flags.push(!proofUsed);
                    tested.push(layer[idx]);
                    tested.push(pairElement);
                }
                ids.push((idx / 2) | 0);
                return ids;
            }, []);
        };
        var this_1 = this;
        for (var index = 0; index < this.layers.length; index++) {
            _loop_1(index);
        }
        return flags;
    };
    MerkleTree.prototype.getPairElement = function (idx, layer) {
        var pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
        if (pairIdx < layer.length) {
            return layer[pairIdx];
        }
        else {
            return null;
        }
    };
    // TODO: documentation
    MerkleTree.prototype.getHexProof = function (leaf, index) {
        var _this = this;
        return this.getProof(leaf, index).map(function (x) { return _this._bufferToHex(x.data); });
    };
    /**
     * verify
     * @desc Returns true if the proof path (array of hashes) can connect the target node
     * to the Merkle root.
     * @param {Object[]} proof - Array of proof objects that should connect
     * target node to Merkle root.
     * @param {Buffer} targetNode - Target node Buffer
     * @param {Buffer} root - Merkle root Buffer
     * @return {Boolean}
     * @example
     *```js
     *const root = tree.getRoot()
     *const proof = tree.getProof(leaves[2])
     *const verified = tree.verify(proof, leaves[2], root)
     *```
     */
    MerkleTree.prototype.verify = function (proof, targetNode, root) {
        var hash = this._bufferify(targetNode);
        root = this._bufferify(root);
        if (!Array.isArray(proof) ||
            !proof.length ||
            !targetNode ||
            !root) {
            return false;
        }
        for (var i = 0; i < proof.length; i++) {
            var node = proof[i];
            var data = null;
            var isLeftNode = null;
            // NOTE: case for when proof is hex values only
            if (typeof node === 'string') {
                data = this._bufferify(node);
                isLeftNode = true;
            }
            else {
                data = node.data;
                isLeftNode = (node.position === 'left');
            }
            var buffers = [];
            if (this.isBitcoinTree) {
                buffers.push(reverse(hash));
                buffers[isLeftNode ? 'unshift' : 'push'](reverse(data));
                hash = this.hashAlgo(Buffer.concat(buffers));
                hash = reverse(this.hashAlgo(hash));
            }
            else {
                if (this.sortPairs) {
                    if (Buffer.compare(hash, data) === -1) {
                        buffers.push(hash, data);
                        hash = this.hashAlgo(Buffer.concat(buffers));
                    }
                    else {
                        buffers.push(data, hash);
                        hash = this.hashAlgo(Buffer.concat(buffers));
                    }
                }
                else {
                    buffers.push(hash);
                    buffers[isLeftNode ? 'unshift' : 'push'](data);
                    hash = this.hashAlgo(Buffer.concat(buffers));
                }
            }
        }
        return Buffer.compare(hash, root) === 0;
    };
    // TODO: documentation
    MerkleTree.prototype.verifyMultiProof = function (root, indices, leaves, depth, proof) {
        var e_3, _a, e_4, _b;
        root = this._bufferify(root);
        leaves = leaves.map(this._bufferify);
        proof = proof.map(this._bufferify);
        var tree = {};
        try {
            for (var _c = __values(this._zip(indices, leaves)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), index = _e[0], leaf = _e[1];
                tree[(Math.pow(2, depth)) + index] = leaf;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var _f = __values(this._zip(this.getProofIndices(indices, depth), proof)), _g = _f.next(); !_g.done; _g = _f.next()) {
                var _h = __read(_g.value, 2), index = _h[0], proofitem = _h[1];
                tree[index] = proofitem;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f["return"])) _b.call(_f);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var indexqueue = Object.keys(tree).map(function (x) { return +x; }).sort(function (a, b) { return a - b; });
        indexqueue = indexqueue.slice(0, indexqueue.length - 1);
        var i = 0;
        while (i < indexqueue.length) {
            var index = indexqueue[i];
            if (index >= 2 && ({}).hasOwnProperty.call(tree, index ^ 1)) {
                tree[(index / 2) | 0] = this.hashAlgo(Buffer.concat([tree[index - (index % 2)], tree[index - (index % 2) + 1]]));
                indexqueue.push((index / 2) | 0);
            }
            i += 1;
        }
        return !indices.length || (({}).hasOwnProperty.call(tree, 1) && tree[1].equals(root));
    };
    // TODO: documentation
    MerkleTree.prototype.getDepth = function () {
        return this.getLayers().length - 1;
    };
    // TODO: documentation
    MerkleTree.prototype.getLayersAsObject = function () {
        var _a;
        var layers = this.getLayers().map(function (x) { return x.map(function (x) { return x.toString('hex'); }); });
        var objs = [];
        for (var i = 0; i < layers.length; i++) {
            var arr = [];
            for (var j = 0; j < layers[i].length; j++) {
                var obj = (_a = {}, _a[layers[i][j]] = null, _a);
                if (objs.length) {
                    obj[layers[i][j]] = {};
                    var a = objs.shift();
                    var akey = Object.keys(a)[0];
                    obj[layers[i][j]][akey] = a[akey];
                    if (objs.length) {
                        var b = objs.shift();
                        var bkey = Object.keys(b)[0];
                        obj[layers[i][j]][bkey] = b[bkey];
                    }
                }
                arr.push(obj);
            }
            objs.push.apply(objs, __spread(arr));
        }
        return objs[0];
    };
    // TODO: documentation
    MerkleTree.prototype.print = function () {
        MerkleTree.print(this);
    };
    // TODO: documentation
    MerkleTree.prototype.toTreeString = function () {
        var obj = this.getLayersAsObject();
        return treeify.asTree(obj, true);
    };
    // TODO: documentation
    MerkleTree.prototype.toString = function () {
        return this.toTreeString();
    };
    // TODO: documentation
    MerkleTree.bufferify = function (x) {
        if (!Buffer.isBuffer(x)) {
            // crypto-js support
            if (typeof x === 'object' && x.words) {
                return Buffer.from(x.toString(CryptoJS.enc.Hex), 'hex');
            }
            else if (MerkleTree.isHexStr(x)) {
                return Buffer.from(x.replace(/^0x/, ''), 'hex');
            }
            else if (typeof x === 'string') {
                return Buffer.from(x);
            }
        }
        return x;
    };
    MerkleTree.isHexStr = function (v) {
        return (typeof v === 'string' && /^(0x)?[0-9A-Fa-f]*$/.test(v));
    };
    // TODO: documentation
    MerkleTree.print = function (tree) {
        console.log(tree.toString());
    };
    MerkleTree.prototype._bufferToHex = function (value) {
        return '0x' + value.toString('hex');
    };
    MerkleTree.prototype._bufferify = function (x) {
        return MerkleTree.bufferify(x);
    };
    MerkleTree.prototype._bufferifyFn = function (f) {
        return function (x) {
            var v = f(x);
            if (Buffer.isBuffer(v)) {
                return v;
            }
            if (this._isHexStr(v)) {
                return Buffer.from(v, 'hex');
            }
            // crypto-js support
            return Buffer.from(f(CryptoJS.enc.Hex.parse(x.toString('hex'))).toString(CryptoJS.enc.Hex), 'hex');
        };
    };
    MerkleTree.prototype._isHexStr = function (v) {
        return MerkleTree.isHexStr(v);
    };
    MerkleTree.prototype._log2 = function (x) {
        return x === 1 ? 0 : 1 + this._log2((x / 2) | 0);
    };
    MerkleTree.prototype._zip = function (a, b) {
        return a.map(function (e, i) { return [e, b[i]]; });
    };
    return MerkleTree;
}());
exports.MerkleTree = MerkleTree;
exports["default"] = MerkleTree;
