
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
 api.addcategory(req.params.title, function(err, cat) {
   console.log(cat);
 });
});

app.get('/cat/:title', function(req, res) {
 api.listEvents(req.params.title, function(err, events) {
    res.locals = {
      category: req.params.title,
      events: events
    };
    res.render('events');
 });
});

app.get('/', function(req, res) {
  api.listcategories(function(err, categories) {
    res.locals = {
      title: 'Categories',
      categories: categories
    }
    res.render('categories');
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
