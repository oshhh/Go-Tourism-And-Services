'use strict';

let express = require('express');
let logtopus = require('../logtopus');
let supertest = require('supertest');

let app = express();

app.use(logtopus.express({
  logLevel: 'debug'
}));

app.get('/test', function(req, res) {
  res.send('Success!');
});

app.post('/test/add', function(req, res) {
  setTimeout(() => { res.send('Success!') }, 9);
});

app.put('/test', function(req, res) {
  res.status(500).end();
});

app.delete('/test', function(req, res) {
  res.send('Success!');
});

setTimeout(() => {
  supertest(app).get('/test?bla=blubb').end(function(err, res) {

  });

  supertest(app).post('/test/add').end(function(err, res) {

  });

  supertest(app).put('/test?bla=blubb').end(function(err, res) {

  });

  supertest(app).del('/test?bla=blubb').end(function(err, res) {

  });

  setTimeout(() => {
    logtopus.flush().then(function() {
      console.log('DONE');
    });
  }, 100);

}, 200)
