exports.urlFormat = function() {
  return "YYYYMMDD";
};

exports.nextDayFormat = function() {
  return "DD/MM";
};

exports.acceptedDateFormats = function() {
  return  ["YYYYMMDD", "YYMMDD", "YYMM", "YYYY"];
};

var isotopeClasses = ["alkali","alkaline-earth","lanthanoid","actinoid","transition","post-transition","metalloid","halogen"];

exports.randomIsotopeClass = function() {
 var random = Math.floor((Math.random() * 500000) + 1 ) % isotopeClasses.length; 
 return isotopeClasses[random];
};

