const ignoreAccentuations = (expr, accentuationMap) => {
  for (const searchValue in accentuationMap) {
    const regex = new RegExp(searchValue, "ig")
    const replaceValue = accentuationMap[searchValue]

    expr = expr.replace(regex, replaceValue)
  }

  return expr
}

export default ignoreAccentuations
