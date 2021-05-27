const express = require('express');

const CLIENT_ID = process.env.CLIENT_ID
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

const router = express.Router();

router.get("/", function (req, res) {
    var tagline = "Google Auth Practise";
    res.render("index.ejs", { tagline: tagline });
});

router.get("/login", function (req, res) {
    res.render("login.ejs");
});

router.get("/dashboard", checkAuthenticated, function (req, res) {
    let user = req.user
    res.render("dashboard.ejs", { user });
});

router.get("/logout", function (req, res) {
    res.clearCookie('session-token')
    res.redirect('/login')
});


router.post("/login-google", function (req, res) {
    let token = req.body.token;
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload)
    }
    verify().then(() => {
        res.cookie('session-token', token);
        res.send('success')
    }).catch(console.error)
});

function checkAuthenticated(req, res, next) {
    let token = req.cookies['session-token'];
    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }
    verify()
        .then(() => {
            req.user = user;
            next();
        })
        .catch(err => {
            res.redirect('/login')
        })

}

module.exports = router;
