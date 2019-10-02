var path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
'use strict';
module.exports = {

    importDeck: function async(req, res) {
        try {
            console.log("Hello Darkness my old friend!", req.file)
            // change name of uploaded file to original name
            sharp(req.file.path)
                .embed()
                .toFile(`../Import/${req.file.originalname}`);
            console.log("Here");
            fs.readFile(`../Import/${req.file.originalname}`, 'utf-8', (err, data) => {
                if (err) { throw err; }
                console.log('data: ', data);
            });
            //const file = req.file;
        } catch (err) {
            res.status(422).json({ err });
        }

        // var data = validateJSON('some potential json data');
        // if (data) {
        //     // valid!
        // }






        // res.json({ file: req.file });

        // console.log("Import start");
        // const user = req.payload.email;
        // const fileName = req.query.title;
        // const file = fileName + '.json'
        // fs.readFile(__dirname, '../Import/' + file, (err, data) => {
        //     if (err) {
        //         console.log(err);
        //         res.status(500).send(err);
        //     }
        //     if (data) {
        //         let deck = JSON.parse(data);
        //         console.log(deck);
        //         res.sendStatus(200);
        //     }
        // });
    }, validaJSON(body) {
        try {
            var data = JSON.parse(body);
            // if came to here, then valid
            return data;
        } catch (e) {
            // failed to parse
            return null;
        }
    }
}