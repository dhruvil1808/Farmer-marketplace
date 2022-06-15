const { buyerUser, farmerUser } = require('../model/credentials');
const { crop } = require('../model/crops');
const fs = require('fs');
const path = require('path');
module.exports = {
    postCrop: (req, res, next) => {
        const name = req.params.farmername;
        const postcrop = new crop(req.body);
        postcrop.crop_image.data = fs.readFileSync(path.join('./public/uploads', req.file.filename));
        postcrop.crop_image.contentType = 'image/png/jpg/jpeg';
        postcrop.sellerName = name;
        postcrop
            .save()
            .then(async (result) => {
                allcrops = await crop.find({ sellerName: name }).sort({ name: -1 });
                await farmerUser.findOneAndUpdate({ name: name }, { $push: { crops: postcrop._id } });
                res.render("sell", { title: name, crops: allcrops, alrt: "Crop Posted Successfully" });
            }
            )
            .catch((err) => {
                res.render("404", { title: "404 Error hai" });
            }
            );
        fs.unlink(path.join('./public/uploads', req.file.filename), (err) => {
            if (err) throw err;
            console.log('successfully deleted');
        }
        );
    },
    buyCrop: async (req, res) => {
        const id = req.params.id;
        const name = req.params.name;
        const bid = req.body.bid
        var obj = await buyerUser.findOne({ crops: id });
        if (obj == null) {
            var result = await buyerUser.findOneAndUpdate({ name: name }, {
                $push: {
                    crops: id
                }
            });
            var result = await buyerUser.findOneAndUpdate({ name: name }, {
                $push: { amount: bid }
            });
            if (result != null) {
                var result2 = await crop.findByIdAndUpdate(id, { $push: { buyers: result._id } });
                var result3 = await crop.findByIdAndUpdate(id, { $push: { amount: bid } });
                if (result2 != null && result3 != null) {
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
            res.render("buy", { crops: allcrops, title: name, alrt: "" });
        }
    },
    buySearch: async (req, res) => {
        const { search } = req.query;
        const name = req.params.name;
        allcrops = await crop.find({ $or: [{ name: search }, { sellerName: search }, { basePrice: search }, { quantity: search }, { category: search }, { startDate: search }] }).sort({ createdAt: -1 });
        if (allcrops != null) {
            res.render("buy", { crops: allcrops, title: name, alrt: "" });
        }
        else {
            res.render("buy", { crops: allcrops, title: name, alrt: "No results" });
        }
    },
    sellSearch: async (req, res) => {
        const { search } = req.query;
        const sellername = req.params.name;
        allcrops = await crop.find({ $and: [{ $or: [{ name: search }, { basePrice: search }, { quantity: search }, { category: search }, { startDate: search }] }, { sellerName: sellername }] }).sort({ createdAt: -1 });
        if (allcrops != null) {
            res.render("sell", { crops: allcrops, title: sellername, alrt: "" });
        }
        else {
            res.render("sell", { crops: allcrops, title: sellername, alrt: "No results" });
        }
    }
}
