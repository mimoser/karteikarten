const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    question: String,
    answer: String,
    difficulty: {type: Number, default: 0}
});
const Card = mongoose.model('Card', cardSchema);

module.exports.Card = Card;