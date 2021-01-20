
const mongoose = require('mongoose');
const channeldb = new mongoose.Schema({
    serverID: { type: String, required: true},
    channelID: { type: String, required: true},
    reason: { type: String, required: true},
})
const ChannelModel = module.exports = mongoose.model('channels', channeldb)