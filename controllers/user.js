const { buyerUser, farmerUser } = require('../model/credentials');
const { crop } = require('../model/crops');
const passport = require('passport');
const initializePassport = require('../middleware/passport');
const session = require('express-session');
async function findUserByName(name) {
    var result = await buyerUser.findOne({ email: name });
    if (result == null) {
        result = await farmerUser.findOne({ pno: name })
    }
    return result;
}
async function findUserByID(id) {
    var result = await buyerUser.findById(id);
    if (result == null) {
        result = await farmerUser.findById(id)
    }
    return result;
}

initializePassport(passport, (search1 => findUserByName(search1)), (id => findUserByID(id)));

module.exports = {
    createBuyer: (req, res) => {
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
    },
    createSeller: (req, res) => {
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
                console.log(err);
                res.render("404", { title: "404 Error" });
            });
    },
    login: async (req, res, next) => {
        if (req.user.kisaan_id == undefined) {
            res.render('buy', { user: req.user, title: req.user.name, crops: await crop.find({}), alrt: "" });
        }
        else {
            res.render('sell', { user: req.user, title: req.user.name, crops: await crop.find({}), alrt: "" });
        }
        /* try {
            const name = req.query.search1;
            const pass = req.query.search2;
            var ch = 0;
            var result = await buyerUser.findOne({ email: name, password: pass });
            if (result == null) {
                result = await farmerUser.findOne({ pno: name, password: pass });
                ch = 1;
            }
            if (result == null) {
                result = await buyerUser.findOne({ pno: name, password: pass });
                ch = 0;
            }
            if (result != null) {
                if (ch == 0) {
                    buyerUser.find({})
                        .sort({ createdAt: -1 })
                        .then(async (results) => {
                            allcrops = await crop.find({}).sort({ createdAt: -1 });
                            res.render("buy", { user: results, title: result.name, crops: allcrops, alrt: '' });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.render("404", { title: "404 Error" });
                        });
                }
                else {
                    farmerUser.find({})
                        .sort({ createdAt: -1 })
                        .then(async (results) => {
                            allcrops = await crop.find({ sellerName: result.name }).sort({ createdAt: -1 });
                            res.render("sell", { title: result.name, crops: allcrops, alrt: '' });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.render("404", { title: "404 Error" });
                        });
                }
            } else {
                res.render("signin", { title: "Sign In", alrt: "Invalid Credentials" });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        } */
    }
}