var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var categorySchema = new Schema({
    title: String
});

module.exports = mongoose.model('Category', categorySchema);

