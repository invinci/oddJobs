angular.module("google.places",[]);
angular.module('oddJobs.controllers', ['ionic','ngCordova','ngTagsInput','ngMask','google.places', 'angucomplete'])
.controller('AppCtrl', function($scope, $state,$location,$cordovaGeolocation,LocationService, $q, $ionicLoading) {

$scope.profileImagePath = PROFILE_IMAGE;
$scope.skillsImagePath = SKILLS_IMAGE;

$scope.logout = function() {
    localStorage.clear();
    $location.path('/signin');
};


var date = new Date();
$cordovaGeolocation
      .getCurrentPosition(POS_OPTIONS)
      .then(function (position) {

        LocationService.getTimezoneByLatLong(position.coords.latitude, position.coords.longitude, (date.getTime()/10)).then(function (data) {
              
              $scope.timezone = data.data.timeZoneId;

              console.log($scope.timezone)

              // window.localStorage['timezone']  = $scope.timezone;
              // $scope.user_range = window.localStorage['user_range'];

              // if (typeof $scope.timezone == 'undefined' || $scope.timezone =='') {
              //   $scope.timezone = "America/Los_Angeles"
              // };

              // DealService.findDealsCount($scope.userData.session_id, $scope.timezone).then(function (deals) {
              //   $scope.dealsCounts = deals.data;
              //   $rootScope.dealsCountsData = $scope.dealsCounts;
              //   //console.log("1")
              //  // console.log($scope.dealsCounts);
              // });

          })

        }, function(err) {

        });
})

.controller('RegisterCtrl', function($scope,$q,LoginService,RegisterService,ForgotService,$ionicLoading,$ionicPopup,$state) {
  $scope.user = {};
  $scope.login = function(user) {
    
    $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0,
              correctOrientation:true
      });
    var userData = {};
    userData.username = user.email;
    userData.password = user.password;
    LoginService.Login(userData).success(
            function(data) {     
                      $ionicLoading.hide();
                      if (data.messageId == 200) {
                         $scope.rememberme = false;
                         //console.log($scope.user.rememberme)
                             if (typeof $scope.user.rememberme != "undefined") {
                              $scope.rememberme = $scope.user.rememberme;
                            }
                            localStorage.setItem('userData', JSON.stringify(data));
                            var localdata = data.data;
                            if ($scope.rememberme == true) {
                                  localdata.entered_email = $scope.user.email;
                                  localdata.entered_password = $scope.user.password;
                                  localStorage.setItem('localdata', JSON.stringify(localdata));
                                  
                            }
                            $state.go('app.addprofile')
                          
                      }else {
                          var alertPopup = $ionicPopup.alert({
                                  title:    'Login failed!',
                                  template: 'Please check your credentials!',
                                  buttons:[
                                    {
                                      text: '<b>Ok</b>',
                                      type: 'pink-white-theme-color'
                                    }
                                  ]
                              });
                      }
              });
    }

    $scope.savedData ={};
    if (localStorage.getItem('userData') != null) {
             if (typeof $scope.savedData.entered_email != "undefined" && $scope.savedData.entered_email != "" && typeof $scope.savedData.entered_password != "undefined" && $scope.savedData.entered_password != "") {
                  $scope.user.email = $scope.savedData.entered_email;
                  $scope.user.password = $scope.savedData.entered_password;
                  $scope.login();
            }
      } 

  $scope.register = function(user) {
     //alert(1)
     //$state.go('app.addprofile')
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            correctOrientation:true
        });
        var userData = {};
        userData.email = user.email;
        userData.password = user.password;
        userData.enable = true;
        RegisterService.SignUp(userData).success(
            function(data) {     
              $ionicLoading.hide();
              if (data.messageId == 200) {

                 localStorage.setItem('userData', JSON.stringify(data));
                  $state.go('app.addprofile')
                  
                  
              }else {     
                  var alertPopup = $ionicPopup.alert({
                          title:    'Registration failed!',
                          template: data.message,
                          buttons:[
                            {
                              text: '<b>Ok</b>',
                              type: 'pink-white-theme-color'
                            }
                          ]
                      });
              }
          });
    }

    var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      $ionicLoading.hide();
      profileInfo.provider = "facebook";
      profileInfo.password="oddjob123";
      profileInfo.enable=true;
      console.log("profileInfo");
      console.log(profileInfo)
      RegisterService.SignUpfacebook(profileInfo).success(function (response) {
               //console.log(response)
                if(response.existId==100){
                       localStorage.setItem('userData', JSON.stringify(response));
                       $state.go('app.addprofile')
                  }else if(response.messageId=200){

                       localStorage.setItem('userData', JSON.stringify(response));
                       $state.go('app.addprofile')

                 }else{
                   var alertPopup = $ionicPopup.alert({
                                  title:    'Something went wrong!',
                                  template: data.message,
                                  buttons:[
                                    {
                                      text: '<b>Ok</b>',
                                      type: 'pink-white-theme-color'
                                    }
                                  ]
                              });

                 }

        });
      //$state.go('app.addprofile')
    },function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name,first_name,last_name,link&access_token=' + authResponse.accessToken, null,
      function (response) {
        //console.log("1")
        //console.log(response);
        info.resolve(response);
      },
      function (response) {
        console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0,
            correctOrientation:true
        });
    facebookConnectPlugin.getLoginStatus(function(success){
     console.log(success);
      if(success.status === 'connected'){
        //console.log('getLoginStatus', success.status);
        getFacebookProfileInfo(success.authResponse)
          .then(function(profileInfo) {
            $ionicLoading.hide();
            // For the purpose of this example I will store user data on local storage
           // console.log("finalResponse")
            profileInfo.provider = "facebook";
            profileInfo.provider_image= "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large";
            profileInfo.password="oddjob123";
            profileInfo.enable=true;
            console.log(profileInfo)
            RegisterService.SignUpfacebook(profileInfo).success(function (response) {
                if(response.existId==100){
                   localStorage.setItem('userData', JSON.stringify(response));
                    $scope.userData = JSON.parse(window.localStorage['userData']);
                    $state.go('app.addprofile');
                }else if(response.messageId=200){
                  localStorage.setItem('userData', JSON.stringify(response));
                  $state.go('app.addprofile');

                }else{
                  var alertPopup = $ionicPopup.alert({
                              title:    'Something went wrong!',
                              template: data.message,
                              buttons:[
                                {
                                  text: '<b>Ok</b>',
                                  type: 'pink-white-theme-color'
                                }
                              ]
                          });
                }
            });
          }, function(fail){
            // Fail get profile info
            console.log('profile info fail', fail);
          });
      } else {
        $ionicLoading.show({
          template: 'Logging in...'
        });
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };
$scope.changePassword = function(pass) {

if(localStorage.getItem("userData")!=null) {
$scope.userData = JSON.parse(window.localStorage['userData']);

}
pass._id=$scope.userData.data._id
    
    console.log(pass)
    $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0,
              correctOrientation:true
      });

      LoginService.ChangePassword(pass).success(
              function(data) {  
              $ionicLoading.hide();
              if (data.messageId == 200) {
                var alertPopup = $ionicPopup.alert({
                          title:   'Sucess!',
                          template: data.message,
                          buttons:[
                            {
                              text: '<b>Ok</b>',
                              type: 'pink-white-theme-color'
                            }
                          ]
                      });

               }else {     
                  var alertPopup = $ionicPopup.alert({
                          title:    'Error!',
                          template: data.message,
                          buttons:[
                            {
                              text: '<b>Ok</b>',
                              type: 'pink-white-theme-color'
                            }
                          ]
                      });
              }
          });
 }

 $scope.gotoLogin = function() {
    console.log('Sign-In');
    $state.go('landing');
  };
  $scope.forgotPassword = function(user) {
       $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        //console.log('Sign-In', user);
        var userdata={};

        userdata.username=user.email

        //console.log(userdata)
        ForgotService.forgotUser(userdata).success(

          function(data) {            
            
            $ionicLoading.hide();
              
            if (data.messageId == 200) {

                var alertPopup = $ionicPopup.alert({
                    title:    'Password has been sent  Successfully',
                    template: 'Please check your Email for new password.',
                    buttons:[
                      {
                        text: '<b>Ok</b>',
                        type: 'pink-white-theme-color'
                      }
                    ]
                });

                $state.go('signin');

            } else {                
                var alertPopup = $ionicPopup.alert({
                    title:    'Invalid Email!',
                    template: 'Please check your Email you might have mistyped!',
                    buttons:[
                      {
                        text: '<b>Ok</b>',
                        type: 'pink-white-theme-color'
                      }
                    ]
                });
            }           

        });

    }
})

.controller('AddprofileCtrl', function($scope, $stateParams,IonicClosePopupService,$state,$location,$ionicPopup,$http,SkillsService,LoginService,$ionicLoading) {

$scope.profile={};
var myPopup;  
//console.log("test");
 $scope.jobs = [ { "name": "Post Jobs", "id": "0" } , {"name": "Find Jobs", "id": "1" } ];
 $scope.selection = {
        role: {"0": true}
    };
if(localStorage.getItem("userData")!=null) {
  //console.log(1)
   $scope.profile.skill='';
   $scope.userData = JSON.parse(window.localStorage['userData']);
   $scope.profile  = $scope.userData['data'];
   $scope.skillData = [];
  // console.log($scope.profile)
   if($scope.profile!=undefined){
   inputObj=$scope.profile.skill;
for (var key in inputObj) {
    $scope.skillData[key]={"text":inputObj[key].skill,"id":inputObj[key]._id};
}

$scope.profile.tags=$scope.skillData;
}

}

//console.log($scope.userData)
SkillsService.getSkillsListing().success(function (skills) {
  $ionicLoading.hide();
 // console.log(skills)
  if (skills.messageId == 200) {
   
    $scope.profile.skill=skills;
    inputObj=skills;
    //console.log(inputObj)
    var skillName = [];
    var skillId = [];
    for (var key in inputObj.data) {
     skillName[key] = inputObj.data[key].skill;
     skillId[key] = inputObj.data[key]._id;
    }
    //console.log()
    //console.log(skillId)
    $scope.nodata = false;
    $scope.loadTags = function(query) {
        var q = query.toLowerCase().trim();
        var results = [];
        for (var i = 0; i < skillId.length && results.length < 10; i++) {  
          var skill = skillName[i];
          if (skill.toLowerCase().indexOf(q) === 0){
            results.push({"text":skill,"id":skillId[i]});
            $scope.nodata = true;
          }else{
            $scope.nodata = false;
          }

          //console.log(results)
        }
        $scope.resultNotFound=false;
        if(results==""){
           $scope.resultNotFound=true;
        }

        //console.log(results)
        return results;
      };
   
   }
})
 
   //console.log(states)

$scope.camerOption=function() {
   
         myPopup =$ionicPopup.show({
                templateUrl:'templates/global/cameraoption.html',
                title: 'Select option',
                scope: $scope,
           })
 
       IonicClosePopupService.register(myPopup);
  };
  
$scope.addprofile=function(profile){
 // console.log("profile")
//  profile.role=$scope.selection.role;
  //console.log("profile")
  //console.log(profile.role)

    profile.skill='';
    profile.skill=profile.tags;
    var skillId = [];
    //console.log(profile)
    for (var key in profile.tags) {
      
     skillId[key]=profile.tags[key].id
     
    }
   // console.log($scope.picData);

    profile.prof_image=$scope.picData;

    profile.skill=skillId;
    //console.log(profile);
    LoginService.UpdateProfile(profile).success(
                function(data) {     
                  $ionicLoading.hide();
                  if (data.messageId == 200) {

                     localStorage.setItem('userData', JSON.stringify(data));
                     
                     if (localStorage.getItem("userData") !=null) {
                       $scope.userData = JSON.parse(window.localStorage['userData']);
                        $scope.profile = $scope.userData['data'];
                        //$location.path("app/addprofile");
                        $state.go('app.home');
                      }
                      //console.log( $scope.profile);
                      //$state.go('app.addprofile')
                     
                  }else {
                      var alertPopup = $ionicPopup.alert({
                              title:    'Login failed!',
                              template: 'Please check your credentials!',
                              buttons:[
                                {
                                  text: '<b>Ok</b>',
                                  type: 'pink-white-theme-color'
                                }
                              ]
                          });
                  }
              });
  }
  
    
    

$scope.takePic = function(type) {
  myPopup.close();
  var options =   {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL, // FILE_URI, DATA_URL
        sourceType: type,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
        encodingType: 0,    // 0=JPG 1=PNG
        correctOrientation:true,
        targetHeight:200,
        targetWidth:200
    }
    navigator.camera.getPicture($scope.onSuccess,$scope.onFail,options);
  }
  $scope.onSuccess = function(DATA_URL) {
    $scope.picData = "data:image/jpeg;base64," + DATA_URL;
    var image = document.getElementById('profileImage');
    image.src = "data:image/jpeg;base64," + DATA_URL;
    image.style.display = "block";
    document.getElementById('fbprofileImage').style.display= "none";
  };

  $scope.onFail = function(e) {
    console.log("On fail " + e);
  }
  
})


.controller('SkillsCtrl', function($scope, $state, $ionicLoading, $ionicPopup, SkillsService) {
$ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0,
              correctOrientation:true
      });
if(localStorage.getItem("userData")!=null) {
   $scope.Data = JSON.parse(window.localStorage['userData']);
   $scope.userData=$scope.Data.data;
}



SkillsService.getSkillsListing().success(function (Skills) {
  $ionicLoading.hide();
  if (Skills.messageId == 200) {

  $scope.skills=Skills.data;
  //console.log($scope.skills)

  var categoryList = Skills.data;
      var products_page = [];
      var products_pages = [];
      //categoryList.length=3;
      var count = 3;
      $scope.products_pages = products_pages;
      for(var i=0;i<categoryList.length;i++){
            if(count > 1){
                    products_page.push(categoryList[i]);
                    count--;
                    if(categoryList.length === i+1){
                        products_pages.push(products_page);
                        return;
                    }
              }else{
                    products_page.push(categoryList[i]);
                    products_pages.push(products_page);
                    products_page = [];
                    count = 3;
              }
        }
   }
  })
})

.controller('PostJobCtrl', function($scope, $state, $ionicLoading, $ionicPopup, LocationService) {
$scope.update = function(place){

   // place="Phase 8, Industrial Area, Sector 73, Sahibzada Ajit Singh Nagar, Chandigarh 160071";
    

    $scope.latitude  = place.geometry.location.lat();
    $scope.longitude = place.geometry.location.lng();

   // console.log(latitude)

    $scope.biz_zipcode = '';
    $scope.country = '';
    $scope.state = '';
    $scope.city = '';
    console.log(place.formatted_address)

    var promise = LocationService.getLatLongByLocation(place.formatted_address);
    promise.then(function(payload) {
        var address = {};

        var userLocationData  = payload.data;
        //console.log("Lat")
        
        console.log(payload.data.results[0].geometry.location.lat)
        console.log(payload.data.results[0].geometry.location.lng)
        
        /*
        formatted_address   = userLocationData.results[0].formatted_address;
        var addressArray    = formatted_address.split(",");
        address.biz_country = addressArray[addressArray.length-1].trim();
        */
        
        //$scope.saveAddrLastStep(address);
    });

    
    // FINDING ZIP
    if (place.address_components[place.address_components.length-1].types[0] == 'postal_code') {
      $scope.biz_zipcode = Number(place.address_components[place.address_components.length-1].long_name);
    };

    // FINDING COUNTRY
    if (place.address_components[place.address_components.length-1].types[0] == 'country' || 
        place.address_components[place.address_components.length-2].types[0] == 'country') {
      if(place.address_components[place.address_components.length-1].types[0] == 'country'){
        $scope.country = place.address_components[place.address_components.length-1].long_name;  
      }else{
        $scope.country = place.address_components[place.address_components.length-2].long_name;  
      }      
    };

    // FINDING STATE
    if (place.address_components[place.address_components.length-1].types[0] == 'administrative_area_level_1' || 
        place.address_components[place.address_components.length-2].types[0] == 'administrative_area_level_1' ||
        place.address_components[place.address_components.length-3].types[0] == 'administrative_area_level_1') {
      
      if(place.address_components[place.address_components.length-1].types[0] == 'administrative_area_level_1'){
        $scope.state = place.address_components[place.address_components.length-1].long_name;
      }else if(place.address_components[place.address_components.length-2].types[0] == 'administrative_area_level_1'){
        $scope.state = place.address_components[place.address_components.length-2].long_name;  
      }else{
        $scope.state = place.address_components[place.address_components.length-3].long_name;  
      }
    };

    // FINDING CITY
    if (place.address_components[place.address_components.length-1].types[0] == 'administrative_area_level_2' || 
        place.address_components[place.address_components.length-2].types[0] == 'administrative_area_level_2' ||
        place.address_components[place.address_components.length-3].types[0] == 'administrative_area_level_2' ||
        place.address_components[place.address_components.length-4].types[0] == 'administrative_area_level_2' ||

        place.address_components[place.address_components.length-1].types[0] == 'sublocality_level_1' ||
        place.address_components[place.address_components.length-2].types[0] == 'sublocality_level_1' ||
        place.address_components[place.address_components.length-3].types[0] == 'sublocality_level_1' ||
        place.address_components[place.address_components.length-4].types[0] == 'sublocality_level_1' ) {
    
      if(place.address_components[place.address_components.length-1].types[0] == 'administrative_area_level_2' || 
        place.address_components[place.address_components.length-1].types[0] == 'sublocality_level_1'){
        $scope.city = place.address_components[place.address_components.length-1].long_name;
      }else if( place.address_components[place.address_components.length-2].types[0] == 'administrative_area_level_2' || 
                place.address_components[place.address_components.length-2].types[0] == 'sublocality_level_1'){
        $scope.city = place.address_components[place.address_components.length-2].long_name;  
      }else if( place.address_components[place.address_components.length-3].types[0] == 'administrative_area_level_2' || 
                place.address_components[place.address_components.length-3].types[0] == 'sublocality_level_1'){
        $scope.city = place.address_components[place.address_components.length-3].long_name;  
      }else{
        $scope.city = place.address_components[place.address_components.length-4].long_name;  
      }    
    };



  
    //console.log($scope.biz_zipcode)
    //console.log($scope.country)
    //console.log($scope.state)
    //console.log($scope.city)
     

}
    
})

.controller('HomeCtrl', function($scope, $state, $ionicLoading, $ionicPopup, LocationService) {
if(localStorage.getItem("userData")!=null) {
$scope.userData = JSON.parse(window.localStorage['userData']);
$scope.userInformation=$scope.userData.data;

}

})
.directive('map',['$http', 'LocationService', 'ForgotService', '$cordovaGeolocation',function($http, LocationService, DealService, $cordovaGeolocation){
     return{
        
        restrict : 'A',

        link : function(scope,elements,attr){

            $cordovaGeolocation
              .getCurrentPosition(POS_OPTIONS)
              .then(function (position) {      
                
                var latitude  = position.coords.latitude;
                var longitude = position.coords.longitude;

                // console.log(latitude + ' : ' + longitude);
                putMarkerLastStep(latitude, longitude);                
                
            }, function(err) {        
                console.log(err);
                var latitude  = 28.6100;
                var longitude = 77.2300;
                putMarkerLastStep(latitude, longitude);  
            });


            /**** this rendering of markers via ng resource using service Locations ****/

            var putMarkerLastStep = function (latitude, longitude) {
      
                var myOptions = {
                      center: new google.maps.LatLng(latitude, longitude),
                      zoom: 7,
                      mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
              
                var map = new google.maps.Map(document.getElementById("map"),myOptions);

                var userData  = JSON.parse(window.localStorage['userData']);
                var user_id   = userData.session_id;

                DealService.findLocalDeals(latitude, longitude, user_id).then(function (deals) {
                    
                    // console.log(deals.data.business[0][0].coordinates[0]);
                    // console.log(deals.data.business[0][0].coordinates[1]);
                    // console.log(deals.data.data);

                    var business_coordinates = deals.data;
                    var loan = 'loan';

                    for(var i=0;i<deals.data.data.length;i++)
                    {                      
                        var latdata     = deals.data.data[i].location[0].coordinates[1];
                        var longdata    = deals.data.data[i].location[0].coordinates[0];
                        latlongDataset  = new google.maps.LatLng(latdata, longdata);
                        var marker      = new google.maps.Marker({
                            map: map, 
                            title: loan ,
                            position : latlongDataset
                        });
                        map.setCenter(marker.getPosition())
                        
                        var content     = deals.data.data[i]._id;
                        var infowindow  = new google.maps.InfoWindow()

                        google.maps.event.addListener(marker,'click', (function(marker, content, infowindow){ 
                            return function() {
                              
                              var date = new Date();
                              $cordovaGeolocation
                                  .getCurrentPosition(POS_OPTIONS)
                                  .then(function (position) {
                                    LocationService.getTimezoneByLatLong(position.coords.latitude, position.coords.longitude, (date.getTime()/10)).then(function (data) {
                                      var timezone = data.data.timeZoneId;
                                      DealService.findDealsByBizId(content,timezone).then(function (data) {
                                          if(data.data.data.length == 0){
                                            var windowContent = 'We\'ve No Deal on this Address for now.';
                                          }else{
                                            var windowContent="<strong>Deals:</strong><br>"
                                            for(var j=0;j<data.data.data.length;j++){
                                             windowContent += '<br> <a class="pink-colo-font" href="#/app/single-deal/'+data.data.data[j]._id+'">'+data.data.data[j].deal_name+'</a>';
                                          }
                                          }
                                          // console.log(data.data.data.length)                                
                                          infowindow.setContent(windowContent);
                                          infowindow.open(map,marker);
                                        });
                                    });     
                                  }, function(err) {
                                    latitude  = undefined;
                                    longitude = undefined;
                                  });



                              
                                
                            };
                        })(marker,content,infowindow)); 

                        marker.setMap(map);
                        infowindow.setMap(map);
                    }

                });
            
                // google.maps.event.addDomListener(window, 'load', initialize);

            };
        }
      }
}])
.directive('myMap', function() {
    // directive link function
    var link = function(scope, element, attrs) {
        var map, infoWindow;
        var markers = [];
        
        // map config
        var mapOptions = {
            center: new google.maps.LatLng(50, 2),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        
        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
            }
        }    
        
        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
            
            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }
        
        // show the map and place some markers
        initMap();
        
        setMarker(map, new google.maps.LatLng(51.508515, -0.125487), 'London', 'Just some content');
        setMarker(map, new google.maps.LatLng(52.370216, 4.895168), 'Amsterdam', 'More content');
        setMarker(map, new google.maps.LatLng(48.856614, 2.352222), 'Paris', 'Text here');
    };
    
    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        link: link
    };
})
.directive('compareTo', [function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
}]);


  