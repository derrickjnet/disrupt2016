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
var orders = [];

app.get("/api/products", function(req, res, next) {
  return res.json(products);
});

app.get("/api/braintree/token", function(req, res, next) {
  BraintreeClient.clientToken.generate({}, function(err, response) {
    res.json({token: response.clientToken});
  });
});

app.post("/api/orders", function(req, res, next) {
  var nonce = req.body.nonce;
  var productId = req.body.productId;

  var transactionPromise = new Promise((resolve, reject) => {
    var product = products.filter((product => product.id === productId))[0];

    BraintreeClient.transaction.sale({amount: product.amount, paymentMethodNonce: nonce, options: {submitForSettlement: true}}, function(err, result) {
      orders.push({id: Math.random(), total: product.amount, products: [product], created: Date.now()});

      resolve();
    });
  });

  transactionPromise.then(() => {
    res.send();
  });
});

app.get("/api/orders", (req, res, next) => {
  res.json(orders);
});

var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});