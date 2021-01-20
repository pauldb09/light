const mongoose = require('mongoose');
const warndb = new mongoose.Schema({
    manID: { type: String, required: true},
    serverID: { type: String, required: true},
    coun: { type: String, required: true},
    reason: { type: String, required: true},
})
const warnModel = module.exports = mongoose.model('warn', warndb)
