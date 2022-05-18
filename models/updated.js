import mongoose from 'mongoose';

const updated = new mongoose.Schema({
    updated: String
});

export const Updated = mongoose.model('updated', updated, 'updated')