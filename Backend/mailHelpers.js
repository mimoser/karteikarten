const nodemailer = require('nodemailer');

module.exports = {
    _createSmtpTransport: function(){
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: process.env.USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN
            }
        });
    },

    sendRegistrationSuccess: function (data) {
        let smtpTransport = this._createSmtpTransport();
        // console.log(nodemailer.createTransport("SMTP", {
        //     service: 'gmail',
        //     auth: {
        //         XOAuth2: {
        //             user: process.env.USER,
        //             clientId: process.env.CLIENT_ID,
        //             clientSecret: process.env.CLIENT_SECRET,
        //             refreshToken: process.env.REFRESH_TOKEN
        //         }
        //     }
        // }));

        const mailOptions = {
            from: process.env.USER,
            to: data.email,
            subject: 'Karteikarten-App registration',
            html: `<h2>Dear ${data.username} thanks for registering!</h2></br><p>We wish you a good learning experience with our app!</p>`
        };

        smtpTransport.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
            smtpTransport.close();
        });

    },

    sendPasswordReset: function(email, temporaryPassword){
        let smtpTransport = this._createSmtpTransport();
        smtpTransport.sendMail({
            from: process.env.USER,
            to: email,
            subject: 'Password reset',
            html: `<p>Your temporary password is: ${temporaryPassword}</p></br><p>Please change it as soon as possible!</p>`
        }, function (err, info){
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
            smtpTransport.close();
        })
    }
}