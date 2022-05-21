const express = require('express');
const multer = require('multer');
/* var fs = require('fs');
var path = require('path');
require('dotenv/config'); */
const { buyerUser, farmerUser } = require('../model/credentials');
const { crop } = require('../model/crops');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home.ejs', { title: 'Horizon', alrt: '' });
}
);
router.get('/sign-up/:value', (req, res) => {
    var val = req.params.value;
    res.render('signup.ejs', { title: 'Sign Up', alrt: '', value: val });
}
);
router.get('/signin', (req, res) => {
    res.render('signin.ejs', { title: 'Sign In', alrt: '' });
}
);
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
router.post('/createseller', (req, res) => {
    const selleruser = new farmerUser(req.body);
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
router.get('/login/', async (req, res) => {
    const name = req.query.search1;
    const pass = req.query.search2;
    var ch = 0;
    var result = await buyerUser.findOne({ email: name, password: pass });
    if (result == null) {
        result = await farmerUser.findOne({ pno: name, password: pass });
        ch = 1;
    }
    else if (result == null) {
        result = await buyerUser.findOne({ pno: name, password: pass });
        ch = 0;
    }
    if (result != null) {
        if (ch == 0) {
            buyerUser.find({})
                .sort({ createdAt: -1 })
                .then(async (results) => {
                    allcrops = await crop.find({}).sort({ name: -1 });
                    res.render("buy", { users: results, title: result.name, crops: allcrops, alrt: '' });
                })
                .catch((err) => {
                    res.render("404", { title: "404 Error" });
                });
        }
        else {
            farmerUser.find({})
                .sort({ createdAt: -1 })
                .then((results) => {
                    res.render("sell", { users: results, title: result.name, alrt: '' });
                })
                .catch((err) => {
                    res.render("404", { title: "404 Error" });
                });
        }
    } else {
        res.render("signin", { title: "Sign In", alrt: "Invalid Credentials" });
    }
});
router.get('/reset', (req, res) => {
    res.render('reset.ejs', { title: 'Reset Password', alrt: '' });
}
);
router.post('/resetpass', async (req, res) => {
});
router.post('/post-crop', (req, res) => {
    const postcrop = new crop(req.body);
    postcrop
        .save()
        .then((result) => {
            res.render("sell", { title: "Horizon", alrt: "Crop Posted Successfully" });
        }
        )
        .catch((err) => {
            res.render("404", { title: "404 Error hai" });
        }
        );
});
router.get('/about', (req, res) => {
    res.render('about.ejs', { title: 'About', alrt: '' });
}
);
router.use((req, res) => {
    res.render('404.ejs', { title: '404', alrt: '' });
}
);
module.exports = router;