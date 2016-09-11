var app = angular.module('website', []);

app.factory('Braintree', ($http) => {
  return {
    getToken() {
      return $http.get('/api/braintree/token');
    }
  }
});

app.factory('Product', ($http) => {
  return {
    findProducts() {
      $http.get('/api/products');
    }
  }
});

app.factory('Order', ($http) => {
  return {
    createOrder(productId, nonce) {
      var body = {nonce: nonce, productId: productId};
      return $http.post('/api/orders', body);
    },

    findOrders() {
      $http.get('/api/orders');
    }
  }
});

app.controller('MainController', ($scope, Braintree, Product, Order) => {

  function refreshBraintree() {
    Braintree.getToken().success((token) => {
      braintree.client.create({authorization: token.token}, function(err, instance) {
        console.log(err, instance);
      });
    });
  }

  refreshBraintree();

});