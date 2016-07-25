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

app.set('view options', {
  layout: false
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('no_layout', {
    title: 'Express Handlebars Test',
  });
});

app.get('/with_layout', function(req, res){
  res.render('blank', {
    layout: 'layout'
  });
});

suite('no layout');

var server = app.listen(3002);
describe('server', function () {
  before(function (done) {
    done();
  });
  after(function() {
    server.close();
  })
});

describe('request layout', function () {
  it('index', function (done) {
    var expected = fs.readFileSync(__dirname + '/../fixtures/index_no_layout.html', 'utf8');

    request('http://localhost:3002', function(err, res, body) {
      assert.equal(body, expected);
      done();
    });
  });

  it('index w/layout', function (done) {
    var expected = fs.readFileSync(__dirname + '/../fixtures/index_no_layout.html', 'utf8');

    request('http://localhost:3002/with_layout', function(err, res, body) {
      assert.equal(body, expected);
      done();
    });
  });
});
