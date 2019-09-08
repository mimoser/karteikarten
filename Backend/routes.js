/* eslint-disable linebreak-style */
const router = require('express').Router();
const { check } = require('express-validator');

const cors = require('cors');
const jwt = require('express-jwt');

const userManagementCtrl = require('./controller/UserManagementController');
const deckCtrl = require('./controller/DeckController');
const profileCtrl = require('./controller/ProfileController');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
});

// cors options
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.use(cors(corsOptions));

// user management ressources

// register endpoint
router.post('/register', [check('email').isEmail(), check('password').isLength({ min: 8 })], userManagementCtrl.register);
// Route for carrying out the login process.
router.post('/login', userManagementCtrl.login);
// Route for carrying out the logout process.
router.post('/logout', userManagementCtrl.logout);
router.post('/resetPassword', [check('email').isEmail()], userManagementCtrl.resetPassword);


// deck ressources

router.get('/publicDecks', auth, deckCtrl.getPublicDecks);
router.get('/deck', auth, deckCtrl.getDeck);
router.post('/deck', auth, deckCtrl.addDeck);
router.put('/deck', auth, deckCtrl.updateDeck);
router.get('/userDecks', auth, deckCtrl.getUserDecks);
router.delete('/deck', auth, deckCtrl.removeDeck);


// Profile
// updates profile
router.put('/updateProfile', auth, profileCtrl.updateProfile);


module.exports = router;
