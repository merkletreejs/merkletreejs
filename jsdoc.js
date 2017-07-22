const jsdoc2md = require('jsdoc-to-markdown')

jsdoc2md.render({
  files: 'index.js',
  separators: true
})
.then(data => {
  console.log(data)
})
