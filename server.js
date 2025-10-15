const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs'); // 🔧 nuovo modulo

const token = '7217970559:AAE3KxPk_RgMv6m8TmpE4UpaYLSJCCAJFfc'; // 🔐 inserisci il tuo token
const bot = new TelegramBot(token, { polling: true });

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'));

// 🔧 API per ottenere l'ultima immagine
app.get('/api/last-image', (req, res) => {
  fs.readFile('lastImage.txt', 'utf8', (err, data) => {
    if (err || !data) {
      return res.json({ image: 'default.jpg' }); // se non esiste, mostra default
    }
    res.json({ image: data.trim() });
  });
});

// 🔧 Salva l'immagine in un file
function saveLastImage(imageName) {
  fs.writeFile('lastImage.txt', imageName, (err) => {
    if (err) console.error('Errore nel salvataggio:', err);
  });
}

// 🔁 Ricezione messaggi Telegram
bot.on('message', (msg) => {
  const text = msg.text?.toLowerCase();
  if (!text) return;

  if (text.includes('aperto')) {
    io.emit('changeImage', 'open.jpg');
    saveLastImage('open.jpg'); // 🔧 salva
  } else if (text.includes('chiuso')) {
    io.emit('changeImage', 'closed.jpg');
    saveLastImage('closed.jpg'); // 🔧 salva
  }
});

server.listen(port, () => {
  console.log(`Server avviato su porta ${port}`);
});
