const express = require('express');
const app = express.Router();
app.get('/signin', (req, res) => {
    res.render('signin.ejs', { title: 'Sign In', alrt: '' });
}
);
app.get('/sign-up', (req, res) => {
    res.render('signup.ejs', { title: 'Sign Up', alrt: '' });
}
);
app.get('/reset', (req, res) => {
    res.render('reset.ejs', { title: 'Reset Password', alrt: '' });
}
);
app.get('/', (req, res) => {
    res.render('home.ejs', { title: 'Horizon', alrt: '' });
}
);
app.get('/about', (req, res) => {
    res.render('about.ejs', { title: 'About', alrt: '' });
}
);
app.use((req, res) => {
    res.render("404", { title: "404 Error" });
});
module.exports = app;