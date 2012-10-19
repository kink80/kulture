var Category = require('../models/category.js'),
    Event = require('../models/event.js'),
    moment = require('moment');

exports.addcategory = function(title, callback) {
  Category.findOne({title: title }, function(err, cat) {
     if(cat) {
       callback({error: 'exists'}, null);
     } else {
      var category = new Category({ title: title });
      category.save();
      callback(null, {
          category: category
      });
     }
  });
};

exports.setdefaultcategory = function(title, callback) {
  Category.update({}, { $set: {isdefault: false} }, false, true); 
  Category.findOne({title: title }, function(err, cat) {
    cat.isdefault = true;
    cat.save();
    callback(null, {
        category: cat
    });
  });
};

exports.getdefaultcategory = function(callback) {
  Category.findOne({isdefault: true}, function(err, cat) {
    callback(null, cat);
  });
};

exports.todaysformatteddate = function() {
  var date = new moment();
  return date.format("YYYYMMDD");
};

exports.listcategories = function(callback) {
  Category.find({}, function(err, categories) {
    callback(null, { 
        categories: categories
    });
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
    callback(null, {
       event: evt
    });
  });
};

linkObject = function(date, title) {
   var dt = new moment(date);
   var url = '/events/' + dt.format('YYYYMMDD') + '/' + title;
   var linkname = dt.format('DD/MM');
   return {
     link: url,
     name: linkname
   }; 
};

exports.listEvents = function(title, date, callback) {
   var date = moment(date, ["YYYYMMDD", "YYMMDD", "YYMM", "YYYY"]);
   if(!date.isValid()) {
       date = moment();
   }
   Category.findOne({title: title}, function(err, category) {
     var futuredates = [];
     var startdate = date;
     for(var i = 0; i < 7; i++) {
       var dt = new moment(date).add('d', i);
       futuredates.push(linkObject(dt, title));
     };

     var events = Event.find({
         category: category._id,
         starts: {
            lte: date
         },
         ends: {
            gte: date
         }
       }, function(e, events) {
       callback(null, {
           date: date,
           futuredates: futuredates,
           today: linkObject(new moment(), title),
           category: title,
           events: events
       });
     });
   })
};
