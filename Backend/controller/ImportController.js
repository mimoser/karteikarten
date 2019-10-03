const fs = require('fs');
const Deck = require('../models/DeckModel').Deck;
const Card = require('../models/CardModel').Card;
const User = require('../models/UserModel').User;
'use strict';
module.exports = {

    importDeck: function async(req, res) {
        try {
            console.log("Import start");
            // console.log("file", req.file);
            fs.readFile(req.file.path, (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                if (data) {
                    // parse from buffer to json
                    let jsonData = null;
                    // check if valid json 
                    try {
                        jsonData = JSON.parse(data);
                    } catch (e) {
                        jsonData = null;
                    }
                    if (jsonData) {
                        const title = req.file.originalname.split(".json")[0];
                        let cards = new Array();
                        // only allow question, answer and difficulty
                        let cardError = "";
                        let i = 0;
                        for (let card of jsonData.cards) {
                            let question = card.question;
                            let answer = card.answer;
                            // check if URL links are in question or answer
                            if (question.indexOf('http') >= 0 || answer.indexOf('http') >= 0) {
                                cardError = cardError + "Error in card number " + i + ".Img Urls are not allowed! \n"
                            }
                            // check if img is not base 64 encoded
                            if ((question.indexOf("<img src=") >= 0 && !question.indexOf("http") >= 0) || (answer.indexOf("<img src=") >= 0 && !answer.indexOf("http") >= 0)) {
                                if (!question.indexOf("base64") >= 0 && !answer.indexOf("base64") >= 0) {
                                    cardError = cardError + "Error in card number " + i + ".Img need to be encoded in base 64! \n"
                                }
                            }
                            if (cardError === '') {
                                let tmp = new Card({ question: question, answer: answer, difficulty: card.difficulty });
                                tmp.save();
                                cards.push(tmp);
                            }
                            i++;
                        }
                        // send error message. User should change his file.
                        if (cardError !== '') {
                            console.log("Import end");
                            res.status(406).send(cardError);
                        } else {
                            // set deck data
                            let deck = new Deck({
                                title: title,
                                owner: req.payload._id,
                                averageRating: 0,
                                numberOfCards: cards.length,
                                cards: cards,
                                numberOfSubscribers: 1,
                                isPublic: false
                            });
                            // save deck into db
                            // add deck to user 
                            User.findOne(
                                { email: req.payload.email }
                            ).then(user => {
                                let subscribers = new Array();
                                subscribers.push(user);
                                deck.save().then(deck => {
                                    user.decks.push(deck);
                                    user.save().then(user => {
                                        console.log("Import end");
                                        res.status(200).send("Import successful!");
                                    }, error => {
                                        console.log(error);
                                        console.log("Import end");
                                        res.status(500).send(error);
                                    });
                                }, error => {
                                    console.log(error);
                                    console.log("Import end");
                                    res.status(500).send(error);
                                });
                            }, error => {
                                console.log(error);
                                console.log("Import end");
                                res.status(500).send(error);
                            });
                            // delete file 
                            fs.unlink(req.file.path, function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                console.log('File deleted');
                            });
                        };
                    }
                }
            });
        } catch (err) {
            console.log("Import end");
            res.status(406).json({ err });
        }
    }
}