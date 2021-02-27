import axios from 'axios'
import booksByAbbrev from './bible-books-by-abbrev.js'
import booksByName from './bible-books-by-name.js'
import bookChapters from './bible-book-chapters.js'
import formatRegex from './regex-formatter.js'
import formatString from './string-formatter.js'

class BibleApiClient {
  #defaultVersion = 'nvi'
  #client = null
  #versesRegex = null
  #bookMatches = {}

  constructor(config) {
    this.#defaultVersion = config.defaultVersion

    this.#client = axios.create({
      baseURL: config.baseURL,
      headers: { 'Authentication': 'Bearer ' + config.token }
    })

    for (const bookName in booksByName) {
      const formattedName = formatString(bookName)
      this.#bookMatches[formattedName] = booksByName[bookName]
    }

    const bookNamesRegex = formatRegex(Object.keys(booksByName).join('|'))
    const booksRegex = '(?<BookName>' + bookNamesRegex + ')'
    const versesRegex = '(^|\\s|,|;)' + booksRegex + '\\s+(?<Chapter>\\d+)(\\s*:\\s*(?<FromVerse>\\d+)(\\s*-\\s*(?<ToVerse>\\d+))?)?'

    this.#versesRegex = new RegExp(versesRegex, 'gim')
  }

  async #findChapter(bookAbbrev, chapter) {
    const url = `/verses/${this.#defaultVersion}/${bookAbbrev}/${chapter}`

    try {
      const response = await this.#client.get(url)

      if (response.status != 200) {
        console.log(`Error calling Bible API on "${url}". ${response.status}: ${response.data}`)
        return null
      }

      return response.data
    }
    catch (error) {
      console.log(`Error calling Bible API on "${url}". ${error}`)
      return null
    }
  }

  async #findVerse(bookAbbrev, chapter, verse) {
    const url = `/verses/${this.#defaultVersion}/${bookAbbrev}/${chapter}/${verse}`

    try {
      const response = await this.#client.get(url)

      if (response.status != 200) {
        console.log(`Error calling Bible API on "${url}". ${response.status}: ${response.data}`)
        return null
      }

      return response.data
    }
    catch (error) {
      console.log(`Error calling Bible API on "${url}". ${error}`)
      return null
    }
  }

  async findVersesFromGroup(group) {
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
          // Reads a group of specified verses
          for (var verse = group.FromVerse; verse <= group.ToVerse; verse++) {
            const response = await this.#findVerse(bookAbbrev, group.Chapter, verse)
            result.verses.push({ verse: response.verse, text: response.text })
          }
        }
      } else if (group.FromVerse) {
        // Reads one verse
        if (group.FromVerse >= 1) {
          const response = await this.#findVerse(bookAbbrev, group.Chapter, group.FromVerse)
          result.verses.push({ verse: response.verse, text: response.text })
        }
      }
      else {
        // Reads an entire chapter
        const response = await this.#findChapter(bookAbbrev, group.Chapter)
        for (var verse of response.verses) {
          result.verses.push({ verse: verse.number, text: verse.text })
        }
      }

      return result
    }
  }

  async getVersesFromMessage(message) {
    const groups = [...message.matchAll(this.#versesRegex)].map(x => x.groups)
    const responses = []

    for (const group of groups) {
      const response = await this.findVersesFromGroup(group)
      responses.push(response)
    }

    return responses
  }
}

export { BibleApiClient }
