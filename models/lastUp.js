import mongoose from 'mongoose';

const lastUp = new mongoose.Schema({
    lastUp: Number
});

export const LastUp = mongoose.model('lastUp', lastUp, 'lastUp')