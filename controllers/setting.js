const { buyerUser, farmerUser } = require('../model/credentials');

module.exports = {
    reset: (req, res) => {
        res.render('reset.ejs', { title: 'Reset Password', alrt: '' });
    },
    resetPassword: async (req, res) => {
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
    }
}