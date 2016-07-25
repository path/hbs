// builtin
var fs = require('fs');
var assert = require('assert');

// 3rd party
var express = require('express');
var request = require('request');

// local
var hbs = require('../../');

var app = express();

// manually set render engine, under normal circumstances this
// would not be needed as hbs would be installed through npm
app.engine('hbs', hbs.__express);

// set the view engine to use handlebars
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

// value for async helper
// it will be called a few times from the template
var vals = ['foo', 'bar', 'baz'];
hbs.registerAsyncHelper('async', function(context, cb) {
  process.nextTick(function() {
    cb(vals.shift());
  });
});

var count = 0;

// fake async helper, returns immediately
// although a regular helper could have been used we should support this use case
hbs.registerAsyncHelper('fake-async', function(context, cb) {
  cb('instant' + count++);
});

app.get('/', function(req, res){
  res.render('async', {
    layout: false
  });
});

app.get('/fake-async', function(req, res) {
  res.render('fake-async', {
    layout: false
  });
});

var server = app.listen(3001, '127.0.0.1');
describe('server', function () {
  before(function (done) {
    done();
  });

  after(function () {
    server.close();
  });
});

describe('request async', function () {
  it('async #1', function (done) {
    var expected = fs.readFileSync(__dirname + '/../fixtures/async.html', 'utf8');

    request('http://127.0.0.1:3001', function(err, res, body) {
      assert.equal(body, expected);
      done();
    });
  });

  it('async #2', function (done) {
    var expected = fs.readFileSync(__dirname + '/../fixtures/fake-async.html', 'utf8');

    request('http://127.0.0.1:3001/fake-async', function(err, res, body) {
      assert.equal(body, expected);
      done();
    });
  });
});

