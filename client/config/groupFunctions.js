var User = require('../models/user');
var Group = require('../models/group');

module.exports = {
    createGroup: function(req, res, next) {
        console.log(req.body);
        var group = new Group;
        group.name = req.body.name;
        group.isPrivate = req.body.private;
        group.save(function(err) {
            if (err)
                throw err();
            return;
        });
        
        res.render('profile', {
            user : req.user, // get the user out of session and pass to template
            message: req.flash('loginMessage')
        });
    }
};