const mongoose = require('mongoose');
const cmddb = new mongoose.Schema({
    serverID: { type: String, required: true },
    text: { type: String, required: true },
    name: { type: String, required: true },
    channel: { type: String, required: false },
})
const CmdModel = module.exports = mongoose.model('cmd', cmddb)
