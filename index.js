const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const Discord = require('discord.js');
const client = new Discord.Client();

// TOKEN of CHAMALANE BOT
CHAMALANE_TOKEN = process.env.CHAMALANE_TOKEN;

// KEY of PUBG API
PUBG_KEY = process.env.PUBG_API_KEY;

const pubg = require('pubg.js');
const pubgClient = new pubg.Client(PUBG_KEY, 'kakao');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('일', { type : 'PLAYING' });
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'ping') {
    msg.reply('Pong! ||' + Math.floor(client.ping) + ' ms||');
  }
  if (msg.content === 'hi') {
    msg.reply('bye')
  }
  if (msg.content === '이덴' || msg.content === '말덴') {
    msg.channel.send('조아');
  }
  if (msg.content === '일해라') {
    if (msg.author.tag === 'iDen#4027') {
      msg.channel.send('네 주인님');
    }
    else {
      msg.channel.send('2019년 최저 시급은 8,350원입니다.');
    }
  }
  if (msg.content.startsWith('배그 스탯 ')) {
    var statArray = msg.content.split(' ');
    const player = pubgClient.getPlayer({name: statArray[2]})
    msg.channel.send(player.id);
  }
});

client.login(CHAMALANE_TOKEN);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/helloworld', (req, res) => res.render('pages/helloworld'))
  .get('/hub', (req, res) => res.render('pages/hub'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
