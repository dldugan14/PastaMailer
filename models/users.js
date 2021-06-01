const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    active: Boolean,
})

module.exports.Users = mongoose.model('user', userSchema, 'users')