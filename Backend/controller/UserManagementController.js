const passport = require('passport');
const mailer = require('./../mailHelpers');
const User = require('./../models/UserModel').User;
const passwordGenerator = require('generate-password');

const { check, validationResult } = require('express-validator');

module.exports = {
    register: function (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;

        User.findOne({
            $or: [{ email: req.body.email }, { name: username }]
        }).then(function (user) {
            if (user) {
                res.status(500).json({
                    error: `Account with this ${(user.email === email) ? "email" : "username"} already exists.`
                });
            } else {
                // create user
                const newUser = new User({
                    email: email,
                    password: password, // passwordHash is saved instead of plaintext password
                    name: username,
                    ratedDecks: {},
                    ratedCards: {}
                });

                newUser.save().then(function (savedUser) {

                    mailer.sendRegistrationSuccess({ email: email, username: username });

                    token = savedUser.generateJwt();
                    res.status(200);
                    res.json({
                        'access_token': token,
                    });

                    // res.status(200).json({
                    //     success: 'Account successfully registered.'
                    // });
                }).catch(function (error) {
                    res.status(500).json({
                        error: 'Error while creating new user account.'
                    });
                });
            }
        });
    },

    login: function (req, res) {
        passport.authenticate('local', function (err, user, info) {
            let token;

            // error occured
            if (err) {
                res.status(404).json({
                    error: err.message,
                });
                return;
            }
            // user found
            if (user) {
                token = user.generateJwt();

                let u = {
                    'name': user.name,
                    'email': user.email,
                    'decks': user.decks,
                    'id': user.id
                };

                res.status(200);
                res.json({
                    'user': u,
                    'access_token': token,
                });
            } else {
                // user not found
                res.status(401).json({
                    error: info.message,
                });
            }
        })(req, res);
    },


    logout: function (req, res) {
        req.logout();
        return res.status(200).send('logout success');
    },

    resetPassword: function (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const email = req.body.email;

        User.findOne({
            email: req.body.email,
        }).then(function (user) {
            if (user) {
                let temporaryPassword = passwordGenerator.generate({
                    length: 8,
                    numbers: true,
                });

                user.password = temporaryPassword;
                user.save();
                mailer.sendPasswordReset(email, temporaryPassword);

            } else {
                // do nothing
            }
            res.end();
        });
    }
}