require('dotenv').config();
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require('method-override')
const appRoutes = require("./routes/appRoutes");
const settingRoutes = require("./routes/settingRoutes");
const DBURI = process.env.DBURI;
const port = process.env.PORT || 3000;

mongoose
    .connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(app.listen(port))
    .catch((err) => console.log(err));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.use(appRoutes);
app.use(settingRoutes);

router.use((req, res) => {
    res.render('404.ejs', { title: '404 Error hai', alrt: '' });
}
);