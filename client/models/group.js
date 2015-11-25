var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// define the schema for our user model
var groupSchema = mongoose.Schema({
    name        : { type: String, required: true },
    isPrivate   : Boolean,
    owner       : { type: ObjectId, ref: 'User' },
    users       : [{ type: ObjectId, ref: 'User'}],
    created_at  : Date,
    updated_at  : Date
});

// methods ======================
// pre-save method adds / updates dates
groupSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    
    next();
});

module.exports = mongoose.model('Group', groupSchema);