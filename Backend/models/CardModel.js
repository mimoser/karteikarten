const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
    difficulty: {type: Number, default: 0}
});
const Card = mongoose.model('Card', cardSchema);

module.exports.Card = Card;