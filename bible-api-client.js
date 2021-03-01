const axios = require('axios')
const booksByAbbrev = require('./bible-books-by-abbrev')
const booksByName = require('./bible-books-by-name')
const bookChapters = require('./bible-book-chapters')
const { formatRegex } = require('./regex-formatter')
const { formatString } = require('./string-formatter')
const http = require('http')
const https = require('https')

module.exports = class BibleApiClient {
  #defaultVersion = 'nvi'
  #client = null
  #versesRegex = null
  #bookMatches = {}

  constructor(config) {
    this.#defaultVersion = config.defaultVersion

    const httpAgent = new http.Agent({ keepAlive: true })
    const httpsAgent = new https.Agent({ keepAlive: true })

    const defaultHeaders = {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/json',
      'User-Agent': 'Puri-tan/1.0'
    }

    this.#client = axios.create({
      httpAgent: httpAgent,
      httpsAgent: httpsAgent,
      baseURL: config.baseURL,
      headers: defaultHeaders
    })

    for (const bookName in booksByName) {
      const formattedName = formatString(bookName)
      this.#bookMatches[formattedName] = booksByName[bookName]
    }

    const bookNamesRegex = formatRegex(Object.keys(booksByName).join('|'))
    const booksRegex = '(?<BookName>' + bookNamesRegex + ')'
    const versesRegex = '(^|\\s|,|;)' + booksRegex + '\\s+(?<Chapter>\\d+)(\\s*(:|.)\\s*(?<FromVerse>\\d+)(\\s*-\\s*(?<ToVerse>\\d+))?)?'

    this.#versesRegex = new RegExp(versesRegex, 'gim')
  }

  async #callUrl(url) {
    try {
      const response = await this.#client.get(url, { validateStatus: false })

      if (response.status == 404) {
        console.log(`404 Not Found on Bible API at endpoint "${url}".`)
        return { error: 'NotFound' }
      }

      if (response.status != 200) {
        console.log(`Error ${response.status} calling Bible API at endpoint "${url}".`)
        return { error: 'UnexpectedResponse' }
      }

      return response.data
    }
    catch (error) {
      console.log(`Unexpected error when calling Bible API at endpoint "${url}". ${error}`)
      return { error: 'Failure' }
    }
  }

  async #findChapter(bookAbbrev, chapter) {
    const url = `/verses/${this.#defaultVersion}/${bookAbbrev}/${chapter}`
    return await this.#callUrl(url)
  }

  async #findVerse(bookAbbrev, chapter, verse) {
    const url = `/verses/${this.#defaultVersion}/${bookAbbrev}/${chapter}/${verse}`
    return await this.#callUrl(url)
  }

  async #findVersesFromGroup(group) {
    const formattedName = formatString(group.BookName)
    const bookAbbrev = this.#bookMatches[formattedName]
    const bookChapterCount = bookChapters[bookAbbrev]

    const result = {
      bookName: booksByAbbrev[bookAbbrev],
      chapter: group.Chapter,
      fromVerse: group.FromVerse,
      toVerse: group.ToVerse,
      verses: []
    }

    if (group.Chapter >= 1 && group.Chapter <= bookChapterCount) {
      if (group.FromVerse && group.ToVerse) {
        if (group.FromVerse >= 1 && group.ToVerse >= 1 && group.FromVerse <= group.ToVerse) {
          for (var verse = group.FromVerse; verse <= group.ToVerse; verse++) {
            const response = await this.#findVerse(bookAbbrev, group.Chapter, verse)
            if (response.error) {
              result.error = response.error
              return result
            } else {
              result.verses.push({ number: response.number, text: response.text })
            }
          }
        }
      } else if (group.FromVerse) {
        if (group.FromVerse >= 1) {
          const response = await this.#findVerse(bookAbbrev, group.Chapter, group.FromVerse)
          if (response.error) {
            result.error = response.error
          } else {
            result.verses.push({ number: response.number, text: response.text })
          }
        }
      }
      else {
        const response = await this.#findChapter(bookAbbrev, group.Chapter)
        for (var verse of response.verses) {
          if (response.error) {
            result.error = response.error
          } else {
            result.verses.push({ number: verse.number, text: verse.text })
          }
        }
      }
    } else {
      result.error = 'InvalidChapter'
    }

    return result
  }

  matchVersesFromMessage(message) {
    return [...message.matchAll(this.#versesRegex)].map(x => x.groups)
  }

  async pullVersesFromMatch(groups) {
    const responses = []

    for (const group of groups) {
      const response = await this.#findVersesFromGroup(group)
      responses.push(response)
    }

    return responses
  }
}
