const mongoose = require('mongoose');
const Card = require('../models/CardModel').Card;

const deckSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
    isPublic: { type: Boolean, default: false },
    averageRating: { type: Number, default: 2.5 },
    numberRatings: {type: Number, default: 1},
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [String]   // wird für die Suche benutzt
});

deckSchema.methods.getDifficulty = async function(){
    var difficulties = 0;
    
    for (var i = 0; i < this.cards.length; i++) {
        await Card.findById({_id: this.cards[i]._id.toString()}).then( card => {
            difficulties += card.difficulty;
        }).catch(error => {
            console.log(error);
        });
    }
    
     return (this.cards.length>0)? Math.round(difficulties / this.cards.length): 0;
}

deckSchema.methods.addNewRating = function (rating) {
    this.averageRating = ((this.averageRating*this.numberRatings)+rating)/++this.numberRatings;
}

deckSchema.methods.correctRating = function (oldRating, newRating) {
    var oldAverage = ((this.averageRating*this.numberRatings)-oldRating)/(this.numberRatings-1);
    var newAverage = (oldAverage*(this.numberRatings-1)+newRating)/(this.numberRatings);
    this.averageRating = newAverage;
}


const Deck = mongoose.model('Deck', deckSchema);

module.exports.Deck = Deck;