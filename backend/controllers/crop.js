//controller for crop management
const { buyerUser, farmerUser } = require('../model/credentials');
const { crop } = require('../model/crops');
const fs = require('fs');
const path = require('path');
module.exports = {
    //upload new crop
    postCrop: (req, res) => {
        const postcrop = new crop(req.body);
        postcrop.crop_image.data = fs.readFileSync(path.join('./public/uploads', req.file.filename));
        postcrop.crop_image.contentType = 'image/png/jpg/jpeg';
        postcrop.sellerName = req.user.name;
        postcrop.state = req.user.state;
        postcrop
            .save()
            .then(async (result) => {
                allcrops = await crop.find({ sellerName: req.user.name }).sort({ name: -1 });
                await farmerUser.findOneAndUpdate({ name: req.user.name }, { $push: { crops: postcrop._id } });
                res.render("sell", { title: req.user.name, crops: allcrops, alrt: "Crop Posted Successfully" });
            }
            )
            .catch(() => {
                res.render("404", { title: "404 Error" });
            }
            );
        fs.unlink(path.join('./public/uploads', req.file.filename), (err) => {
            if (err) throw new Error(err);
        }
        );
    },
    //buy crop
    buyCrop: async (req, res) => {
        try {

            const id = req.params.id;
            const name = req.user.name;
            const bid = req.body.bid;
            if (name === "Bids") {
                res.redirect("/bids/" + id);
            }
            else {
                var obj = await crop.findOne({ _id: id });
                var temp;
                if (obj.bids.length > 0) {
                    temp = obj.bids.sort(function (a, b) { return a.amount - b.amount });
                    temp = temp.reverse();
                }
                if ((obj.bids.length === 0 || parseInt(temp[0].amount) < bid) && bid > (parseInt(obj.basePrice) * parseInt(obj.quantity))) {
                    var result = await buyerUser.findOne({ name: name });
                    if (result != null) {
                        var x = {
                            buyer: result.name,
                            buyerid: result._id,
                            amount: bid
                        };
                        var result2 = await crop.findByIdAndUpdate(id, { $push: { bids: x } });
                        var x = {
                            crop: result2._id,
                            amount: bid
                        };
                        var result = await buyerUser.findOneAndUpdate({ name: name }, {
                            $push: {
                                bids: x
                            }
                        });
                        if (result2 != null) {
                            allcrops = await crop.find({}).sort({ name: -1 });
                            res.render("buy", { crops: allcrops, title: name, alrt: "Bid Placed Successfully" });
                        }
                        else {
                            allcrops = await crop.find({}).sort({ name: -1 });
                            res.render("buy", { crops: allcrops, title: name, alrt: "Bid Unsuccessful" });
                        }
                    }
                    else {
                        allcrops = await crop.find({}).sort({ name: -1 });
                        res.render("buy", { crops: allcrops, title: name, alrt: "Bid Failed" });
                    }
                }
                else {
                    allcrops = await crop.find({}).sort({ name: -1 });
                    res.render("buy", { crops: allcrops, title: name, alrt: "Place a higher Bid" });
                }
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //view crops available with filters for buyer
    buySearch: async (req, res) => {
        try {
            const { search } = req.query;
            const name = req.user.name;
            allcrops = await crop.find({ $or: [{ name: search }, { state: search }, { sellerName: search }, { basePrice: search }, { quantity: search }, { category: search }, { startDate: search }] }).sort({ createdAt: -1 });
            if (allcrops != null) {
                res.render("buy", { crops: allcrops, title: name, alrt: "" });
            }
            else {
                res.render("buy", { crops: allcrops, title: name, alrt: "No results" });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //view crops available with filters for seller
    sellSearch: async (req, res) => {
        try {
            const { search } = req.query;
            const sellername = req.user.name;
            allcrops = await crop.find({ $and: [{ $or: [{ name: search }, { state: search }, { basePrice: search }, { quantity: search }, { category: search }, { startDate: search }] }, { sellerName: sellername }] }).sort({ createdAt: -1 });
            if (allcrops != null) {
                res.render("sell", { crops: allcrops, title: sellername, alrt: "" });
            }
            else {
                res.render("sell", { crops: allcrops, title: sellername, alrt: "No results" });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //view all crops available for all users 
    bids: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await crop.findById(id);
            if (result != null && result.bids.length > 0) {
                var obj = result.bids.sort(function (a, b) { return a.amount - b.amount });
                obj = obj.reverse();
                if (obj != [] && obj != null) {
                    res.render("bids", { bids: obj, crop: result, title: "Bids", alrt: "" });
                }
            }
            else {
                obj = [{ length: 0 }];
                res.render("bids", { bids: obj, crop: result, title: "Bids", alrt: "No Bids" });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //view all crops available for the buyer
    bidsForBuyer: async (req, res) => {
        try {
            const id = req.params.id;
            const name = req.user.name;
            const result = await crop.findById(id);
            if (result != null && result.bids.length > 0) {
                var obj = result.bids.sort(function (a, b) { return a.amount - b.amount });
                obj = obj.reverse();
                if (obj != [] && obj != null) {
                    res.render("bids", { bids: obj, crop: result, title: name, alrt: "" });
                }
            }
            else {
                obj = [{ length: 0 }];
                res.render("bids", { bids: obj, crop: result, title: name, alrt: "No Bids" });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
    //view all crops available for the seller
    bidsForSeller: async (req, res) => {
        try {
            const id = req.params.id;
            const name = req.user.name;
            const result = await crop.findById(id);
            if (result != null && result.bids.length > 0) {
                var obj = result.bids.sort(function (a, b) { return a.amount - b.amount });
                obj = obj.reverse();
                if (obj != [] && obj != null) {
                    res.render("bids", { bids: obj, crop: result, title: "Bids", alrt: "" });
                }
            }
            else {
                obj = [{ length: 0 }];
                res.render("bids", { bids: obj, crop: result, title: "Bids", alrt: "No Bids" });
            }
        }
        catch (err) {
            res.render("404", { title: "404 Error" });
        }
    },
}