const mongoose = require('mongoose');

const updated = new mongoose.Schema({
    updated: String
});

module.exports.Updated = mongoose.model('updated', updated, 'updated')