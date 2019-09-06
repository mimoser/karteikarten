const Deck = require('../models/DeckModel').Deck;
const Card = require('../models/CardModel').Card;
module.exports = {
    // returns public decks
    // the returned deck, contains no cards, since it's only for the dashboard view
    getPublicDecks: function (req, res) {
        Deck.find({ isPublic: true }).populate('owner', 'email').populate('cards').exec().then(publicDecks => {
            if (publicDecks) {
                console.log(publicDecks);
                let decks = new Array();
                publicDecks.forEach(deck => {
                    let d = {
                        id: deck.id,
                        name: deck.name,
                        owner: deck.owner.email,
                        averageRating: deck.averageRating,
                        numberOfCards: deck.cards.length,
                        numberOfSubscribers: deck.subscribers.length
                    }
                    decks.push(d);
                })
                res.status(200).json({ "decks": decks });
            } else {
                res.sendStatus(404);
            }
        }, error => {
            console.log(error);
            res.status(500).send(error);
        });
    },
    // returns a certain deck, but only if owner or subscriber
    getDeck: function (req, res) {
        let deckId = req.body.id;

        Deck.findOne({ _id: deckId }).populate({
            path: 'owner',
            match: { email: req.payload.email }
        }).populate({
            path: 'subscribers',
            match: { email: req.payload.email }
        }).populate('cards').then(deck => {
            // deck.populate('cards');
            if (deck) {
                res.status(200).send({
                    cards: deck.cards,
                    isPublic: deck.isPublic,
                    averageRating: deck.averageRating,
                    _id: deck._id,
                    name: deck.name
                });
            } else {
                res.sendStatus(404);
            }
        }, error => {
            console.log(error);
            res.status(500).send(error);
        });
    },
    addDeck: function (req, res) {
        console.log(req.body);

        User.findOne(
            { email: req.payload.email }
        ).then(user => {
            // owner is the user sending this request
            let owner = user;

            let isPublic = req.body.isPublic || false;
            let rating = 0;

            let subscribers = new Array();

            let cards = new Array();
            req.body.cards.forEach(card => {
                let c = new Card({ content: card.content, difficulty: card.difficulty });
                c.save();
                cards.push(c);
            });

            let deck = new Deck({
                owner: owner,
                name: req.body.name,
                cards: cards,
                isPublic: isPublic,
                averageRating: rating,
                subscribers: subscribers
            });

            deck.save().then(deck => {
                user.decks.push(deck);
                user.save().then(user => {
                    res.status(200).send("Deck added!");
                }, error => {
                    console.log(error);
                    res.status(500).send(error);
                });

            }, error => {
                console.log(error);
                res.status(500).send(error);
            });
        }, error => {
            console.log(error);
            res.status(500).send(error);
        });
    },
    // updates a certain deck, but only if owner
    updateDeck: function (req, res) {
        let deckId = req.body.deckId;

        Deck.findOne({ _id: deckId }).populate({
            path: 'owner',
            match: { email: req.payload.email }
        }).then(deck => {
            if (deck) {
                console.log(deck);
                let updatedCards = new Array();
                req.body.cards.forEach(card => {
                    let c = new Card(card);
                    c.save();
                    updatedCards.push(new Card(c));
                });
                deck.cards.forEach(card => {
                    Card.findOne({ _id: card._id }).exec().then(c => {
                        c.remove();
                    });
                });

                deck.cards = updatedCards;
                deck.save().then(savedDeck => {
                    res.status(200).json({
                        cards: savedDeck.cards,
                        isPublic: savedDeck.isPublic,
                        averageRating: savedDeck.averageRating,
                        _id: savedDeck._id,
                        name: savedDeck.name
                    });
                })
            } else {
                res.sendStatus(404);
            }
        }, error => {
            console.log(error);
        });
    },
    removeDeck: function (req, res) { }
}