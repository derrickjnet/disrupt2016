var braintree = require("braintree");

var BraintreeClient = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "2f4zy99wv9btxr3t",
  publicKey: "dfnj9h8hk4ygz4zj",
  privateKey: "0a38e5eddc9cd06683a1dea18bc4654f"
});

var express = require('express');
var app = express();

//Enabling parsing request body in json and x-www-form-urlencoded
var bodyParser = require('body-parser');
app.use(bodyParser.json()); //Parses application/json
app.use(bodyParser.urlencoded({extended: true})); //Parses application/x-www-form-urlencoded

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

  var product = products.filter((product => product.id === productId))[0];

  var transactionPromise = new Promise((resolve, reject) => {

    BraintreeClient.transaction.sale({amount: product.amount, paymentMethodNonce: nonce, options: {submitForSettlement: true}}, function(err, result) {
      resolve();
    });
  });

  transactionPromise.then(() => {
    orders.push({id: Math.random().toString(36).substring(7), total: product.amount, products: [product], created: Date.now()});

    res.send();
  });
});

app.get("/api/orders", (req, res, next) => {
  res.json(orders);
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res, next) => {
  res.render('index.html');
});


var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});