var Group = require('../models/group');
var User = require('../models/user');

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
    app.get('/profile', isLoggedIn, loadGroups, function(req, res) {
        res.render('profile', {
            user : req.user, // get the user out of session and pass to template
            message: req.flash('loginMessage')
        });
    });
    
    // =====================================
    // GROUPS ==============================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/groups', isLoggedIn, function(req, res) {
        res.render('groups', {
            user : req.user, // get the user out of session and pass to template
            message: req.flash('loginMessage')
        });
    });
    
    app.post('/newGroup', isLoggedIn, function(req, res) {
        var group = new Group;
        var userId = req.session.passport.user;
        
        group.owner = userId;
        group.users.push( userId );
        group.name = req.body.name;
        group.isPrivate = req.body.private;
        group.save(function(err) {
            if (err)
                return console.error("Error encountered");
            return;
        });

        var user = req.user;
        user.groups.push( group.id );
        user.save(function(err) {
            if (err){
                console.log("Error saving");
                console.log(err);
                throw err;
            }
                
            return;
        });
        
        res.render('profile', {
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

// route middleware to load groups
function loadGroups(req, res, next) {
    var groups = req.user.findGroups(req, res);
    console.log(groups);
    // res.groups = groups;
    next();
}