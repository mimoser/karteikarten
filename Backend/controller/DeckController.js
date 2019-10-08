const Deck = require('../models/DeckModel').Deck;
const Card = require('../models/CardModel').Card;
const User = require('../models/UserModel').User;

module.exports = {
    // returns public decks
    // the returned deck, contains no cards, since it's only for the dashboard view
    getPublicDecks: function (req, res) {
        // pagination        
        const pagesize = parseInt(req.query.pageSize) || 10;
        const page = parseInt(req.query.page) || 1
        const offset = (page - 1) * pagesize;
        let maxDecks = 0;

        // conditions object
        var conditions = {};
        var and_clauses = []; // filter the search by any criteria given by the user
        and_clauses.push({ 'isPublic': true });
        if (req.query.search !== undefined && req.query.search !== 'null' && req.query.search !== "") {
            const search = ".*" + req.query.search + ".*";
            and_clauses.push({ tags: { $regex: search } });
        }
        if (and_clauses.length > 0) {
            conditions['$and'] = and_clauses;
        }
        // count how many decks exists with filter
        Deck.find(conditions).countDocuments().then(count => {
            if (count > 0) {
                maxDecks = count;
                Deck.find(conditions).skip(offset).limit(pagesize).populate({ path: "owner" }).populate({ path: "cards" }).then(publicDecks => {
                    if (publicDecks) {
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
                        res.status(200).json({ "decks": decks, maxDecks: maxDecks });
                    } else {
                        res.sendStatus(404);
                    }
                }, error => {
                    console.log(error);
                    res.status(500).send(error);
                });
            } else {
                let decks = new Array();
                res.status(200).json({ "decks": decks, maxDecks: maxDecks });
            }
        });

    },
    // returns a certain deck, but only if owner or subscriber
    getDeck: function (req, res) {
        let deckId = req.params.deckId;

        Deck.findOne({ _id: deckId }).populate({
            path: 'owner',
            match: { email: req.payload.email }
        }).populate({
            path: 'subscribers',
            match: { email: req.payload.email }
        }).populate('cards').populate('owner').then(deck => {
            // deck.populate('cards');
            if (deck) {
                res.status(200).send({
                    cards: deck.cards,
                    isPublic: deck.isPublic,
                    averageRating: deck.averageRating,
                    _id: deck._id,
                    title: deck.title,
                    tags: deck.tags,
                    owner: deck.owner._id,
                    subscribers: deck.subscribers
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

        Deck.find({ $or: [{ owner: req.payload._id }, { subscribers: { $eq: req.payload._id } }] }).populate('owner', 'email').populate('cards').exec().then(async decks => {
            if (decks) {
                let aDecks = new Array();


                for (var i = 0; i < decks.length; i++) {
                    var difficulty = await decks[i].getDifficulty();
                    let d = {
                        id: decks[i].id,
                        title: decks[i].title,
                        owner: decks[i].owner._id,
                        averageRating: decks[i].averageRating,
                        difficulty: difficulty
                    }
                    aDecks.push(d);

                }

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

            let subscribers = new Array();
            subscribers.push(user);

            let deck = new Deck({
                owner: user,
                title: req.body.deck.title,
                cards: cards,
                isPublic: req.body.deck.isPublic,
                averageRating: req.body.deck.averageRating,
                subscribers: subscribers,
                tags: new Array()
            });

            for (var i = 0; i < req.body.deck.tags.length; i++) {
                deck.tags.push(req.body.deck.tags[i].text);
            }

            deck.save().then(deck => {
                user.decks.push(deck);
                user.save().then(user => {
                    res.status(200).json({ _id: deck.id });
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
        let deckId = req.params.deckId;

        Deck.findOne({ _id: deckId }).then(deck => {
            if (deck) {
                deck.title = req.body.deck.title;
                deck.averageRating = req.body.deck.averageRating;
                deck.isPublic = req.body.deck.isPublic;

                var tags = Array.prototype.slice.call(req.body.deck.tags);
                deck.tags = new Array();
                tags.forEach(async tag => {
                    deck.tags.push(tag.text);
                })

                var cardsInDB = new Array();
                var cardsToUpdate = new Array();
                var newCards = new Array();
                var cardsToDelete = new Array();

                for (var i = 0; i < deck.cards.length; i++) {
                    cardsInDB.push(deck.cards[i]._id.toString())
                }

                for (var i = 0; i < req.body.deck.cards.length; i++) {
                    if (req.body.deck.cards[i]._id == null) {
                        newCards.push(req.body.deck.cards[i]);
                    } else {
                        cardsToUpdate.push(req.body.deck.cards[i]._id);
                    }
                }

                for (var i = 0; i < cardsInDB.length; i++) {
                    if (!cardsToUpdate.includes(cardsInDB[i])) {
                        cardsToDelete.push(cardsInDB[i]);
                    }
                }

                Card.find({ _id: { $in: cardsToDelete } }).then(async cards => {
                    for (var i = 0; i < cards.length; i++) {
                        await cards[i].remove();
                        deck.cards.pop(cards[i]);
                    }
                    Card.find({ _id: { $in: cardsToUpdate } }).then(async cards => {
                        for (var i = 0; i < cards.length; i++) {
                            var card = req.body.deck.cards.find(card => card._id === cards[i].id);
                            await cards[i].update(card);
                        }

                        for (var i = 0; i < newCards.length; i++) {
                            let c = new Card({ question: newCards[i].question, answer: newCards[i].answer, difficulty: newCards[i].difficulty });
                            await c.save();
                            deck.cards.push(c);
                        }

                        deck.save().then(savedDeck => {
                            res.status(200).json(savedDeck);
                        }).catch(error => {
                            res.status(500).send();
                        })

                    }).catch(error => {

                    });

                }).catch(error => {
                    console.log(error);
                });
            } else {
                res.sendStatus(404);
            }
        }, error => {
            console.log(error);
        });
    },
    deleteDeck: function (req, res) {
        let deckId = req.params.deckId;

        Deck.findOneAndDelete({ $and: [{ _id: deckId, owner: req.payload._id }] }).then(deck => {
            if (deck) {
                Card.find({ _id: { $in: deck.cards } }).then(cards => {
                    cards.forEach(card => {
                        card.remove();
                    });
                }).catch(error => {
                    console.log(error);
                })
                User.find({ _id: { $in: deck.subscribers } }).then(users => {
                    users.forEach(user => {
                        for (var i = 0; i < user.decks.length; i++) {
                            if (user.decks[i]._id.equals(deck._id)) {
                                user.decks.splice(i, 1)
                                i--;
                            }
                        }
                        user.save();
                    });
                }).catch(error => {
                    console.log(error);
                })
                res.status(200).send();
            } else {
                res.status(401).send();
            }
        })
    },

    copyCards: function (req, res) {
        console.log(req.params.deckId);
        console.log(req.body.cards);
        Deck.findOne({ _id: req.params.deckId }).then(deck => {
            Card.find({ _id: { $in: req.body.cards } }).then(cards => {
                cards.forEach(card => {
                    var newCard = new Card({
                        question: card.question,
                        answer: card.answer,
                        difficulty: card.difficulty
                    });
                    newCard.save();
                    deck.cards.push(newCard);
                })
                deck.save();
                res.status(200).send();
            }).catch(err => {

            });
        }).catch(err => {

        });
    },

    rateDeck: function (req, res) {
        var deckId = req.params.deckId;
        User.findOne({ email: req.payload.email }).then(user => {

            Deck.findOne({ _id: deckId }).then(deck => {
                if (user.ratedDecks.get(deckId)) {
                    var oldRating = user.ratedDecks.get(deckId);
                    deck.correctRating(oldRating, req.body.rating);
                    user.ratedDecks.set(deckId, req.body.rating);
                    user.save();
                } else {
                    deck.addNewRating(req.body.rating);
                    user.ratedDecks.set(deckId, req.body.rating);
                    user.save();
                }
                deck.save();
            }).catch(error => {

            });
        }).catch(error => {

        });
    },
    subscribeDeck: function (req, res) {
        var deckId = req.params.deckId;
        User.findOne({ email: req.payload.email }).then(user => {

            Deck.findOne({ _id: deckId }).then(deck => {
                deck.subscribers.push(user);
                user.decks.push(deck);
                deck.save();
                user.save();
                res.status(200).send();
            }).catch(error => {
                console.log(error);
                res.status(500).send();
            })
        }).catch(error => {
            console.log(error);
            res.status(500).send();
        })

    },
    unsubscribeDeck: function (req, res) {

        var deckId = req.params.deckId;
        User.findOne({ email: req.payload.email }).then(user => {

            Deck.findOne({ _id: deckId }).then(deck => {
                deck.subscribers.remove(user._id);
                user.decks.remove(deck._id);
                deck.save();
                user.save();
                res.status(200).send();
            }).catch(error => {
                console.log(error);
                res.status(500).send();
            })
        }).catch(error => {
            console.log(error);
            res.status(500).send();
        })

    }
}