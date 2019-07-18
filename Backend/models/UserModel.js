/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    // name: String,
    decks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Deck'}],
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

const User = mongoose.model('User', userSchema);

module.exports.User = User;
