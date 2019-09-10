const Deck = require('../models/DeckModel').Deck;
const Card = require('../models/CardModel').Card;
const User = require('../models/UserModel').User;

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
                        title: deck.title,
                        owner: deck.owner.name,
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
        let deckId = req.query.deckId;

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
                    title: deck.title,
                    tags: deck.tags
                });
            } else {
                res.sendStatus(404);
            }
        }, error => {
            console.log(error);
            res.status(500).send(error);
        });
    },

    getUserDecks: function (req, res) {
        // find decks where user owner or subscriber

        Deck.find({ $or: [{ owner: req.payload._id }, { subscribers: { $eq: req.payload._id } }] }).populate('owner', 'email').populate('cards').exec().then(decks => {
            if (decks) {
                console.log(decks);
                let aDecks = new Array();
                decks.forEach(deck => {
                    let d = {
                        id: deck.id,
                        title: deck.title,
                        owner: deck.owner.email,
                        averageRating: deck.averageRating,
                    }
                    aDecks.push(d);
                })
                res.status(200).json({ "decks": aDecks });
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

            let cards = new Array();
            req.body.deck.cards.forEach(card => {
                let c = new Card({ question: card.question, answer: card.answer, difficulty: card.difficulty });
                c.save();
                cards.push(c);
            });

            let deck = new Deck({
                owner: user,
                title: req.body.deck.title,
                cards: cards,
                isPublic: req.body.deck.isPublic,
                averageRating: req.body.deck.averageRating,
                subscribers: new Array()
            });

            deck.save().then(deck => {
                user.decks.push(deck);
                user.save().then(user => {
                    res.status(200).json({_id:deck.id});
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
    updateDeck: async function (req, res) {
        let deckId = req.body.deck._id;

        Deck.findOne({ _id: deckId }).then(deck => {
            if (deck) {
                console.log(deck);

                deck.title = req.body.deck.title;
                deck.tags = req.body.deck.tags;
                deck.averageRating = req.body.deck.averageRating;
                deck.isPublic = req.body.deck.isPublic;

                req.body.deck.cards.forEach( async card => {
                    if (card._id) {
                        await Card.findOneAndUpdate({ _id: card._id }, card, { new: true });
                    } else {
                        let c = new Card({ question: card.question, answer: card.answer, difficulty: card.difficulty });
                        c.save();
                        deck.cards.push(c);
                    }
                });

                deck.save().then(savedDeck => {
                    res.status(200).send();
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