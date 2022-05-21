const mongoose = require("mongoose");
const schema = mongoose.Schema; //create a schema

const userSchema = new schema( //creating a schema
    {
        name: { type: String, required: true },
        aadhar: { type: String, required: true },
        email: { type: String, required: true },
        pno: { type: String, required: true },
        dob: { type: String, required: true },
        password: { type: String, required: true },
        crops: { type: Array, required: false },
        amount: { type: Array, required: false },
    },
    { timestamps: true }
);
const userSchema2 = new schema( //creating a schema
    {
        name: { type: String, required: true },
        aadhar: { type: String, required: true },
        kisaan_id: { type: String, required: true },
        pno: { type: String, required: true },
        dob: { type: String, required: true },
        password: { type: String, required: true },
        crops: { type: Array, required: false },
    },
    { timestamps: true }
);
const buyerUser = mongoose.model("buyeruser", userSchema); //creating a model with schema
const farmerUser = mongoose.model("farmeruser", userSchema2); //creating a model with schema
module.exports = { buyerUser, farmerUser };
