const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    name: String
});

module.exports.Test = mongoose.model('Test', testSchema)