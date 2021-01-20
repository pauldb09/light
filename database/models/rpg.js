const mongoose = require('mongoose');
const rrdb = new mongoose.Schema({
    serverID: { type: String, required: true },
    nom: { type: String, required: true },
    cout: { type: String, required: true },
   von: { type: String, required: true },

})
const shoprpg = module.exports = mongoose.model('rpg', rrdb)
