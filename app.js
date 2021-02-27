import dotenv from 'dotenv'
import { Client } from 'discord.js'
import { BibleApiClient } from './bible-api-client.js'

dotenv.config()

const bible = new BibleApiClient({
  baseURL: process.env.BIBLE_API_URL,
  token: process.env.BIBLE_API_TOKEN,
  defaultVersion: process.env.BIBLE_DEFAULT_VERSION
})

const client = new Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', msg => {
  if (!msg.author.bot) {
    bible.getVersesFromMessage(msg.content)
      .then(response => {
        console.log(response)
      })
  }
})

client.login(process.env.BOT_TOKEN)
