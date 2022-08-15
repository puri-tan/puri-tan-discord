const { MessageEmbed } = require("discord.js")

const maxMessageSize = 2048

const groupVerses = response => {
  const text = {
    bookName: response.bookName,
    chapter: response.chapter,
    parts: []
  }

  if (response.verses.length == 1) {
    text.parts.push({ fromVerse: response.verses[0].number, text: response.verses[0].text })
    return text
  }

  let actualPart = null

  for (let verse of response.verses) {
    let prefix = `**${verse.number}**`

    if (actualPart) {
      let neededSpace = prefix.length + 2

      if (actualPart.text.length + verse.text.length + neededSpace <= maxMessageSize) {
        actualPart.toVerse = verse.number
        actualPart.text = `${actualPart.text} ${prefix} ${verse.text}`
      } else {
        text.parts.push(actualPart)
        actualPart = { fromVerse: verse.number, toVerse: undefined, text: `${prefix} ${verse.text}` }
      }
    } else {
      actualPart = { fromVerse: verse.number, toVerse: undefined, text: `${prefix} ${verse.text}` }
    }
  }

  if (actualPart) {
    text.parts.push(actualPart)
  }

  return text
}

module.exports.readBibleMessageIfReferenceExists = async (bibleApiClient, message, options) => {
  if (!message.author.bot && message.channel) {
    const groups = bibleApiClient.matchVersesFromMessage(message.content)

    if (groups.length > 0) {
      message.react('👀').catch(e => console.error(e))
      message.channel.sendTyping().catch(e => console.error(e))

      const response = await bibleApiClient.pullVersesFromMatch(groups)
      const errors = response.filter(x => x.error).map(x => x.error)

      for (let error of errors) {
        if (error == 'NotFound') {
          message.react('😐')
            .catch(e => console.error(e))
          message.channel.send(`Parece que você postou um trecho bíblico na sua mensagem, <@${message.author.id}>. Mas não achei ele... A referência está certa? 😐`)
            .catch(e => console.error(e))
        } else if (error == 'UnexpectedResponse') {
          message.react('😖')
            .catch(e => console.error(e))
          message.channel.send(`Parece que você postou um trecho bíblico na sua mensagem, <@${message.author.id}>. Mas a API da Bíblia que eu uso pra ler me deu uma resposta que eu não entendi. Talvez a API esteja com problemas no momento. Desculpa! 😔`)
            .catch(e => console.error(e))
        } else if (error == 'InvalidChapter') {
          message.react('🤨')
            .catch(e => console.error(e))
          message.channel.send(`Parece que você postou um trecho bíblico na sua mensagem, <@${message.author.id}>. Mas não achei o capítulo... A referência está certa? 🤨`)
            .catch(e => console.error(e))
        } else if (error == 'Failure') {
          message.react('🤯')
            .catch(e => console.error(e))
          message.channel.send(`AH! Aconteceu um erro no meu sistema. Socorro, <@${options.adminId}>! Verifique meus logs, por favor! 😖`)
            .catch(e => console.error(e))
        }

        console.error(error)
        return;
      }

      const texts = response.map(groupVerses)

      for (let text of texts) {
        for (let partIndex = 0; partIndex < text.parts.length; partIndex++) {
          let toVerse = text.parts[partIndex].toVerse ? `-${text.parts[partIndex].toVerse}` : ''
          let reply =
            partIndex == 0
              ? text.parts.length > 1
                ? `Parece que você postou um trecho bíblico um tanto longo na sua mensagem, <@${message.author.id}>!\nVou ler ele em partes pra você, aqui vai a parte ${partIndex + 1}!`
                : `Parece que você postou um trecho bíblico na sua mensagem, <@${message.author.id}>. Vou ler ele pra você!`
              : `Aqui vai a parte ${partIndex + 1} do texto bíblico que você postou, <@${message.author.id}>!`

          let embed = new MessageEmbed()
            .setTitle(`${text.bookName} ${text.chapter}:${text.parts[partIndex].fromVerse}${toVerse}`)
            .setDescription(text.parts[partIndex].text)
            .setThumbnail(options.thumbnailUrl)

          await message.channel.send({ content: reply, embeds: [embed] })
        }
      }
    }
  }
}
