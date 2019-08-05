/* eslint-disable linebreak-style */
const router = require('express').Router();
const passport = require('passport');
const User = require('./models/UserModel').User;
const Deck = require('./models/DeckModel').Deck;
const Card = require('./models/CardModel').Card;
const cors = require('cors');
const jwt = require('express-jwt');
const keys = require('./config/keys');
const { check, validationResult } = require('express-validator');

const passwordGenerator = require('generate-password');

const mailer = require('./mailHelpers');



const auth = jwt({
    secret: keys.jwtsecret,
    userProperty: 'payload',
});

// cors options
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.use(cors(corsOptions));

/**
 * register endpoint
 */
router.post('/register', [check('email').isEmail(), check('password').isLength({ min: 8 })], (req, res) => {

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
                error: `Account with this ${(user.email === email)? "email":"username"} already exists.`
            });
        } else {
            // create user
            const newUser = new User({
                email: email,
                password: password, // passwordHash is saved instead of plaintext password
                name: username
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
});

/**
 * Route for carrying out the login process.
 */
router.post('/login', function (req, res) {
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
            res.status(200);
            res.json({
                'userId': user.id,
                'access_token': token,
            });
        } else {
            // user not found
            res.status(401).json({
                error: info.message,
            });
        }
    })(req, res);
});


router.post('/logout', (req, res) => {
    req.logout();
    return res.status(200).send('logout success');
});

router.post('/deck', auth, (req, res) => {
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

});

// returns a certain deck, but only if owner or subscriber
router.get('/deck', auth, (req, res) => {
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
});

// updates a certain deck, but only if owner
router.put('/deck', auth, (req, res) => {
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
});

// returns public decks
// the returned deck, contains no cards, since it's only for the dashboard view
router.get('/publicDecks', auth, (req, res) => {
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
});

// initiates password resetting process
router.post('/resetPassword', [check('email').isEmail()], (req, res) => {
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
})


module.exports = router;
