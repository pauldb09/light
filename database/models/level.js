const mongoose = require('mongoose');
const leveldb = new mongoose.Schema({
    serverID: { type: String, required: false },
    userID: { type: String, required: false },
    xp: { type: String, required: false },
    level: { type: String, required: false },
    messagec: { type: String, required: false },

})
const levelModel = module.exports = mongoose.model('level', leveldb)
