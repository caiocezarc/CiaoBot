const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');
const { TOKEN_DISCORD, GOOGLE_KEY } = require('./config.js');
const youtube = new Youtube(GOOGLE_KEY);
const client = new Discord.Client();

const comandoBot = "~";
let filaDeMusica = [];

client.login(TOKEN_DISCORD);

client.on('ready', () => {
  console.log('Funcionando...')
})
// messagem de boas vindas
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if (!channel) return;
  channel.send(`Bem vindo ${member} !`)
})

// coloca música por URL e pesquisa no youtube
client.on('message', async message => {
  if (!message.guild) return;
    
  if (message.content.startsWith(`${comandoBot}leave`)) {
    if (message.member.voice.channel) {
      message.member.voice.channel.leave();
    }
  }
  if (message.content.startsWith(`${comandoBot}play`)) {

    if (message.member.voice.channel) {
      await message.member.voice.channel.join();
      const tocar = message.content.replace(`${comandoBot}play`, '');
      try {
        let video = await youtube.getVideo(tocar);
        msg.channel.send(`Vídeo encontrado : ${video.title}`);
        filaDeMusica.push(tocar)
        if (filaDeMusica.length === 1) {
          tocarMusica(message);
        }

      } catch (error) {
        try {
          let videosPesquisados = await youtube.searchVideos(tocar, 5)
          let videosEncontrado;
          for (i in videosPesquisados) {
            videosEncontrado = await youtube.getVideoByID(videosPesquisados[i].id)
            message.channel.send(`${i}: ${videosEncontrado.title}`)
          }
          message.channel.send({
            embed: {
              color: 3447003,
              description: 'Escolha uma música de 0 a 4 clicando nas reações !'
            }
          }).then(async (embedMessage) => {
            await embedMessage.react('0️⃣');
            await embedMessage.react('1️⃣');
            await embedMessage.react('2️⃣');
            await embedMessage.react('3️⃣');
            await embedMessage.react('4️⃣');

            const filter = (reaction, user) => {
              return ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣'].includes(reaction.emoji.name)
                && user.id == message.author.id;
            }

            let collector = embedMessage.createReactionCollector(filter, { time: 20000 })

            collector.on('collect', async (reaction, reactionCollector) => {
              if (reaction.emoji.name === '0️⃣') {
                message.channel.send('Reagiu com 0️⃣')
                videosEncontrado = await youtube.getVideoByID(videosPesquisados[0].id)
                filaDeMusica.push(`https://www.youtube.com/watch?v=${videosEncontrado.id}`)
              }
              else if (reaction.emoji.name === '1️⃣') {
                message.channel.send('Reagiu com 1️⃣')
                videosEncontrado = await youtube.getVideoByID(videosPesquisados[1].id)
                filaDeMusica.push(`https://www.youtube.com/watch?v=${videosEncontrado.id}`)
              }
              else if (reaction.emoji.name === '2️⃣') {
                message.channel.send('Reagiu com 2️⃣')
                videosEncontrado = await youtube.getVideoByID(videosPesquisados[2].id)
                filaDeMusica.push(`https://www.youtube.com/watch?v=${videosEncontrado.id}`)
              }
              else if (reaction.emoji.name === '3️⃣') {
                message.channel.send('Reagiu com 3️⃣')
                videosEncontrado = await youtube.getVideoByID(videosPesquisados[3].id)
                filaDeMusica.push(`https://www.youtube.com/watch?v=${videosEncontrado.id}`)
              }
              else if (reaction.emoji.name === '4️⃣') {
                message.channel.send('Reagiu com 4️⃣')
                videosEncontrado = await youtube.getVideoByID(videosPesquisados[4].id)
                filaDeMusica.push(`https://www.youtube.com/watch?v=${videosEncontrado.id}`)
              }
              if (filaDeMusica.length === 1) {
                tocarMusica(message);
              }
            })

          });
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  async function tocarMusica(message) {
    const connection = await message.member.voice.channel.join();
    connection.play(ytdl(filaDeMusica[0], { filter: 'audioonly' }))
      .on('end', () => {
        filaDeMusica.shift()
        if (filaDeMusica.length >= 1) {
          tocarMusica(message)
        }
      });
  }
  //kickar membro
  if (message.content.startsWith(`${comandoBot}kick`)) {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick('processando...')
          .then(() => {
            message.reply(`kikado com sucesso ${user.tag}`)
          })
          .catch(err => {
            message.reply('não tenho permissão para isso.')
            console.log(err)
          })
      }
    }
  }

  //banir membro
  if (message.content.startsWith(`${comandoBot}ban`)) {
    const user = message.mentions.users.first();
    if (user) {
      member = message.guild.member(user)
      if (member) {
        member
          .ban({ days: 3, reason: 'mereceu' })
          .then(() => {
            message.reply(`banido com sucesso ${user.tag}`)
          })
          .catch(err => {
            message.reply('não tenho permissão para isso')
            console.log(err)
          })
      }
    }
  }

});

