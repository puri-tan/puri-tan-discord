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
      // Prefix will be between actual verse and previous verses
      // We need one space before and after to measure message length, so we can
      // avoid building a message which length is more than Discord's maximum message length
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

const readBibleMessage = async (bibleApiClient, message, options) => {
  if (!message.author.bot && message.channel) {
    const groups = bibleApiClient.matchVersesFromMessage(message.content)
    if (groups.length > 0) {
      message.react('👀')
      message.channel.startTyping()
      try {
        const response = await bibleApiClient.pullVersesFromMatch(groups)
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
            await message.channel.send(reply, {
              embed: {
                title: `${text.bookName} ${text.chapter}:${text.parts[partIndex].fromVerse}${toVerse}`,
                description: text.parts[partIndex].text,
                thumbnail: { url: options.thumbnailUrl }
              }
            })
          }
        }
      } finally {
        message.channel.stopTyping()
      }
    }
  }
}

export default readBibleMessage
