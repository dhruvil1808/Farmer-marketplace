const mongoose = require("mongoose");
const schema = mongoose.Schema; //create a schema

const cropSchema = new schema( //creating a schema
    {
        sellerName: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        quantity: { type: String, required: true },
        basePrice: { type: String, required: true },
        description: { type: String, required: true },
        state: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        crop_image: {
            data: Buffer,
            contentType: String,
            required: false
        },
        bids: [{
            buyer: { type: String, required: false },
            buyerid: { type: Array, required: false },
            amount: { type: String, required: false },
        }]
    },
    { timestamps: true }
);
const crop = mongoose.model("crop", cropSchema); //creating a model with schema
module.exports = { crop };