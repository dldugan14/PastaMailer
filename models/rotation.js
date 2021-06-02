const mongoose = require('mongoose');
const { Schema } = mongoose;

const rotationSchema = new Schema([{
        names: String,
        id: String,
        rotationPosition: Number,
        skip: Boolean,
        active: Boolean
    }])

module.exports.Rotation = mongoose.model('rotation', rotationSchema, 'rotation')