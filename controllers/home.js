//controler for home page
const { crop } = require('../model/crops');
module.exports = {
    //render home page with all crop info
    index: async (req, res) => {
        try {
            allcrops = await crop.find({}).sort({ createdAt: -1 });
            res.render('home.ejs', { crops: allcrops, title: 'Horizon', alrt: '' });
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //render signup page according to user type
    signup: (req, res) => {
        var val = req.params.value;
        if (val == 1) {
            res.render('signup.ejs', { title: 'Farmer', alrt: '', value: val });
        }
        else if (val == 2) {
            res.render('signup.ejs', { title: 'Buyer', alrt: '', value: val });
        }
    },
    //render signin page
    signin: (req, res) => {
        res.render('signin.ejs', { title: 'Sign In', alrt: '' });
    },
    //render about page
    about: (req, res) => {
        res.render('about.ejs', { title: 'About', alrt: '' });
    },
    //view crops available with filters on the home page
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

