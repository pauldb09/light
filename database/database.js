const mongoose = require('mongoose');
module.exports = mongoose.connect('mongodb+srv://light-bot:LJS2020MPU@cluster0.72rc3.gcp.mongodb.net/lightbot?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
