const User = require('../models/UserModel').User;
module.exports = {

    updateProfile: function (req, res) {
        // console.log(req.payload);

        User.findOne({
            email: req.payload.email
        }).then(user => {
            //update users data
            if (req.body.profileData.email) {
                user.email = req.body.profileData.email;
            }
            if (req.body.profileData.username) {
                user.name = req.body.profileData.username;
            }
            if (req.body.profileData.password) {
                if (!user.validPassword(req.body.profileData.oldPassword)) {
                    return res.status(500).json({ "error": "Old password not valid!" });
                    // return res.send("Old password not valid!");
                }
                user.password = req.body.profileData.password;
            }
            user.save().then(updatedUser => {
                let u = {
                    'name': updatedUser.name,
                    'email': updatedUser.email
                };
                res.status(200).json(u);
            })

        })
    }
}