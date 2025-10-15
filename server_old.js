const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// 🔑 Inserisci il tuo token qui
const token = '7217970559:AAE3KxPk_RgMv6m8TmpE4UpaYLSJCCAJFfc';

const bot = new TelegramBot(token, { polling: true });

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve la pagina web
app.use(express.static('public'));

// Quando ricevi un messaggio nel gruppo
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log(`Messaggio ricevuto: ${text}`);

  // Esempio: cambia immagine se il messaggio contiene "cane"
  if (text.toLowerCase().includes('aperto')) {
    io.emit('changeImage', 'open.jpg');
  } else if (text.toLowerCase().includes('chiuso')) {
    io.emit('changeImage', 'closed.jpg');
  }
});

server.listen(3000, () => {
  console.log('Server avviato su http://localhost:3000');
});
