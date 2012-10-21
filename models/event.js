var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var eventSchema = new Schema({
    category: ObjectId,
    title: String,
    starts: {type: Date, default: Date.now},
    ends: {type: Date, default: Date.now},
    every: {type: Number, default: 0},
    openhour: String,
    openminute: String,
    closehour: String,
    closeminute: String,
    www: String,
    fee: String
});

module.exports = mongoose.model('Event', eventSchema);
