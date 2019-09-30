const Deck = require('../models/DeckModel').Deck;
const Card = require('../models/CardModel').Card;
const User = require('../models/UserModel').User;
module.exports = {
    addCard: function (req, res) {
        const deckId = req.param.deckId;
    },
    updateCard: function (req, res) {
        const deckId = req.param.deckId;
        const cardId = req.param.deckId;
    },
    removeCard: function (req, res) {
        const deckId = req.param.deckId;
        const cardId = req.param.deckId;

    },
    rateCard: function (req, res) {
        
    }
}