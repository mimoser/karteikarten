/* eslint-disable linebreak-style */
const router = require('express').Router();
const { check } = require('express-validator');

const cors = require('cors');
const jwt = require('express-jwt');

// file upload middleware
const multer = require('multer');

const userManagementCtrl = require('./controller/UserManagementController');
const deckCtrl = require('./controller/DeckController');
const profileCtrl = require('./controller/ProfileController');
const exportCtrl = require('./controller/ExportController');
const importCtrl = require('./controller/ImportController');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
});

const fileFilter = function (req, file, cb) {
    const allowTypes = ["application/json", ".json"];
    if (!allowTypes.includes(file.mimetype)) {
        const error = new Error("Wrong file type");
        error.code = "LIMIT_FILE_TYPES"
        return cb(error, false);
    }
    cb(null, true);

}

const upload = multer({
    dest: "./Import/",
    fileFilter
})

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
router.get('/decks/:deckId', auth, deckCtrl.getDeck);
router.post('/decks', auth, deckCtrl.addDeck);
router.put('/decks/:deckId', auth, deckCtrl.updateDeck);
router.get('/userDecks', auth, deckCtrl.getUserDecks);
router.delete('/decks/:deckId', auth, deckCtrl.deleteDeck);
router.put('/subscribe/:deckId',auth, deckCtrl.subscribeDeck);
router.put('/unsubscribe/:deckId',auth, deckCtrl.unsubscribeDeck);
router.post('/ratedeck/:rating:deckId', auth, deckCtrl.rateDeck);


// // card
// router.put('/decks/:deckId/cards', auth, deckCtrl.updateDeck);
// router.get('/decks/:deckId/cards/:cardId', auth, deckCtrl.updateDeck);

// Profile
// updates profile
router.put('/updateProfile', auth, profileCtrl.updateProfile);

// Export
router.get('/export', auth, exportCtrl.exportDeck);

// Import
router.post('/import', auth, upload.single("file"), importCtrl.importDeck);



module.exports = router;
