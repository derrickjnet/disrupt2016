var ROBOT_IP = '10.103.7.157';

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');
var braintree = require("braintree");
var exec = require('child_process').exec;

var BraintreeClient = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "2f4zy99wv9btxr3t",
  publicKey: "dfnj9h8hk4ygz4zj",
  privateKey: "0a38e5eddc9cd06683a1dea18bc4654f"
});

var VisualRecognitionClient = new VisualRecognitionV3({
  api_key: '30160acbd394c780ea8cc45a9111e422346fbfa1',
  version_date: '2016-05-19'
});

var express = require('express');
var morgan = require('morgan');
var app = express();

//Enabling parsing request body in json and x-www-form-urlencoded
var bodyParser = require('body-parser');
app.use(bodyParser.json()); //Parses application/json
app.use(bodyParser.urlencoded({extended: true})); //Parses application/x-www-form-urlencoded
app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization,platform');
  res.setHeader('Access-Control-Allow-Credentials', true);
  return next();
});

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

app.get('/api/train', function(req, res, next) {

  var visualPromise = new Promise((resolve, reject) => {

    var params = {
      name: 'watson-shirt',
      watson_shirt_positive_examples: fs.createReadStream(__dirname + '/trainings/watson-shirt/watsonshirt.zip'),
      holdingwatson_shirt_positive_examples: fs.createReadStream(__dirname + '/trainings/watson-shirt/holdingshirt.zip'),
      negative_examples: fs.createReadStream(__dirname + '/trainings/watson-shirt/twilioshirt.zip')
    };

    VisualRecognitionClient.createClassifier(params, function(err, response) {
      if(err) console.log(err);

      resolve(response);
    });
  });

  visualPromise.then((result) => {
    res.send(result);
  })
});

app.get('/api/test', function(req, res, next) {

  var visualPromise = new Promise((resolve, reject) => {

    var params = {
      images_file: fs.createReadStream(__dirname + '/resources/watson-shirt.jpg')
    };

    VisualRecognitionClient.classify(params, function(err, response) {
      if(err) console.log(err);

      resolve(response);
    });
  });

  visualPromise.then((result) => {
    res.send(result)
  });

});

app.get("/api/orders", (req, res, next) => {
  res.json(orders);
});

app.get("/api/newPicture", (req, res, next) => {
  exec('sshpass -p "nao" scp -r nao@' + ROBOT_IP + ':/home/nao/recordings/cameras/hi.jpg ./resources/image.jpg', function callback(error, stdout, stderr){
    console.log(error);
    console.log(stdout);
    console.log(stderr);
    return res.send();
  });
  
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res, next) => {
  res.render('index.html');
});


var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log(`Listening on ${PORT}`);
});

