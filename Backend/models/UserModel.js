/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const Card = mongoose.Schema({
    content: String
});

const Deck = mongoose.Schema({
    owner: Number,
    name: String,
    cards: [Card],
    isPublic: Boolean,
    averageRating: Number,
    subscribers: Number // determines how many users subscribed to this deck
});

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    decks: [Deck],
});


userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.methods.generateJwt = function () {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime() / 1000),
    }, keys.jwtsecret);
};

userSchema.virtual('password').set(function (value) {
    this.passwordHash = bcrypt.hashSync(value, 10);
});

const User = mongoose.model('user', userSchema);

module.exports.User = User;
