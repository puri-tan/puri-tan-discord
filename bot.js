const dotenv = require('dotenv')
const { Client, Intents } = require('discord.js')
const { readBibleMessageIfReferenceExists } = require('./modules/read-bible-message')
const BibleApiClient = require('@puri-tan/bible-api-client')

dotenv.config()

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_INTEGRATIONS
  ]
})

const config = {
  baseURL: process.env.BIBLE_API_URL,
  token: process.env.BIBLE_API_TOKEN,
  defaultVersion: process.env.BIBLE_DEFAULT_VERSION
}

var bibleApiClient = new BibleApiClient(config)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('messageCreate', async message => {
  let options = {
    thumbnailUrl: process.env.BIBLE_THUMBNAIL_URL,
    adminId: process.env.ADMIN_ID
  }

  await readBibleMessageIfReferenceExists(bibleApiClient, message, options)
})

client.login(process.env.BOT_TOKEN)
