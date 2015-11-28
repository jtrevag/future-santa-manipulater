var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and deserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        console.log("Signing up");
        
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            console.log("Called findOne, got errors: " + err);
            console.log(req.body);
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                console.log("Found an existing user with that name.");
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else if (password != req.body.confirmPassword) {
                console.log("Passwords did not match");
                return done(null, false, req.flash('signupMessage', 'Your passwords did not match.'));
            } else {
                console.log("Successfully validated. Creating user");
                var newUser            = new User();
                newUser.local.firstName = req.body.firstName;
                newUser.local.lastName  = req.body.lastName;    
                newUser.local.email     = email;
                newUser.local.password  = newUser.generateHash(password);

                // save the user
                console.log("Saving user" + newUser);
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));
    
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user || !user.validPassword(password))
            {
                return done(null, false, req.flash('loginMessage', 'Invalid email or password.')); // req.flash is the way to set flashdata using connect-flash
            }

            // all is well, return successful user
            return done(null, user);
        });

    }));
    
    // =========================================================================
    // LOCAL PROFILE UPDATE=========================================================
    // =========================================================================
    passport.use('local-profile-update', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user || !user.validPassword(password))
            {
                return done(null, false, req.flash('loginMessage', 'Invalid email or password.')); // req.flash is the way to set flashdata using connect-flash
            }
            // make sure passwords are correct
            else if (password != req.body.confirmPassword) {
                console.log("Passwords did not match");
                return done(null, false, req.flash('signupMessage', 'Your passwords did not match.'));
            }
            // save the user to the database
            else
            {
                console.log("Successfully validated. Updating user");
                var updatedUser            = new User();
                updatedUser.local.firstName = req.body.firstName;
                updatedUser.local.lastName  = req.body.lastName;    
                updatedUser.local.email     = email;
                updatedUser.local.color     = req.body.color;
                updatedUser.local.show      = req.body.show;
                updatedUser.local.team      = req.body.team;
                updatedUser.local.hobbies   = req.body.hobbies;
                updatedUser.local.notes     = req.body.notes;
                

                // save the user
                console.log("Saving user" + updatedUser);
                updatedUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, updatedUser);
                });
            }

            // all is well, return successful user
            return done(null, user);
        });

    }));

};