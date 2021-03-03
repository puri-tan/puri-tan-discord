const dotenv = require('dotenv')
const { Client } = require('discord.js')
const { readBibleMessageIfReferenceExists } = require('./modules/read-bible-message')
const BibleApiClient = require('@puri-tan/bible-api-client')

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
  let options = {
    thumbnailUrl: process.env.BIBLE_THUMBNAIL_URL,
    adminId: process.env.ADMIN_ID
  }
  await readBibleMessageIfReferenceExists(bibleApiClient, message, options)
})

client.login(process.env.BOT_TOKEN)
