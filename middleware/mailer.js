require('dotenv').config();
const nodemailer = require('nodemailer');
const { buyerUser, farmerUser } = require('../model/credentials');
const { crop } = require('../model/crops');

async function sendMail() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let fullDate = year + "-" + month + "-" + date;

    try {
        var res = await crop.find({ endDate: fullDate });
    }
    catch (err) {
        console.log(err);
    }

    for (let i = 0; i < res.length; i++) {
        var result = await farmerUser.findOneAndUpdate({ name: res[i].sellerName }, { $pull: { crops: res[i]._id } });//farmer details
        var amt = (res[i].bids.sort(function (a, b) { return a.amount - b.amount })).reverse();
        var result2 = await buyerUser.findById(amt[0].buyerid[0]);//buyer details
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        var info = {
            from: process.env.EMAIL,
            to: result2.email,
            subject: 'You are the highest bidder for ' + res[i].name,
            text: 'You are the highest bidder for ' + res[i].name + '\n\n' +
                'Your bid amount is ' + amt[0].amount + '\n\n' +
                'Please contact the seller for further details.' + '\n\n' +
                'Seller Name: ' + result.name + '\n\n' +
                'Seller Phone: ' + result.pno + '\n\n' +
                'Crop Name: ' + res[i].name + '\n\n' +
                'Crop Category: ' + res[i].category + '\n\n' +
                'Crop Quantity: ' + res[i].quantity + '\n\n' +
                'Crop Description: ' + res[i].description + '\n\n'
        };

        transporter.sendMail(info, function (err, data) {
            if (err) {
                console.log('Error occurs' + err);
            } else {
                console.log('Email sent' + data);
            }
        });
        //delete 
        try {
            result = await crop.findByIdAndDelete(res[i]._id);
            result.bids.forEach(async (x) => {
                var temp = await buyerUser.findOne({ _id: x.buyerid });
                var res = [];
                temp.bids.forEach((y) => {
                    if (y.crop[0] != result._id) {
                        console.log("hello");
                        res.push(y);
                    }
                }
                );
                await buyerUser.findByIdAndUpdate(x.buyerid, { bids: res });
            });
        }
        catch (err) {
            console.log(err);
        }
    }
}
module.exports = { sendMail };