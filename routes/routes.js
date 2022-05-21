const express = require('express');
const { buyerUser, farmerUser } = require('../model/credentials');
const router = express.Router();

router.get('/signin', (req, res) => {
    res.render('signin.ejs', { title: 'Sign In', alrt: '' });
}
);
router.get('/sign-up/:value', (req, res) => {
    var val = req.params.value;
    res.render('signup.ejs', { title: 'Sign Up', alrt: '', value: val });
}
);
router.post('/createseller', (req, res) => {
    const selleruser = new farmerUser(req.body);
    console.log(req.body);
    selleruser
        .save()
        .then((result) => {
            res.render("signin", {
                title: "Horizon",
                alrt: "User Created Successfully",
            });
        })
        .catch((err) => {
            res.render("404", { title: "404 Error" });
        });
});
router.post('/createbuyer', (req, res) => {
    const buyeruser = new buyerUser(req.body);
    buyeruser
        .save()
        .then((result) => {
            res.render("signin", {
                title: "Horizon",
                alrt: "User Created Successfully",
            });
        })
        .catch((err) => {
            res.render("404", { title: "404 Error" });
        });
});
router.get('/reset', (req, res) => {
    res.render('reset.ejs', { title: 'Reset Password', alrt: '' });
}
);
router.get('/', (req, res) => {
    res.render('home.ejs', { title: 'Horizon', alrt: '' });
}
);
router.get('/about', (req, res) => {
    res.render('about.ejs', { title: 'About', alrt: '' });
}
);
router.use((req, res) => {
    res.render('404.ejs', { title: '404', alrt: '' });
}
);
module.exports = router;