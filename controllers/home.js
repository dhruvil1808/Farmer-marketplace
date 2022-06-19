const { crop } = require('../model/crops');

module.exports = {
    index: async (req, res) => {
        try {
            allcrops = await crop.find({}).sort({ createdAt: -1 });
            res.render('home.ejs', { crops: allcrops, title: 'Horizon', alrt: '' });
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    signup: (req, res) => {
        var val = req.params.value;
        if (val == 1) {
            res.render('signup.ejs', { title: 'Farmer', alrt: '', value: val });
        }
        else if (val == 2) {
            res.render('signup.ejs', { title: 'Buyer', alrt: '', value: val });
        }
    },
    signin: (req, res) => {
        res.render('signin.ejs', { title: 'Sign In', alrt: '' });
    },
    about: (req, res) => {
        res.render('about.ejs', { title: 'About', alrt: '' });
    },
    search: async (req, res) => {
        try {
            const { search } = req.query;
            allcrops = await crop.find({ $or: [{ name: search }, { state: search }, { sellerName: search }, { basePrice: search }, { quantity: search }, { category: search }, { startDate: search }] }).sort({ createdAt: -1 });
            res.render('home.ejs', { crops: allcrops, title: 'Horizon', alrt: '' });
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
}

