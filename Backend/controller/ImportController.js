var path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
'use strict';
module.exports = {

    importDeck: function async(req, res) {
        try {
            console.log("Import start");
            // console.log("file", req.file);
            fs.readFile(req.file.path, (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                }
                if (data) {
                    // parse from buffer to json
                    let jsonData = null;
                    // check if valid json 
                    try {
                        jsonData = JSON.parse(data);
                    } catch (e) {
                        jsonData = null;
                    }
                    if (jsonData) {
                        let deck = jsonData;
                        console.log(deck);
                        console.log("Import end");
                        res.status(200).send("Upload successful");
                    } else {
                        console.log("Import end");
                        res.status(406).send("Not valid JSON file. Please check your file!");
                    }

                }
            });

        } catch (err) {
            res.status(406).json({ err });
        }

    }
}