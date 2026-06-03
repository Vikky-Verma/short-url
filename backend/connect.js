const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function connectToMongoDB(url) {
    return mongoose.connect(url);
}

module.exports = { connectToMongoDB };