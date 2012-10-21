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

exports.deletecategory = function(title, callback) {
  Category.findOne({title: title}, function(err, cat) {
    if(cat) {
      Event.remove({category: cat._id});
      cat.remove(function(err) {
        callback(err);   
      });
    } else {
      callback();
    }
  });
};

exports.deleteallcategories = function(callback) {
  Category.find({}, function(e, cats) {
      cats.forEach(function(c) {
        c.remove();
      });
      callback(e);
  });
};

exports.setdefaultcategory = function(title, callback) {
  Category.find({}, function(e, cats) {
      cats.forEach(function(c) {
        c.isdefault = (c.title === title);
        c.save();
      });
      callback(e);
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

exports.newEvent = function(title, callback) {
 var hours = [];
 for(var i = 0; i < 24; i++) {
   hours.push(i);
 };
 var minutes = [0, 15, 30, 45];
 var repeats = [24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000];
 callback(null, {
    category: title,
    openinghour: hours,
    openingminute: minutes,
    closinghour: hours,
    closingminute: minutes,
    repeats: repeats
 });
};

exports.addEvent = function(title, eventObject, callback) {
  Category.findOne({title: title}, function(err, category) {
    eventObject.category = category._id;
    var evt = new Event(eventObject);
    evt.save();
    callback(null, evt);
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

exports.listCategoryEvents = function(title, callback) {
  Category.findOne({title: title}, function(err, category) {
    var events = Event.find({
         category: category._id,
       }, function(e, events) {
       callback(null, {
           events: events
       }); 
     });
  });
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
