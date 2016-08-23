angular.module('oddJobs.routes', [])
.config(function($stateProvider, $urlRouterProvider) {

  var checkRememberMe = function($q, $state, $ionicViewService, $ionicLoading, $timeout, $location){

var deferred = $q.defer();
console.log("te")
console.log(localStorage.getItem("localdata"))
    if (localStorage.getItem("localdata") === null) {
    // $state.go('home');
      $timeout(deferred.resolve, 0);
    }else{
      $timeout(deferred.resolve, 0);
      $ionicViewService.nextViewOptions({disableBack: true});

      $location.path('/app/addprofile');
      // $state.go('sidemenu.myoffer');
    }
   return deferred.promise;
 }
  $stateProvider
   
   .state('signin', {
      url: '/sign-in',
       cache:false,
      templateUrl: 'templates/users/login.html',
      controller: 'RegisterCtrl',
      resolve:{checked:checkRememberMe}
    }) 
   .state('register', {
      url: '/register',
      
      templateUrl: 'templates/users/register.html',
      controller: 'RegisterCtrl'
    }) 
    .state('forgotpassword', {
      url: '/forgotpassword',
      templateUrl: 'templates/users/forgot.html',
      controller: 'RegisterCtrl'
    }) 
    
   .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/global/menu.html',
    controller: 'AppCtrl'
  })
  
   .state('app.skills', {
    url: '/skills',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/jobs/skills.html',
        controller: 'SkillsCtrl'
      }
    }
  })
  .state('app.postjob', {
    url: '/postjob/:userId', 
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/jobs/postjob.html',
        controller: 'PostJobCtrl'
      }
    }
  })
   .state('app.addprofile', {
    url: '/addprofile',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/users/addprofile.html',
        controller: 'AddprofileCtrl'
      }
    }
  })
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/users/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/users/changepassword.html',
        controller: 'RegisterCtrl'
      }
    }
  })

  .state('app.joblist', {
    url: '/joblist',
    views: {
      'menuContent': {
        templateUrl: 'templates/jobs/joblist.html'
      }
    }
  })

  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/sign-in');
});
