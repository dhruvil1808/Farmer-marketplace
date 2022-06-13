const { crop } = require('../model/crops');

module.exports = {
    index: async (req, res) => {
        allcrops = await crop.find({}).sort({ name: -1 });
        res.render('home.ejs', { crops: allcrops, title: 'Horizon', alrt: '' });
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
}

