const mongoose = require('mongoose');

const lastUp = new mongoose.Schema({
    lastUp: Number
});

module.exports.LastUp = mongoose.model('lastUp', lastUp, 'lastUp')