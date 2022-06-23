const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
//middleware for user authentication

function initialize(passport, getUserByName, getUserById) {
    const authenticateUser = async (search1, search2, done) => {
        const user = await getUserByName(search1);
        if (user == null) {//if no such user
            return done(null, false, { message: 'No user with credentials' });
        }
        try {
            if (await bcrypt.compare(search2, user.password)) {//if user is present but password is wrong
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'Incorrect password' });
            }
        }
        catch (err) {
            return done(err);
        }
    }
    passport.use(new localStrategy({ usernameField: 'search1', passwordField: 'search2' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id));
    });
}
module.exports = initialize;