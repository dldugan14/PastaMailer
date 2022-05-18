import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    active: Boolean,
})

export const Users = mongoose.model('user', userSchema, 'users')