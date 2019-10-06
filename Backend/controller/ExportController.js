const Deck = require('../models/DeckModel').Deck;
const Card = require('../models/CardModel').Card;
const User = require('../models/UserModel').User;
var path = require('path');
'use strict';

const fs = require('fs');
module.exports = {

    exportDeck: function (req, res) {
        const deckId = req.query.deckId;
        if (deckId && deckId !== undefined) {
            Deck.findOne({ _id: deckId }).populate('cards').then(deck => {
                if (deck) {
                    const cards = [];
                    for (let card of deck.cards) {
                        cards.push({ question: card.question, answer: card.answer, difficulty: card.difficulty });
                    }
                    const tmpDeck = {
                        title: deck.title,
                        tags: deck.tags,
                        cards: cards
                    }
                    let data = JSON.stringify(tmpDeck, null, 2);
                    const file = tmpDeck.title + '.json'
                    fs.writeFile('Export/' + file, data, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            console.log('Data written to file');
                            res.status(200).sendFile(path.join(__dirname, '../Export', file));
                        }
                    })
                }
            });
        } else {
            res.sendStatus(404);
        }
    }
}