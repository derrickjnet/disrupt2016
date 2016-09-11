var app = angular.module('website', []);

app.constant('API_SERVER', 'http://10.103.15.245:3000');

//console.log(app.config);

//app.run(function() {
  // RobotUtils.onService(function(ALTextToSpeech, ALMotion, ALPhotoCapture) {


  //   // Bind button callbacks
  //   $(".sayItButton").click(function() {
  //     //ALTextToSpeech.say($(this).html());

  //     //var textToSay = $('.inputText').val();

  //     //ALTextToSpeech.say(textToSay);

  //     ALPhotoCapture.takePicture('/home/nao/recordings/cameras', 'hi.jpg').then(function(data) {
  //       console.log(data);

  //       $.get(API_SERVER + '/api/newPicture', function( data ) {
  //         console.log(data);
  //       });

  //       // $.ajax({
  //       //   method: 'GET',
  //       //   url: 'google.com'
  //       // }).done(function(res) {
  //       //   $('.outputText').val('worked');
  //       //   console.log('res=');
  //       //   console.log(res);
  //       // }).fail(function(err, err2, err3, err4) {
  //       //   $('.outputText').val('didnt work');
  //       //   console.log('err=');
  //       //   console.log(err);
  //       //   console.log(err2);
  //       //   console.log(err3);
  //       //   console.log(err4);
  //       // });
  //     }, function(err) {
  //       console.log(err);
  //     });
  //     //console.log(pic);


  //     //ALMotion.move(1.0, 0.0, 0.0);
  //   });


  //   // $(function() {
  //   //   $('#simple_sketch').sketch();
  //   // });


  // }, function(err) {
  //   console.log('error in RobotUtils.onService');
  //   console.log(err);
  // });
//});

app.factory('Braintree', function($http) {
  return {
    getToken: function() {
      return $http.get('/api/braintree/token');
    }
  }
});

app.factory('Product', function($http) {
  return {
    findProducts: function() {
      return $http.get('/api/products');
    }
  }
});

app.factory('Order', function($http) {
  return {
    createOrder: function(productId, nonce) {
      var body = {productId: productId, nonce: nonce};
      return $http.post('/api/orders', body);
    },

    findOrders: function() {
      return $http.get('/api/orders');
    }
  }
});

app.controller('MainController', function($scope, $http, $timeout, $window, Braintree, Product, Order, API_SERVER) {

  $scope.step = 'initial';

  $scope.nonce;

  $scope.product;

  $scope.products = [];

  $scope.orders = [];

  $scope.createOrder = function() {
    if ($scope.ordering) return;
    $scope.ordering = true;
    Order.createOrder($scope.product.id, $scope.nonce).success(function() {
      $scope.product = null;
      $scope.nonce = null;

      refreshOrders();
    }).finally(function() {
      $scope.ordering = false;
    });

  };

  function refreshBraintree() {
    Braintree.getToken().success(function(token) {

      $scope.token = token.token;

    });
  }

  function refreshProducts() {
    Product.findProducts().success(function(products) {
      $scope.products = products;
    });
  }

  function refreshOrders() {
    Order.findOrders().success(function(orders) {
      $scope.orders = orders;
    });
  }

  refreshProducts();
  refreshBraintree();
  refreshOrders();

  RobotUtils.onService(function(ALTextToSpeech, ALMotion, ALPhotoCapture, ALLeds) {


    function moveInitial() {
      ALTextToSpeech.say('Hi! How can I help you today?');
      ALMotion.setStiffnesses('Head', 1.0);
      ALMotion.angleInterpolation('HeadYaw', [0.1, -0.1, 0.0], [1.0, 2.0, 3.0], true);
      ALMotion.angleInterpolation('HeadPitch', [-0.3, -0.5, -0.4], [1.0, 2.0, 3.0], true);
      ALMotion.angleInterpolation('RShoulderPitch', [0.0, 1.0, 0.0, 1.1, 1.3], [1.0, 2.0, 3.0, 4.0, 5.0], true);
      ALMotion.angleInterpolation('RElbowRoll', [0.0, 1.5, 0.0, 1.5, 0.0], [1.0, 2.0, 3.0, 4.0, 5.0], true);
      ALMotion.angleInterpolation('RShoulderRoll', [-1.0, -0.1], [1.0, 5.0], true);
      ALMotion.angleInterpolation('RElbowYaw', [2.0, 0.5, 1.8], [1.0, 4.0, 5.0], true);
      ALMotion.angleInterpolation('RHand', [1.0, 0.0], [1.0, 5.0], true);
      ALMotion.angleInterpolation('LShoulderPitch', [1.8], [5.0], true);
      ALMotion.angleInterpolation('LElbowRoll', [-1.1], [5.0], true);
      ALMotion.angleInterpolation('LShoulderRoll', [0.5], [5.0], true);
      ALMotion.angleInterpolation('LElbowYaw', [-0.6], [5.0], true);
      ALMotion.angleInterpolation('LHand', [0.1], [5.0], true);
    }
    
    function moveStartCheckout() {
      ALTextToSpeech.say('Hold up your first item please. Say cheese! 1, 2, 3');
      ALMotion.setStiffnesses('Head', 1.0);
      ALMotion.angleInterpolation('HeadYaw', [0.3, -0.3, 0.3, -0.3, 0.0], [1.0, 2.0, 3.0, 4.0, 5.0], true);
      ALMotion.angleInterpolation('HeadPitch', [-0.3, -0.5, -0.4], [1.0, 2.0, 3.0], true);
      ALMotion.angleInterpolation('RShoulderPitch', 0.5, 5.0, true);
      ALMotion.angleInterpolation('RElbowRoll', 0.23, 5.0, true);
      ALMotion.angleInterpolation('RShoulderRoll', -1.15, 5.0, true);
      ALMotion.angleInterpolation('RElbowYaw', 0.69, 5.0, true);
      ALMotion.angleInterpolation('RWristYaw', 0.96, 5.0, true);
      ALMotion.angleInterpolation('RHand', 0.7, 5.0, true);
      ALMotion.angleInterpolation('LShoulderPitch', 0.4, 5.0, true);
      ALMotion.angleInterpolation('LElbowRoll', -0.25, 5.0, true);
      ALMotion.angleInterpolation('LShoulderRoll', 0.81, 5.0, true);
      ALMotion.angleInterpolation('LElbowYaw', -1.41, 5.0, true);
      ALMotion.angleInterpolation('LWristYaw', -0.89, 5.0, true);
      ALMotion.angleInterpolation('LHand', 0.62, 5.0, true);
    }

    function moveFirstItem() {
      ALTextToSpeech.say('That\'s one watson tee shirt.');
      ALMotion.setStiffnesses('Head', 1.0);
      ALMotion.angleInterpolation('HeadPitch', [-0.3, -0.9, -0.4], [1.0, 2.0, 3.0], true);
      ALMotion.angleInterpolation('RShoulderPitch', [0.0, 1.0, 0.0, 1.1, 1.3], [0.5, 1.5, 2.0, 2.5, 3.0], true);
      ALMotion.angleInterpolation('RElbowRoll', [0.0, 1.5, 0.0, 1.5, 0.0], [0.5, 1.5, 2.0, 2.5, 3.0], true);
      ALMotion.angleInterpolation('RShoulderRoll', [-1.0, -0.1], [1.0, 2.0], true);
      ALMotion.angleInterpolation('RElbowYaw', [2.0, 0.5, 1.8], [1.0, 1.5, 2.0], true);
      ALMotion.angleInterpolation('RHand', [1.0, 0.0], [1.0, 2.0], true);
      ALMotion.angleInterpolation('LShoulderPitch', [1.8, 0.4], [1.0, 5.0], true);
      ALMotion.angleInterpolation('LElbowRoll', [-1.1, -0.25], [1.0, 5.0], true);
      ALMotion.angleInterpolation('LShoulderRoll', [0.5, 0.81], [1.0, 5.0], true);
      ALMotion.angleInterpolation('LElbowYaw', [-0.6, -1.41], [1.0, 5.0], true);
      ALMotion.angleInterpolation('LHand', [0.1, 0.62], [1.0, 5.0], true);

      setTimeout(function() {
        ALTextToSpeech.say('What next?');
      }, 4000);
    }

    function moveSummary(orderTotal) {
      ALTextToSpeech.say('That\'ll be ' + orderTotal + 'dollars please.');
      ALMotion.setStiffnesses('Head', 1.0);
      ALMotion.angleInterpolation('HeadPitch', [-0.3, -0.9, -0.4], [1.0, 2.0, 3.0], true);
      ALMotion.angleInterpolation('RShoulderPitch', 1.8, 1.0, true);
      ALMotion.angleInterpolation('RElbowRoll', 1.1, 1.0, true);
      ALMotion.angleInterpolation('RShoulderRoll', -0.5, 1.0, true);
      ALMotion.angleInterpolation('RElbowYaw', 0.6, 1.0, true);
      ALMotion.angleInterpolation('RHand', 0.1, 1.0, true);
      ALMotion.angleInterpolation('LShoulderPitch', 1.8, 1.0, true);
      ALMotion.angleInterpolation('LElbowRoll', -1.1, 1.0, true);
      ALMotion.angleInterpolation('LShoulderRoll', 0.5, 1.0, true);
      ALMotion.angleInterpolation('LElbowYaw', -0.6, 1.0, true);
      ALMotion.angleInterpolation('LHand', 0.1, 1.0, true);
    }

    function moveSign() {
      ALTextToSpeech.say('One more thing. Can I please have your signature?');
      ALMotion.moveTo(0.1, 0.0, 0.0);
      ALMotion.angleInterpolation('RShoulderPitch', 0.5, 1.0, true);
      ALMotion.angleInterpolation('LShoulderPitch', 0.5, 1.0, true);
    }

    function moveFinish() {
      ALTextToSpeech.say('Yay! Thank you.');
      ALLeds.rotateEyes(0x00CC00, 1.0, 5.0);
      ALMotion.setStiffnesses('Head', 1.0);

      ALMotion.angleInterpolation('RShoulderPitch', -1.27, 1.0, true);
      ALMotion.angleInterpolation('RElbowRoll', 0.3, 1.0, true);
      ALMotion.angleInterpolation('RShoulderRoll', -0.31, 1.0, true);
      ALMotion.angleInterpolation('RElbowYaw', 1.56, 1.0, true);
      ALMotion.angleInterpolation('RHand', 0.85, 1.0, true);

      ALMotion.angleInterpolation('LShoulderPitch', -1.27, 1.0, true);
      ALMotion.angleInterpolation('LElbowRoll', -0.3, 1.0, true);
      ALMotion.angleInterpolation('LShoulderRoll', 0.31, 1.0, true);
      ALMotion.angleInterpolation('LElbowYaw', -1.56, 1.0, true);
      ALMotion.angleInterpolation('LHand', 0.85, 1.0, true);

      ALMotion.moveTo(0.0, 0.0, 3.1).then(function() {
        ALMotion.moveTo(1.0, 0.0, 0.0);
      });
    }

    moveInitial();

    //moveInitial();
    //moveStartCheckout();
    //moveFirstItem();
    //moveSummary(19);
    //moveSign();
    //moveFinish();

    $scope.goStartCheckout = function() {
      $scope.step = 'startCheckout';
      moveStartCheckout();
      $timeout(function() {
        takePicture();
      }, 3000);
    };

    function takePicture() {
      ALPhotoCapture.takePicture('/home/nao/recordings/cameras', 'hi.jpg').then(function(data) {
        console.log(data);

        $scope.loadingPic = true;
        $http.get('/api/newPicture').success(function() {
          $scope.imageSrc = API_SERVER + '/image.jpg';

          for (var i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].id == 1) {
              $scope.product = $scope.products[i];
              break;
            }
          }

          $scope.step = 'firstItem';
          moveFirstItem();
        }).finally(function() {
          $scope.loadingPic = false;
        });

      }, function(err) {
        console.log(err);
      });
    }

    $scope.goSummary = function() {
      $scope.step = 'summary';
      moveSummary(19);
      braintree.setup($scope.token, 'custom', {
        paypal: {container: 'paypal-button'},
        onPaymentMethodReceived: function(res) {
          console.log('got payment');
          $scope.nonce = res.nonce;
          $scope.$apply();
        },
        onError: function(error) {
          console.log(error);
        }
      });
    
    };

    $scope.goSign = function() {
      $scope.step = 'sign';
      moveSign();
      $(function() {
        $('#simple_sketch').sketch();
      });
    };

    $scope.goFinished = function() {
      $scope.createOrder();
      $scope.step = 'finished';
      moveFinish();
    };

    $scope.startOver = function() {
      //$scope.step = 'initial';
      $window.location.reload();
    };

  }, function(err) {
    console.log('error in RobotUtils.onService');
    console.log(err);
  });

});

/*

- hi Dave, click here if you'd like to check out.
- ok. can i see your first item
- take picture of shirt
- admin panel send picture to watson to determine item
- great! that shirt is $15. will that be all?
- yes
- great, please enter your credit card
- show card on admin
- thanks! and then roll away

*/


app.factory('TokenInterceptor', function($q, API_SERVER) {
  return {
    request: function(config) {
      config.headers = config.headers || {};

      if (config.url.indexOf('/api/') >= 0) {
        config.url = API_SERVER + config.url;
      }

      return config;
    },
    response: function(response) {
      return response || $q.when(response);
    },
    responseError: function(rejection) {
      console.log(rejection);
      return $q.reject(rejection);
    }
  };
});

/**
 * Configure the authorization request
 */
app.config(function($httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
});


