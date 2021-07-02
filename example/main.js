var $form = document.getElementById('form')
var $input = document.getElementById('input')
var $fillDefaultHashView = document.getElementById('fillDefaultHashView')
var $fillDefaultHash = document.getElementById('fillDefaultHashValue')
var $addressZero = document.getElementById('addressZero')
var $hashAddressZero = document.getElementById('hashAddressZero')
var $root = document.getElementById('root')
var $leaves = document.getElementById('leaves')
var $layers = document.getElementById('layers')
var $flatLayers = document.getElementById('flatLayers')
var $tree = document.getElementById('tree')

const addressZero = '0x0000000000000000000000000000000000000000000000000000000000000000'
var hashFns = {
  sha256: window.sha256,
  keccak256: window.keccak256
}

function parseInput (value) {
  value = $input.value.trim()
  value = value.replace(/'/gi, '"')
  try {
    return JSON.parse(value)
  } catch (err) {
    return value.split('\n').filter(function (x) { return x })
  }
}

var options = {
  hashLeaves: false,
  sortLeaves: false,
  sortPairs: false,
  duplicateOdd: false,
  isBitcoinTree: false
}

function compute () {
  const value = getInputValue()
  const leaves = parseInput(value)
  const hash = getHashFn()
  const fillDefaultHash = getDefaultFillHashValue()
  const _options = Object.assign({}, options, {
    fillDefaultHash: options.fillDefaultHash ? fillDefaultHash : undefined
  })
  console.log('input leaves:', leaves)
  console.log('hash:', getHashType())
  console.log('options:', _options)
  const tree = new window.MerkleTree(leaves, hash, _options)
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
}

function getHashType () {
  const $hash = document.querySelector('input[name="hash"]:checked')
  return $hash.value
}

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

function getHashFn () {
  const key = getHashType()
  return hashFns[key]
}

function getDefaultFillHashValue () {
  return $fillDefaultHash.value
}

function getInputValue (value) {
  return $input.value
}

function setInputValue (value) {
  $input.value = value
  try {
    localStorage.setItem('input', value)
  } catch (err) {
    console.error(err)
  }
}

function setRootValue (value) {
  $root.value = value
}

function setLeavesValue (value) {
  $leaves.value = value
}

function setLayersValue (value) {
  $layers.value = value
}

function setFlatLayersValue (value) {
  $flatLayers.value = value
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

function setOptionValue (key, enabled) {
  try {
    options[key] = enabled
    localStorage.setItem('options', JSON.stringify(options))
    toggleFillDefaultHashView()
  } catch (err) {
    console.error(err)
  }
}

function setFillDefaultHash (value) {
  $fillDefaultHash.value = value
}

function setDefaultFillHashValue (value) {
  try {
    localStorage.setItem('fillDefaultHash', value)
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

$form.addEventListener('submit', function (event) {
  event.preventDefault()
  compute()
})

$input.addEventListener('input', function (event) {
  const value = event.target.value
  setInputValue(value)
})

var $hashes = document.querySelectorAll('input[name="hash"]')
$hashes.forEach(function ($hash) {
  $hash.addEventListener('change', function (event) {
    const value = event.target.value
    setHashValue(value)
  })
})

var $options = document.querySelectorAll('input[name="option"]')
$options.forEach(function ($option) {
  $option.addEventListener('change', function (event) {
    const value = event.target.value
    const checked = event.target.checked
    setOptionValue(value, checked)
  })
})

$fillDefaultHash.addEventListener('input', function (event) {
  const value = event.target.value
  setFillDefaultHash(value)
})

$addressZero.addEventListener('click', function (event) {
  setFillDefaultHash(addressZero)
})

$hashAddressZero.addEventListener('click', function (event) {
  const $hash = document.querySelector('input[name="hash"]:checked')
  const hash = hashFns[$hash.value]
  const result = '0x' + hash(addressZero).toString('hex')
  setFillDefaultHash(result)
})

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
  } catch (err) {
    console.error(err)
  }
  try {
    const value = localStorage.getItem('fillDefaultHash')
    if (value) {
      setDefaultFillHashValue(value)
    }
  } catch (err) {
    console.error(err)
  }

  toggleFillDefaultHashView()
  compute()
}

load()
