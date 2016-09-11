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
      return $http.get('/api/products');
    }
  }
});

app.factory('Order', ($http) => {
  return {
    createOrder(productId, nonce) {
      var body = {productId: productId, nonce: nonce};
      return $http.post('/api/orders', body);
    },

    findOrders() {
      return $http.get('/api/orders');
    }
  }
});

app.controller('MainController', ($scope, Braintree, Product, Order) => {

  $scope.nonce;

  $scope.product;

  $scope.products = [];

  $scope.orders = [];

  $scope.createOrder = () => {

    Order.createOrder($scope.product.id, $scope.nonce).success(function() {
      $scope.product = null;

      refreshOrders();
    });

  };

  function refreshBraintree() {
    Braintree.getToken().success((token) => {

      braintree.setup(token.token, 'custom', {
        paypal: {container: 'paypal-button'},
        onPaymentMethodReceived: function(res) {
          $scope.nonce = res.nonce;
          $scope.$apply();
        },
        onError: function(error) {
          console.log(error);
        }
      });
    });
  }

  function refreshProducts() {
    Product.findProducts().success((products) => {
      $scope.products = products;
    });
  }

  function refreshOrders() {
    Order.findOrders().success((orders) => {
      $scope.orders = orders;
    });
  }

  refreshProducts();
  refreshBraintree();
  refreshOrders();

});