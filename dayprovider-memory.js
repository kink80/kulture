var moment = require('moment');

DayProvider = function() {};


DayProvider.prototype.getOneWeek = function(callback) {
  var dates = [];
  for(var i = 0; i < 7; i++) {
    var mmt = moment().add('d', i);
    var date = {
      milliseconds: mmt.milliseconds(),
      formatted: mmt.format("MMMM DD")
    };
    dates.push(date);
  };
  callback(null, dates);
};

exports.DayProvider = DayProvider;
