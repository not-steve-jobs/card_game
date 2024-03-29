const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: {
        type: String
    },
    max_gamer_count: {
        type: Number,
        required: true
    },
    current_count: {
        type: Number,
        default: 0
    },
    created_date: {
        type: Date,
        default: Date.now,
        index: { expires: 86400000 }
    },
    userId: {
        type: String,
        required: true,
        ref:'User'
    },
});

module.exports = mongoose.model('Room', roomSchema);