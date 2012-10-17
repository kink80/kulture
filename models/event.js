var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var eventSchema = new Schema({
    category: ObjectId,
    type: String,
    starts: {type: Date, default: Date.now},
    ends: {type: Date, default: Date.now},
    www: String,
    fee: String
});

module.exports = mongoose.model('Event', eventSchema);
