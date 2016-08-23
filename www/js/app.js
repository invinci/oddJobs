// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('oddJobs', ['ionic', 'oddJobs.controllers','oddJobs.routes','oddJobs.services'])

.run(function($ionicPlatform,$cordovaGeolocation,$ionicPopup) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // HANDLING LOCATION

    $cordovaGeolocation
    .getCurrentPosition(POS_OPTIONS)
    .then(function (position) {     
        
        window.localStorage['userlatitude']  = position.coords.latitude;
        window.localStorage['userlongitude'] = position.coords.longitude;
        //alert(position.coords.latitude +''+position.coords.longitude)
      
    }, function(err) {
        $ionicPopup.show({
          template: '',
          title: 'Need Your Location',
          subTitle: 'Please turn on your location to get more jobs nearby you.',
          buttons: [
            { 
              text: 'Turn On',
              type: 'pink-white-theme-color',
              onTap: function(e) {                  
                cordova.plugins.diagnostic.switchToLocationSettings();
              }
            }
          ]
        });
    });
});


})
