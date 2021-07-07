// elements
var $form = document.getElementById('form')
var $input = document.getElementById('input')
var $options = document.querySelectorAll('input[name="option"]')
var $fillDefaultHashView = document.getElementById('fillDefaultHashView')
var $fillDefaultHash = document.getElementById('fillDefaultHashValue')
var $addressZero = document.getElementById('addressZero')
var $hashAddressZero = document.getElementById('hashAddressZero')
var $root = document.getElementById('root')
var $leaves = document.getElementById('leaves')
var $layers = document.getElementById('layers')
var $flatLayers = document.getElementById('flatLayers')
var $tree = document.getElementById('tree')
var $leaveSelect = document.getElementById('leaveSelect')
var $proof = document.getElementById('proof')
var $verifyForm = document.getElementById('verifyForm')
var $verifyProof = document.getElementById('verifyProof')
var $verifyLeaf = document.getElementById('verifyLeaf')
var $verifyRoot = document.getElementById('verifyRoot')
var $verified = document.getElementById('verified')

// variables

const addressZero = '0x0000000000000000000000000000000000000000000000000000000000000000'
var hashFns = {
  sha256: window.sha256,
  keccak256: window.keccak256
}

var options = {
  hashLeaves: false,
  sortLeaves: true,
  sortPairs: true,
  duplicateOdd: false,
  isBitcoinTree: false
}

var tree

// functions

function compute () {
  const value = getInputValue()
  const leaves = parseInput(value)
  const hashFn = getHashFn()
  const fillDefaultHash = getDefaultFillHashInput()
  const _options = Object.assign({}, options, {
    fillDefaultHash: options.fillDefaultHash ? fillDefaultHash : undefined
  })
  console.log('input leaves:', leaves)
  console.log('hash:', getHashType())
  console.log('options:', _options)
  tree = new window.MerkleTree(leaves, hashFn, _options)
  const hexRoot = tree.getHexRoot()
  const hexLeaves = tree.getHexLeaves()
  const hexLayers = tree.getHexLayers()
  const hexFlatLayers = tree.getHexLayersFlat()
  console.log('root:', hexRoot)
  console.log('leaves:', hexLeaves)
  console.log('layers:', hexLayers)
  console.log('flatLayers:', hexFlatLayers)
  setRootValue(hexRoot)
  setLeavesValue(JSON.stringify(hexLeaves, null, 2))
  setLayersValue(JSON.stringify(hexLayers, null, 2))
  setFlatLayersValue(JSON.stringify(hexFlatLayers, null, 2))
  setTreeValue(tree.toString())
  updateLeaveOptions(hexLeaves)
  updateProof(0)
  setVerified('')
}

function parseInput (value) {
  value = value.trim().replace(/'/gi, '"')
  try {
    return JSON.parse(value)
  } catch (err) {
    return value.split('\n')
      .map(function (line) { return line.trim() })
      .filter(function (line) { return line })
  }
}

function updateLeaveOptions (leaves) {
  $leaveSelect.innerHTML = ''
  leaves.forEach(function (leaf, i) {
    const el = document.createElement('option')
    el.value = `${i}`
    el.text = `#${i} - ${leaf}`
    $leaveSelect.appendChild(el)
  })
}

function updateProof (index) {
  setProof('')
  if (!tree) {
    return
  }
  const leaves = tree.getHexLeaves()
  if (!leaves.length) {
    return
  }
  const leaf = leaves[index]
  const proof = tree.getHexProof(leaf)
  console.log('proof:', proof)
  setProof(JSON.stringify(proof, null, 2))
}

function setVerified (verified) {
  $verified.textContent = verified
}

function verify () {
  setVerified('')
  const proof = getVerifyProof()
  const leaf = getVerifyLeaf()
  const root = getVerifyRoot()
  const hashFn = getHashFn()
  const verified = window.MerkleTree.verify(proof, leaf, root, hashFn, options)
  setVerified(`${verified}`)
}

// getters

function getHashType () {
  const $hash = document.querySelector('input[name="hash"]:checked')
  return $hash.value.trim()
}

function getHashFn () {
  const key = getHashType()
  return hashFns[key]
}

function getDefaultFillHashInput () {
  return $fillDefaultHash.value.trim()
}

function getInputValue (value) {
  return $input.value.trim()
}

function getVerifyProof () {
  return parseInput($verifyProof.value.trim())
}

function getVerifyLeaf () {
  return $verifyLeaf.value.trim()
}

function getVerifyRoot () {
  return $verifyRoot.value.trim()
}

// setters

function setHashType (value) {
  if (!value) {
    return
  }
  const $hash = document.querySelector(`input[name="hash"][value="${value}"]`)
  if (!$hash) {
    return
  }
  $hash.checked = true
}

function setInputValue (value, onlySave) {
  if (!onlySave) {
    $input.value = value
  }
  try {
    localStorage.setItem('input', value)
  } catch (err) {
    console.error(err)
  }
}

function setRootValue (value) {
  $root.textContent = value
}

function setLeavesValue (value) {
  $leaves.textContent = value
}

function setLayersValue (value) {
  $layers.textContent = value
}

function setFlatLayersValue (value) {
  $flatLayers.textContent = value
}

function setTreeValue (value) {
  $tree.innerText = value
}

function setHashValue (value) {
  try {
    localStorage.setItem('hash', value)
  } catch (err) {
    console.error(err)
  }
}

function setOptionValue (key, enabled, onlySave) {
  try {
    if (!onlySave) {
      var $option = document.querySelector(`input[name="option"][id="${key}"]`)
      if ($option) {
        $option.checked = enabled
      }
    }
    options[key] = enabled
    localStorage.setItem('options', JSON.stringify(options))
    toggleFillDefaultHashView()
  } catch (err) {
    console.error(err)
  }
}

function setFillDefaultHash (value, onlySave) {
  if (!onlySave) {
    $fillDefaultHash.value = value
  }
  try {
    localStorage.setItem('fillDefaultHash', value)
  } catch (err) {
    console.error(err)
  }
}

function setProof (value) {
  $proof.textContent = value
}

function setVerifyProof (value, onlySave) {
  if (!onlySave) {
    $verifyProof.value = value
  }
  try {
    localStorage.setItem('verifyProof', value)
  } catch (err) {
    console.error(err)
  }
}

function setVerifyLeaf (value, onlySave) {
  if (!onlySave) {
    $verifyLeaf.value = value
  }
  try {
    localStorage.setItem('verifyLeaf', value)
  } catch (err) {
    console.error(err)
  }
}

function setVerifyRoot (value, onlySave) {
  if (!onlySave) {
    $verifyRoot.value = value
  }
  try {
    localStorage.setItem('verifyRoot', value)
  } catch (err) {
    console.error(err)
  }
}

function toggleFillDefaultHashView () {
  if (options.fillDefaultHash) {
    $fillDefaultHashView.style.display = 'block'
  } else {
    $fillDefaultHashView.style.display = 'none'
  }
}

// event listeners

$form.addEventListener('submit', function (event) {
  event.preventDefault()
  compute()
})

$verifyForm.addEventListener('submit', function (event) {
  event.preventDefault()
  verify()
})

$input.addEventListener('input', function (event) {
  event.preventDefault()
  const value = event.target.value.trim()
  setInputValue(value, true)
})

var $hashes = document.querySelectorAll('input[name="hash"]')
$hashes.forEach(function ($hash) {
  $hash.addEventListener('change', function (event) {
    event.preventDefault()
    const value = event.target.value.trim()
    setHashValue(value)
  })
})

$options.forEach(function ($option) {
  $option.addEventListener('change', function (event) {
    event.preventDefault()
    const value = event.target.value.trim()
    const checked = event.target.checked
    setOptionValue(value, checked, true)
  })
})

$fillDefaultHash.addEventListener('input', function (event) {
  event.preventDefault()
  const value = event.target.value.trim()
  setFillDefaultHash(value)
})

$addressZero.addEventListener('click', function (event) {
  event.preventDefault()
  setFillDefaultHash(addressZero)
})

$hashAddressZero.addEventListener('click', function (event) {
  event.preventDefault()
  const $hash = document.querySelector('input[name="hash"]:checked')
  const hash = hashFns[$hash.value]
  const result = '0x' + hash(addressZero).toString('hex')
  setFillDefaultHash(result)
})

$leaveSelect.addEventListener('change', function (event) {
  event.preventDefault()
  updateProof(Number(event.target.value.trim()))
})

$verifyProof.addEventListener('input', function (event) {
  event.preventDefault()
  const value = event.target.value.trim()
  setVerifyProof(value, true)
})

$verifyLeaf.addEventListener('input', function (event) {
  event.preventDefault()
  const value = event.target.value.trim()
  setVerifyLeaf(value, true)
})

$verifyRoot.addEventListener('input', function (event) {
  event.preventDefault()
  const value = event.target.value.trim()
  setVerifyRoot(value, true)
})

// init

function load () {
  try {
    const value = localStorage.getItem('input')
    if (value) {
      setInputValue(value)
    }
  } catch (err) {
    console.error(err)
  }
  try {
    const value = localStorage.getItem('hash')
    if (value) {
      setHashType(value)
    }
  } catch (err) {
    console.error(err)
  }
  try {
    const value = JSON.parse(localStorage.getItem('options'))
    if (value) {
      options = value
    }
    for (const option in options) {
      setOptionValue(option, options[option])
    }
  } catch (err) {
    console.error(err)
  }
  try {
    const value = localStorage.getItem('fillDefaultHash')
    if (value) {
      setFillDefaultHash(value)
    }
  } catch (err) {
    console.error(err)
  }
  try {
    const value = localStorage.getItem('verifyProof')
    if (value) {
      setVerifyProof(value)
    }
  } catch (err) {
    console.error(err)
  }
  try {
    const value = localStorage.getItem('verifyLeaf')
    if (value) {
      setVerifyLeaf(value)
    }
  } catch (err) {
    console.error(err)
  }
  try {
    const value = localStorage.getItem('verifyRoot')
    if (value) {
      setVerifyRoot(value)
    }
  } catch (err) {
    console.error(err)
  }
}

function main () {
  load()
  toggleFillDefaultHashView()
  compute()
}

main()
