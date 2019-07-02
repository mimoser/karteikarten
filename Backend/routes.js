/* eslint-disable linebreak-style */
const router = require('express').Router();
const passport = require('passport');
const User = require('./models/UserModel').User;
const cors = require('cors');
const jwt = require('express-jwt');
const keys = require('./config/keys');
const { check, validationResult } = require('express-validator');

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

    User.findOne({
        email: req.body.email,
    }).then(function (user) {
        if (user) {
            res.status(500).json({
                error: 'Account with this email already exists.'
            });
        } else {
            // create user
            const newUser = new User({
                email: email,
                password: password, // passwordHash is saved instead of plaintext password
            });

            newUser.save().then(function (savedUser) {

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

// test
router.get('/test', auth, (req, res) => {
    res.status(200);
    res.send("auth success");
});

router.get('/test2', (req, res) => {
    res.status(200).send("no auth test");
});

module.exports = router;
