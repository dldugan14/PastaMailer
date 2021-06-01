const mongoose = require('mongoose');
const { Schema } = mongoose;

const rotationSchema = new Schema({
    rotation: [{
        names: String,
        id: String,
        rotationPosition: Number,
        skip: Boolean,
        active: Boolean
    }],
    lastUp: String,
    updated: { type: Date, default: Date.now },
})

module.exports.rotation = mongoose.model('rotation', rotationSchema, 'Rotation')