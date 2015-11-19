module.exports = function(app, passport) {
    /* GET home page. */
    app.get('/', function(req, res) {
        res.render('index', { message: req.flash('loginMessage') });
    });
    
    // =====================================
    // LOGIN ===============================
    // =====================================
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the home page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    // =====================================
    // SIGNUP ==============================
    // =====================================
    app.post('/registerUser', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the home page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user, // get the user out of session and pass to template
            message: req.flash('loginMessage')
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}