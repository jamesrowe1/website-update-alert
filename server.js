// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const websiteUrl = 'https://example.com';
let previousContent = '';

io.on('connection', (socket) => {
  console.log('A client connected');

  // Send the previous content on initial connection
  socket.emit('initialContent', previousContent);
});

// Monitor website for updates
async function checkWebsiteForUpdates() {
  try {
    const response = await axios.get(websiteUrl);
    const $ = cheerio.load(response.data);
    const currentContent = $('body').html();

    if (currentContent !== previousContent) {
      previousContent = currentContent;
      io.emit('websiteUpdate', currentContent);
    }
  } catch (error) {
    console.error('Error checking website for updates:', error.message);
  }
}

setInterval(checkWebsiteForUpdates, 60000); // Check every minute

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
