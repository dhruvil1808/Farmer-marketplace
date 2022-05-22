const express = require('express');
const { buyerUser, farmerUser } = require('../model/credentials');
const { crop } = require('../model/crops');
const router = express.Router();

router.get('/', async (req, res) => {
    allcrops = await crop.find({}).sort({ name: -1 });
    res.render('home.ejs', { crops: allcrops, title: 'Horizon', alrt: '' });
}
);
router.get('/sign-up/:value', (req, res) => {
    var val = req.params.value;
    if (val == 1) {
        res.render('signup.ejs', { title: 'Farmer', alrt: '', value: val });
    }
    else if (val == 2) {
        res.render('signup.ejs', { title: 'Buyer', alrt: '', value: val });
    }
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
                    res.render("buy", { user: results, title: result.name, crops: allcrops, alrt: '' });
                })
                .catch((err) => {
                    res.render("404", { title: "404 Error" });
                });
        }
        else {
            farmerUser.find({})
                .sort({ createdAt: -1 })
                .then(async (results) => {
                    allcrops = await crop.find({ sellerName: result.name }).sort({ name: -1 });
                    res.render("sell", { users: results, title: result.name, crops: allcrops, alrt: '' });
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
    const name = req.body.email;
    const birth = req.body.dob;
    var result2;
    const result = await buyerUser.findOneAndUpdate(
        { email: name, dob: birth },
        { password: req.body.password }
    );
    if (result == null) {
        result2 = await farmerUser.findOneAndUpdate(
            { aadhar: name, dob: birth },
            { password: req.body.password }
        );
    }
    if (result != null) {
        buyerUser.password = res.password;
        res.render("signin", {
            title: "Horozon",
            alrt: "Password Reset",
        });
    }
    else if (result2 != null) {
        farmerUser.password = res.password;
        res.render("signin", {
            title: "Horizon",
            alrt: "Password Reset",
        });
    } else {
        res.render("signin", { title: "Horizon", alrt: "Password Reset" });
    }
});
router.post('/post-crop/:farmername', (req, res) => {
    const name = req.params.farmername;
    const postcrop = new crop(req.body);
    postcrop.sellerName = name;
    postcrop
        .save()
        .then(async (result) => {
            allcrops = await crop.find({}).sort({ name: -1 });
            await farmerUser.findOneAndUpdate({ name: name }, { $push: { crops: postcrop._id } });
            res.render("sell", { title: name, crops: allcrops, alrt: "Crop Posted Successfully" });
        }
        )
        .catch((err) => {
            res.render("404", { title: "404 Error hai" });
        }
        );
});
router.post('/buy-crop/:id/:name', async (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    const bid = req.body.bid;
    var res = await buyerUser.findOne({ crops: id });
    if (res == null) {
        var result2 = await buyerUser.findOneAndUpdate({ name: name }, {
            $push: {
                crops: id
            }
        });
        var result2 = await buyerUser.findOneAndUpdate({ name: name }, {
            $push: { amount: bid }
        });
        if (result2 != null) {
            var result = await crop.findByIdAndUpdate(id, { $push: { buyers: result2._id } });
            var result = await crop.findByIdAndUpdate(id, { $push: { amount: bid } });
            if (result !== null) {
                allcrops = await crop.find({}).sort({ name: -1 });
                res.render("buy", { crops: allcrops, title: name, alrt: "Bid Placed Successfully" });
            }
            else {
                allcrops = await crop.find({}).sort({ name: -1 });
                res.render("buy", { crops: allcrops, title: name, alrt: "Bid Failed" });
            }
        }
        else {
            res.render("buy", { title: name, alrt: "Bid Failed" });
        }
    }
});
router.get('/about', (req, res) => {
    res.render('about.ejs', { title: 'About', alrt: '' });
}
);
router.use((req, res) => {
    res.render('404.ejs', { title: '404 Error hai', alrt: '' });
}
);
module.exports = router;