const { ignoreAccentuations } = require('./formatters.js')

const accentuationMap = {
  'á': 'a',
  'à': 'a',
  'é': 'e',
  'í': 'i',
  'ó': 'o',
  'ú': 'u',
  'â': 'a',
  'ê': 'e',
  'î': 'i',
  'ô': 'o',
  'û': 'u',
  'ã': 'a',
  'õ': 'o',
  'ç': 'c'
}

const formatSpaces = expr => {
  return expr.replace(/\s/g, '')
}

module.exports.formatString = expr => {
  return formatSpaces(ignoreAccentuations(expr.toLowerCase(), accentuationMap))
}
