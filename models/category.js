var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var categorySchema = new Schema({
    title: String,
    isdefault: {type: Boolean, default: false} 
});

module.exports = mongoose.model('Category', categorySchema);

