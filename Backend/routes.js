/* eslint-disable linebreak-style */
const router = require('express').Router();
const { check } = require('express-validator');

const cors = require('cors');
const jwt = require('express-jwt');


const passwordGenerator = require('generate-password');

const mailer = require('./mailHelpers');

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
router.route('/register', [check('email').isEmail(), check('password').isLength({ min: 8 })]).post(userManagementCtrl.register);
// Route for carrying out the login process.
router.route('/login').post(userManagementCtrl.login);
// Route for carrying out the logout process.
router.route('/logout').post(userManagementCtrl.logout);
router.route('/resetPassword', [check('email').isEmail()]).post(userManagementCtrl.resetPassword);


// deck ressources

router.route('/publicDecks', auth).get(deckCtrl.getPublicDecks);
router.route('/deck', auth).get(deckCtrl.getDeck);
router.route('/deck', auth).post(deckCtrl.addDeck);
router.route('/deck', auth).put(deckCtrl.updateDeck);
router.route('/deck', auth).delete(deckCtrl.removeDeck);


// Profile
// updates profile
router.route('/updateProfile', auth).put(profileCtrl.updateProfile);



module.exports = router;
