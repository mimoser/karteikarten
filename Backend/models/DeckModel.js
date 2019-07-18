const mongoose = require('mongoose');

const deckSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
    isPublic: {type: Boolean, default: false},
    averageRating: {type: Number, default: 2.5},
    // numberSubscribers: {type: Number, default: 0}, // determines how many users subscribed to this deck
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});

const Deck = mongoose.model('Deck', deckSchema);

module.exports.Deck = Deck;