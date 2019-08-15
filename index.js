const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express()

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require("connect-flash");
var session = require("express-session");
var passport = require('./config/passport');

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
db.once("open", function () {
  console.log("DB connected");
});
db.on("error", function (err) {
  console.log("DB ERROR : ", err);
});

// Discord BOT setting
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
  client.user.setActivity('일', { type: 'PLAYING' });
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
    const player = pubgClient.getPlayer({ name: statArray[2] })
    msg.channel.send(player.id);
  }
});

client.login(CHAMALANE_TOKEN);

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb'  }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({ secret: process.env.SESSION_KEY, resave: true, saveUninitialized: true }));

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
})

app.use('/', require('./routes/main'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
