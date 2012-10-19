
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , api = require('./controller/api.js')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , hbs = require('hbs');

var app = express();
mongoose.connect('mongodb://localhost/test');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


app.put('/addcat/:title', function(req, res) {
 api.addcategory(req.params.title, function(err, result) {
    if(err && err.error) {
      res.locals = err; 
      res.render('error');
    } else {
      res.locals = result;
      res.render('addcategory');
    }
 });
});

app.put('/defaultcat/:title', function(req, res) {
 api.setdefaultcategory(req.params.title, function(err, result) {
    res.locals = result;
    res.render('defaultcategory');
 });
});

app.get('/', function(req, res) {
  res.redirect('/events');  
});

app.get('/events/:date/:category', function(req, res) {
  api.listEvents(req.params.category, req.params.date, function(err, result) {
    res.locals = result;
    res.render('events');
  });
});


app.get('/events', function(req, res) {
  var today = api.todaysformatteddate();
  api.getdefaultcategory(function(err, category) {
    var targetUrl = '/events/' + today + '/' + category.title;
    res.redirect(targetUrl);
  });
});

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
