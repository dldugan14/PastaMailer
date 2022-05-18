import mongoose from 'mongoose';
const { Schema } = mongoose;

const rotationSchema = new Schema([{
    names: String,
    id: String,
    rotationPosition: Number,
    skip: Boolean,
    active: Boolean
}])

export const Rotation = mongoose.model('rotation', rotationSchema, 'rotation')