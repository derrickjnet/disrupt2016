var braintree = require("braintree");

var BraintreeClient = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "2f4zy99wv9btxr3t",
  publicKey: "dfnj9h8hk4ygz4zj",
  privateKey: "0a38e5eddc9cd06683a1dea18bc4654f"
});

var express = require('express');
var app = express();

var products = [{id: 1, name: 'Tee-shirt', amount: '15.00'}, {id: 2, name: 'Pants', amount: '30.00'}, {id: 3, name: 'Socks', amount: '7.00'}];

app.get("/products", function(req, res, next) {
  return res.json(products);
});

app.get("/braintree/token", function(req, res, next) {
  BraintreeClient.clientToken.generate({}, function(err, response) {
    res.json({token: response.clientToken});
  });
});

app.post("/checkout", function(req, res, next) {
  var nonceFromTheClient = req.body.payment_method_nonce;

  BraintreeClient.transaction.sale({
    amount: "10.00",
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, function(err, result) {

  });
});

app.listen(3000, function() {
  console.log('Listening');
});