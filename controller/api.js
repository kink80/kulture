var Category = require('../models/category.js'),
    Event = require('../models/event.js'),
    moment = require('moment'),
    _ = require('underscore'),
    i18n = require('i18n'),
    settings = require('./settings.js');

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
    eventObject.starts = new moment(eventObject.starts).sod().milliseconds();
    eventObject.ends = new moment(eventObject.ends).eod().milliseconds();
    eventObject.openhour = eventObject.openhour % 24;
    eventObject.openminute = eventObject.openminute % 60;
    eventObject.cloeshour = eventObject.closehour % 24;
    eventObject.closeminute = eventObject.closeminute % 60;
    var evt = new Event(eventObject);
    evt.save();
    callback(null, evt);
  });
};

var linkObject = function(date, title) {
   var dt = new moment(date),
       url = '/events/' + dt.format(settings.urlFormat()) + '/' + title,
       linkname = dt.format(settings.nextDayFormat()),
       dayname = i18n.__(dt.format('dddd'));
   return {
     link: url,
     name: linkname,
     dayname: dayname
   }; 
};

var listEventsForDate = function(title, date, callback) {
   var date = moment(date, settings.acceptedDateFormats());
   if(!date.isValid()) {
       date = moment();
   }
   Category.findOne({title: title}, function(err, category) {
     Event.find({
            category: category._id,
            starts: { $lte: date },
            ends: { $gte: date }
       }, function(e, events) {
       var filtered = _.filter(events, function(event) {
         if(event.every === 0) {
           return true;
         } else {
           var from = moment(date),
               start = moment(event.starts),
               diff = from.sod().milliseconds() - start.sod().milliseconds();              return diff % event.every == 0;
         }
         return false;
       });
       callback(null, {
           date: date,
           today: linkObject(new moment(), title),
           category: title,
           events: filtered
       });
     });
   })
};

var listOtherCategories = function(currentCategory, callback) {
  Category.find({ title: { $ne: currentCategory }}, function(err, categories) {
    callback(err, categories);
  });
};

exports.listEvents = function(title, date, callback) {
   var date = moment(date, settings.acceptedDateFormats()),
       futuredates = [];
   if(!date.isValid()) {
       date = moment();
   }
   for(var i = 0; i < 7; i++) {
      var dt = new moment(date).add('d', i);
      futuredates.push(linkObject(dt, title));
   }
   listEventsForDate(title, date, function(err, result) {
     result.futuredates = futuredates;
     listOtherCategories(title, function(e, r) {
        result.othercategories = _.map(r, function(other) {
          var otherlinktoday = linkObject(new moment(), other.title);
          otherlinktoday.title = other.title;
          return otherlinktoday;
        });
        callback(e, result);
     });
   });
};
