module.exports = (app, passport, db) => {
    // const user = require("../controllers/user.controller.js");

    var router = require("express").Router();
    const LocalStrategy = require('passport-local').Strategy;
    const bcrypt = require('bcrypt');

    // Define the Local Strategy for Passport
    passport.use(new LocalStrategy(
        function (username, password, done) {
            // Find user by username in the database
            db.user.findOne({ where: { username } })
                .then(user => {

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

    router.get('/success', (req, res) => {
        console.log(req)
        req.session.id_user = req.user.id; // Assuming req.user contains the user after Passport authentication
        req.session.signed_in = new Date(); // Store the signed-in time
        res.send({ message: 'Login successful', user: req.user })
    });
    router.get('/failure', (req, res) => res.send({ message: 'Login failed' }));

    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/api/auth/failure');
            }

            // Manually log in the user
            req.logIn(user, err => {
                if (err) {
                    console.log("inside err")
                    return next(err);
                }

                // Ensure id_user and signed_in fields are properly set before saving session
                if (!req.session.id_user) {
                    req.session.id_user = user.id;
                    console.log('Set session id_user:', req.session.id_user);
                }

                if (!req.session.signed_in) {
                    req.session.signed_in = new Date();
                    console.log('Set session signed_in:', req.session.signed_in);
                }

                req.session.save(err => {
                    if (err) {
                        console.error('Error saving session:', err);
                        return res.status(500).send({ message: 'Error saving session' });
                    }
                    console.log('Session saved successfully:', req.session);
                    return res.redirect('/api/auth/success');
                });
            });
        })(req, res, next);
    });




    router.post('/logout', (req, res) => {
        console.log("inside auth.routes logout")
        req.logout(err => {
            if (err) {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while logging out the User."
                });
            }
            req.session.destroy(err => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).send({
                        message: "Error occurred while destroying the session."
                    });
                }

                // Clear the cookie for the session (optional)
                res.clearCookie('connect.sid', { path: '/' });

                // Send success response or redirect the user to the login page
                res.send({ message: "Logged out successfully" });
            });
        });
    });

    router.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.send({ authenticated: true, user: req.user });
        } else {
            res.send({ authenticated: false });
        }
    });

    app.use('/api/auth', router);
};