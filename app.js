const dotenv = require('dotenv')
const { Client } = require('discord.js')
const { readBibleMessageIfReferenceExists } = require('./bible-message-reader.js')
const BibleApiClient = require('./bible-api-client.js')

dotenv.config()

const client = new Client()

const config = {
  baseURL: process.env.BIBLE_API_URL,
  token: process.env.BIBLE_API_TOKEN,
  defaultVersion: process.env.BIBLE_DEFAULT_VERSION
}

var bibleApiClient = new BibleApiClient(config)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', async message => {
  await readBibleMessageIfReferenceExists(bibleApiClient, message, { thumbnailUrl: process.env.BIBLE_THUMBNAIL_URL })
})

client.login(process.env.BOT_TOKEN)
