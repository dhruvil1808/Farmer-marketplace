const mongoose = require("mongoose");
const schema = mongoose.Schema; //create a schema

const cropSchema = new schema( //creating a schema
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        quantity: { type: String, required: true },
        basePrice: { type: String, required: true },
        description: { type: String, required: true },
        crop_image: { type: Image, required: true },
    },
    { timestamps: true }
);
const crop = mongoose.model("crop", cropSchema); //creating a model with schema
module.exports = { crop };