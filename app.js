const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const appRoutes = require("./routes/routes");
const DBURI =
    "mongodb+srv://dhruvil1808:Dhruvil1234@cluster0.6wkxh.mongodb.net/Horizon?retryWrites=true&w=majority";
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose
    .connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(app.listen(port))
    .catch((err) => console.log(err));

app.use(appRoutes);