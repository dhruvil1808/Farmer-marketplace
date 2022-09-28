const mongoose = require("mongoose");
const schema = mongoose.Schema; //create a schema

//creating a schema for saving the data of different buyers.
const analytics = new schema(
    {
        sellerId: { type: String, required: true },
        sellerName: { type: String, required: true },
        cropId: { type: Array, required: true },
        cropName: { type: Array, required: true },
        count: { type: Array, required: true },

    },
    { timestamps: true }
);
const analyticsModel = mongoose.model("analytics", analytics); //creating a model with schema
module.exports = { analyticsModel };