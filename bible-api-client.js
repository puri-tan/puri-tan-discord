import axios from 'axios'
import bookMatches from './bible-book-matches.js'
import { RegexFormatter } from './regex-formatter.js'

class BibleApiClient {
    #defaultVersion = 'nvi'
    #maxMessageLength = 2048
    #client = null
    #verseRegex = null
    #regexFormatter = new RegexFormatter()

    constructor(config) {
        this.#defaultVersion = config.defaultVersion
        
        this.#client = axios.create({
            baseURL: config.baseURL,
            headers: {
                'Authentication': 'Bearer ' + config.token,
                'Content-Type': 'application/json'
            }
        })

        const matches = []

        for (const key in bookMatches)
            matches.push(key)

        const expr = '(^|\\s|,|;)(?<BookName>' + matches.join('|') + ')\\s+(?<Chapter>\\d+)(?<Verses>\\s*:\\s*(?<FromVerse>\\d+)(\\s*-\\s*(?<ToVerse>\\d+))?)?'

        this.#verseRegex = new RegExp(this.#regexFormatter.format(expr), "ig")
    }
}

export { BibleApiClient }