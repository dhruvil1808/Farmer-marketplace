//controller for user settings
const { buyerUser, farmerUser } = require('../model/credentials');
const { crop } = require('../model/crops');
const bcrypt = require('bcrypt');
module.exports = {
    //render user settings page
    setting: async (req, res) => {
        try {
            const username = req.user.name;
            var result = await buyerUser.findOne({ name: username });
            if (result == null) {
                result = await farmerUser.findOne({ name: username });
            }
            res.render("settings", { title: "Preferences", user: result });
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //render reset password page
    reset: (req, res) => {
        res.render('reset.ejs', { title: 'Reset Password', alrt: '' });
    },
    //reset password
    resetPassword: async (req, res) => {
        try {
            const name = req.body.email;
            const birth = req.body.dob;
            const HashedPassword = await bcrypt.hash(req.body.password, 10);
            var result2;
            const result = await buyerUser.findOneAndUpdate(
                { email: name, dob: birth },
                { password: HashedPassword }
            );
            if (result == null) {
                result2 = await farmerUser.findOneAndUpdate(
                    { aadhar: name, dob: birth },
                    { password: HashedPassword }
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
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //render update user details page
    resetDetails: async (req, res) => {
        try {
            const username = req.user.name;
            var result = await buyerUser.findOne({ name: username });
            if (result == null) {
                result = await farmerUser.findOne({ name: username });
            }
            if (result != null) {
                res.render("reset-data", { title: "Reset Details", user: result });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //update user details
    resetData: async (req, res) => {
        try {
            var allcrops = await crop.find({}).sort({ createdAt: -1 });
            const username = req.params.username;
            var result = await buyerUser.findOneAndUpdate(
                { name: username },
                {
                    name: req.body.name,
                    aadhar: req.body.aadhar,
                    dob: req.body.dob,
                    pno: req.body.pno,
                }
            );
            if (result == null) {
                result = await farmerUser.findOneAndUpdate(
                    { name: username },
                    {
                        name: req.body.name,
                        aadhar: req.body.aadhar,
                        dob: req.body.dob,
                        pno: req.body.pno,
                    }
                );
                if (result != null) {
                    farmerUser.email = res.email;
                    farmerUser.dob = res.dob;
                    farmerUser.pno = res.pno;
                    farmerUser.username = res.username;
                    res.render("home", {
                        crops: allcrops,
                        title: "Horizon",
                        alrt: "Data Reset",
                    });
                } else {
                    res.render("home", { crops: allcrops, title: "horizon", alrt: "No such User" });
                }

            }
            else {
                if (result != null) {
                    buyerUser.email = res.email;
                    buyerUser.dob = res.dob;
                    buyerUser.pno = res.pno;
                    buyerUser.username = res.username;
                    res.render("home", {
                        crops: allcrops,
                        title: "Horizon",
                        alrt: "Data Reset",
                    });
                } else {
                    res.render("home", { crops: allcrops, title: "Horizon", alrt: "No such User" });
                }
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //render delete user page
    delete: async (req, res) => {
        try {
            const username = req.user.name;
            res.render("delete", { title: "Delete Account", username: username });
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //delete user
    deleteUser: async (req, res) => {
        try {
            const username = req.body.username;
            const pass = req.body.password;
            const HashedPassword = await bcrypt.hash(pass, 10);
            //finding the type of user
            var result = await farmerUser.findOneAndDelete({
                name: username,
                password: HashedPassword,
            });
            if (result == null) {
                result = await buyerUser.findOneAndDelete({
                    name: username,
                    password: HashedPassword,
                });
                //if it is buyer user
                if (result != null) {
                    //delete all the bids of the user from crop data
                    result.bids.forEach(async (x) => {
                        var temp = await crop.findOne({ _id: x.crop });
                        var res = [];
                        temp.bids.forEach((y) => {
                            if (y.buyer != username) {
                                res.push(y);
                            }
                        }
                        );
                        await crop.findByIdAndUpdate(x.crop, { bids: res });
                    });
                    var allcrops = await crop.find({}).sort({ createdAt: -1 });
                    res.render('home.ejs', { crops: allcrops, title: 'Horizon', alrt: 'User Deleted' });
                }
                else {
                    var allcrops = await crop.find({}).sort({ createdAt: -1 });
                    res.render('home.ejs', { crops: allcrops, title: 'Horizon', alrt: 'User not Deleted' });
                }
            }
            //if it is farmer user
            else {
                //delete all crops of the farmer
                result.crops.forEach(async (x) => {
                    await crop.findByIdAndDelete(x._id);
                });
                if (result != null) {
                    var allcrops = await crop.find({}).sort({ createdAt: -1 });
                    res.render('home.ejs', { crops: allcrops, title: 'Horizon', alrt: 'User Deleted' });
                } else {
                    var allcrops = await crop.find({}).sort({ createdAt: -1 });
                    res.render('home.ejs', { crops: allcrops, title: 'Horizon', alrt: 'User not Deleted' });
                }
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //user logout
    logout: (req, res) => {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.redirect('/login');
        });
    }
}