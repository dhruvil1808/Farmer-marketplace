//getting all the enviroment variables
require('dotenv').config();

//creating an express app and requiring all the node modules
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require('method-override');
const appRoutes = require("./routes/appRoutes");
const cron = require('node-cron');
const settingRoutes = require("./routes/settingRoutes");
const DBURI = process.env.DBURI;
const port = process.env.PORT || 3000;
const { sendMail } = require("./middleware/mailer");

//connecting to the database and listening to the port
mongoose
    .connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(app.listen(port))
    .catch((err) => console.log(err));

//setting the express app
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

//initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

//scheduler for running check everyday at 12:00
cron.schedule('0 0 0 * * *', () => {
    sendMail();
});

//routes
app.use(appRoutes);
app.use(settingRoutes);

//404
router.use((req, res) => {
    res.render('404.ejs', { title: '404 Error hai', alrt: '' });
}
);