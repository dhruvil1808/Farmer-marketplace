const express = require('express');
const { buyerUser, farmerUser } = require('../model/credentials');
const { crop } = require('../model/crops');
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
            crop.find({})
                .sort({ createdAt: -1 })
                .then((results) => {
                    allcrops = await crop.find({});
                    res.render("buy", { users: results, title: result.name, crops: allcrops });
                })
                .catch((err) => {
                    res.render("404", { title: "404 Error" });
                });
        }
        else {
            farmerUser.find({})
                .sort({ createdAt: -1 })
                .then((results) => {
                    res.render("sell", { users: results, title: result.name });
                })
                .catch((err) => {
                    res.render("404", { title: "404 Error" });
                });
        }
    } else {
        res.render("signin", { title: "Sign In", alrt: "Invalid Credentials" });
    }
});
router.post('/resetpass', async (req, res) => {
});
router.use((req, res) => {
    res.render('404.ejs', { title: '404', alrt: '' });
}
);
module.exports = router;