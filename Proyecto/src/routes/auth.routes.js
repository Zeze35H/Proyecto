module.exports = (app, passport, db) => {
    // const user = require("../controllers/user.controller.js");

    var router = require("express").Router();
    const LocalStrategy = require('passport-local').Strategy;
    const bcrypt = require('bcrypt');

    // Define the Local Strategy for Passport
    passport.use(new LocalStrategy(
        function (username, password, done) {

            console.log("LocalStrategy is being executed with", username, password);

            // Find user by username in the database
            db.user.findOne({ where: { username } })
                .then(user => {

                    console.log(user)
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username.' });
                    }

                    // Check if the password exists in the database
                    if (!user.password_token) {
                        return done(null, false, { message: 'No password found for this user.' });
                    }

                    // Compare the hashed password with the provided password
                    bcrypt.compare(password, user.password_token, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Incorrect password.' });
                        }
                    });
                })
                .catch(err => done(err));
        }
    ));

    // Serialize and deserialize the user to maintain the session
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        db.user.findByPk(id)
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    router.get('/success', (req, res) => res.send({ message: 'Login successful', user: req.user }));
    router.get('/failure', (req, res) => res.send({ message: 'Login failed' }));

    // Routes for login and logout
    router.post('/login', (req, res, next) => {
        console.log("inside auth.routes.js post(/login)");
        next();
    }, (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.log("Error:", err);
                return next(err);  // Handle any errors here
            }
            if (!user) {
                console.log("Authentication failed:", info);
                return res.redirect('/failure');
            }
            req.logIn(user, err => {
                if (err) { return next(err); }
                return res.redirect('/success');
            });
        })(req, res, next);
    });

    router.get('/logout', (req, res) => {
        req.logout(err => {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });



    app.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.send({ authenticated: true, user: req.user });
        } else {
            res.send({ authenticated: false });
        }
    });

    app.use('/api/auth', router);
};