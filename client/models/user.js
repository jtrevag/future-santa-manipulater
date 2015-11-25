var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var bcrypt   = require('bcrypt-nodejs');

var Group = require('../models/group');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        firstName    :  { type: String, trim: true },
        lastName     :  { type: String, trim: true },
        email        : { type: String, required: true, unique: true },
        password     : { type: String, required: true, unique: true },
    },
    groups          : [{ type: ObjectId, ref: 'Group'}],
    created_at      : Date,
    updated_at      : Date
});

// methods ======================

// pre-save method adds / updates dates
userSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    
    next();
});

// Get group objects associated with user
userSchema.methods.findGroups = function(req, res) {
    var groups = Array();
    for (var i = 0; i < this.groups.length; i++) {
        var groupId = this.groups[i];
        Group.findById(groupId).exec(function (err, group) {
            if (err) {
                console.error("Got an error finding group: " + err);
                //throw err;
            } else{
                console.log("Found group: " + group);
            }
            groups.push(group);
            if (groups.length === i + 1) {
                res.groups = groups;
            }
        });
    }
};

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);