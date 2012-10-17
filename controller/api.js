var Category = require('../models/category.js'),
    Event = require('../models/event.js');

exports.addcategory = function(title, callback) {
  var category = new Category({ title: title });
  category.save();
  callback(null, category);
};

exports.listcategories = function(callback) {
  Category.find({}, function(err, categories) {
    callback(null, categories);
  });
};

exports.addEvent = function(category, type, www, fee, callback) {
  Category.findOne({title: category}, function(err, category) {
    var evt = new Event({
      category: category._id,
      type: type,
      www: www,
      fee: fee
    }).save();
    callback(null, evt);
  });
};

exports.listEvents = function(title, callback) {
   Category.findOne({title: title}, function(err, category) {
     var events = Event.find({category: category._id}, function(e, events) {
       callback(null, events);
     });
   })
};
