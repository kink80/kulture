
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
  , hbs = require('hbs')
  , i18n = require('i18n');

var app = express();
mongoose.connect('mongodb://localhost/test');

i18n.configure({
    locales:['en', 'cz'],
    register: global
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(i18n.init);
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/cat/list', function(req, res) {
  api.listcategories(function(err, result) {
    res.locals = result;
    res.render('categories');
  });
});

app.post('/cat/add', function(req, res) {
 api.addcategory(req.body.title, function(err, result) {
    if(err && err.error) {
      res.locals = err; 
      res.render('error');
    } else {
        res.redirect('/cat/list');
    }
 });
});

app.post('/cat/default', function(req, res) {
 api.setdefaultcategory(req.body.title, function(err, result) {
    res.redirect('/cat/list');
 });
});

app.post('/cat/delete', function(req, res) {
 api.deletecategory(req.body.title, function(err, result) {
    res.redirect('/cat/list');
 });
});

app.post('/cat/deleteall', function(req, res) {
 api.deleteallcategories(function(err, result) {
    res.redirect('/cat/list');
 });
});

app.get('/cat/listevents/:title', function(req, res) {
 api.listCategoryEvents(req.params.title, function(err, result) {
    res.locals = result;
    res.render('allevents');
 });
});

app.get('/cat/newevent/:title', function(req, res) {
  api.newEvent(req.params.title, function(err, result) {
     res.locals = result;
     res.render('newevent');
  });
});

app.post('/cat/addevent/:title', function(req, res) {
  api.addEvent(req.params.title, req.body, function(err, result) {
     res.redirect('/cat/listevents/' + req.params.title);
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

hbs.registerHelper('__', function(key, parameters) {
  return i18n.__(key, parameters);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
