const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const Discord = require('discord.js');
const client = new Discord.Client();

CHAMALANE_TOKEN = process.env.CHAMALANE_TOKEN;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong! ||' + Math.floor(client.ping) + ' ms||');
  }
  if (msg.content === 'hi') {
    msg.reply('bye')
  }
  if (msg.content === '이덴' || msg.content === '말덴') {
    msg.channel.send('조아');
  }
  if (msg.content === '일해라') {
    msg.channel.send('2019년 최저 시급은 8,350원입니다.');
  }
});

client.login(CHAMALANE_TOKEN);

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/helloworld', (req, res) => res.render('pages/helloworld'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
