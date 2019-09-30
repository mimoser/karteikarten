const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    question: {type: String},
    answer: {type: String},
    difficulty: {type: Number, default: 2}
});
const Card = mongoose.model('Card', cardSchema);

module.exports.Card = Card;