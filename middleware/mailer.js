require('dotenv').config();
const nodemailer = require('nodemailer');
const { buyerUser, farmerUser } = require('../model/credentials');
const { crop } = require('../model/crops');

async function sendMail() {
    //getting current date in YYYY-MM-DD format
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let fullDate = year + "-" + month + "-" + date;

    try {
        //getting the crops that have end date equal to todays date
        var res = await crop.find({ endDate: { $lte: fullDate } });
    }
    catch (err) {
        console.log(err);
    }

    for (let i = 0; i < res.length; i++) {
        //for farmer details
        var result = await farmerUser.findOneAndUpdate({ name: res[i].sellerName }, { $pull: { crops: res[i]._id } });
        // for getting the highest bid
        var amt = (res[i].bids.sort(function (a, b) { return a.amount - b.amount })).reverse();
        //for buyer details
        var result2 = await buyerUser.findById(amt[0].buyerid[0]);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "dhruvil317@gmail.com",
                pass: "0204200818082002"
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
                console.log(err);
            }
        });
        //clearing database for redudandant data
        try {
            result = await crop.findByIdAndDelete(res[i]._id);
            result.bids.forEach(async (x) => {
                var temp = await buyerUser.findById(x.buyerid);
                var res = [];
                for (let i = 0; i < temp.bids.length; i++) {
                    if (!temp.bids[i].crop[0].equals(result._id)) {
                        res.push(temp.bids[i]);
                    }
                    await buyerUser.findByIdAndUpdate(x.buyerid, { bids: res });
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    }
}
module.exports = { sendMail };