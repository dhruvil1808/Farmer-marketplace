//controller for user management
const { buyerUser, farmerUser } = require('../model/credentials');
const { crop } = require('../model/crops');
const passport = require('passport');
const initializePassport = require('../middleware/passport');
const bcrypt = require('bcrypt');
//function to find user by name
async function findUserByName(name) {
    var result = await buyerUser.findOne({ email: name });
    if (result == null) {
        result = await farmerUser.findOne({ pno: name })
    }
    return result;
}
//function to find user by user id
async function findUserByID(id) {
    var result = await buyerUser.findById(id);
    if (result == null) {
        result = await farmerUser.findById(id)
    }
    return result;
}

initializePassport(passport, (search1 => findUserByName(search1)), (id => findUserByID(id)));

module.exports = {
    //create a buyer user
    createBuyer: async (req, res) => {
        try {
            const buyeruser = new buyerUser(req.body);
            const hashedPassword = await bcrypt.hash(buyeruser.password, 10);
            buyeruser.password = hashedPassword;
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
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //create a farmer user
    createSeller: async (req, res) => {
        try {
            const selleruser = new farmerUser(req.body);
            const hashedPassword = await bcrypt.hash(selleruser.password, 10);
            selleruser.password = hashedPassword;
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
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //login user
    login: async (req, res, next) => {
        if (req.user.kisaan_id == undefined) {
            res.render('buy', { user: req.user, title: req.user.name, crops: await crop.find({}), alrt: "" });
        }
        else {
            res.render('sell', { user: req.user, title: req.user.name, crops: await crop.find({}), alrt: "" });
        }
    }
}