const mongoose = require('mongoose');

const lastUp = new mongoose.Schema({
    lastUp: String
});

module.exports.LastUp = mongoose.model('lastUp', lastUp, 'lastUp')