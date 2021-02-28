const { ignoreAccentuations } = require('./formatters.js')

const accentuationMap = {
  'á': '[á|a]',
  'à': '[à|a]',
  'é': '[é|e]',
  'í': '[í|i]',
  'ó': '[ó|o]',
  'ú': '[ú|u]',
  'â': '[â|a]',
  'ê': '[ê|e]',
  'î': '[î|i]',
  'ô': '[ô|o]',
  'û': '[û|u]',
  'ã': '[ã|a]',
  'õ': '[õ|o]',
  'ç': '[ç|c]'
}

const formatSpaces = expr => {
  return expr.replace(/\s/g, '\\s+')
}

module.exports.formatRegex = expr => {
  return formatSpaces(ignoreAccentuations(expr.toLowerCase(), accentuationMap))
}
