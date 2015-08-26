import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: {
        type: String
    },
    classification: {
        type: [Number]
    },
    data: {
        type: Array, default: []
    },
    dimensions: {
        width: Number,
        height: Number
    }
});

mongoose.model('Record', schema);
