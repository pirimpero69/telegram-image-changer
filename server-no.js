const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const token = '7217970559:AAE3KxPk_RgMv6m8TmpE4UpaYLSJCCAJFfc';
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Inserisci il tuo dominio pubblico HTTPS (Render)
const WEBHOOK_URL = 'https://notamsgt.onrender.com';

const bot = new TelegramBot(token, { webHook: { port: process.env.PORT || 3000 } });

// Imposta il webhook all’avvio
bot.setWebHook(`${WEBHOOK_URL}/bot${token}`);

// Middleware per ricevere update dal webhook
app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Serve la cartella pubblica con l’HTML
app.use(express.static(path.join(__dirname, 'public')));

// API per fornire l'ultima immagine salvata
app.get('/api/last-image', (req, res) => {
  fs.readFile('lastImage.txt', 'utf8', (err, data) => {
    if (err || !data) {
      return res.json({ image: 'default.jpg' });
    }
    res.json({ image: data.trim() });
  });
});

// Salva il nome dell'ultima immagine
function saveLastImage(imageName) {
  fs.writeFile('lastImage.txt', imageName, (err) => {
    if (err) console.error('Errore nel salvataggio:', err);
  });
}

// Logica dei comandi Telegram
bot.on('message', (msg) => {
  const text = msg.text?.toLowerCase();
  if (!text) return;

  if (text.includes('apri') || text.includes('apri')) {
    io.emit('changeImage', 'open.jpg');
    saveLastImage('open.jpg');
  } else if (text.includes('chiudi') || text.includes('chiudi')) {
    io.emit('changeImage', 'closed.jpg');
    saveLastImage('closed.jpg');
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Utente connesso al sito web');
});
