var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    moment = require('moment'),
    i18n = require('i18n');

var eventSchema = new Schema({
    category: ObjectId,
    title: String,
    starts: {type: Date, default: new moment().sod()},
    ends: {type: Date, default: new moment().eod()},
    every: {type: Number, default: 0},
    openhour: {type: Number, default: 0 },
    openminute: {type: Number, default: 0},
    closehour: {type: Number, default: 23} ,
    closeminute: {type: Number, default: 45},
    www: String,
    fee: String
});

var Event = mongoose.model('Event', eventSchema);
Event.schema.path('title').validate(function(value) {
   return /^\s*$/.test(value);
}, i18n.__('ERROR_EMPTY_TITLE'));


module.exports = Event; 
