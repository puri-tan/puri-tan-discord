class RegexFormatter {
    #accentuationMap = {
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
      'õ': '[õ|o]'
    }

    #ignoreAccentuations(expr) {
        for (const searchValue in this.#accentuationMap) {
            const regex = new RegExp(searchValue, "ig")
            const replaceValue = this.#accentuationMap[searchValue]

            expr = expr.replace(regex, replaceValue)
        }
        
        return expr
    }

    #formatSpaces(expr) {
        return expr.replace(" ", "\\s+")
    }

    format(expr) {
        return this.#formatSpaces(this.#ignoreAccentuations(expr.toLowerCase()))
    }
}

export { RegexFormatter }