'use strict';

var express = require('express');
var app = express();

var braintree = require('braintree');

var bodyParser = require('body-parser');
var parseUrlEnconded = bodyParser.urlencoded({
  extended: false
});

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   '28wk7997kqx3m7pt',
    publicKey:    '6js4b54ry44pj84f',
    privateKey:   '4b21caa55483514ae6c3a0767090e44c'
});

app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {

//   gateway.clientToken.generate({}, function (err, res) {
//     response.render('index', {
//       clientToken: res.clientToken
//     });
//   });
// gateway.clientToken.generate({ 
//     customerId: aCustomerId
//   }, function (err, response) {
//     var clientToken = response.clientToken
//   });
gateway.clientToken.generate({}, function (err, response) {
    var clientToken = response.clientToken
  });

});

app.post('/process', parseUrlEnconded, function (request, response) {

  var transaction = request.body;

  gateway.transaction.sale({
    amount: transaction.amount,
    paymentMethodNonce: transaction.payment_method_nonce
  }, function (err, result) {

    if (err) throw err;

    if (result.success) {

      console.log(result);

      response.sendFile('success.html', {
        root: './public'
      });
    } else {
      response.sendFile('error.html', {
        root: './public'
      });
    }
  });

});

app.listen(3000, function () {
  console.log('server is started');
});

module.exports = app;