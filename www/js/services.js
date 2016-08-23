var oddJobs = angular.module('oddJobs.services', ['ionic']);

oddJobs.service('IonicClosePopupService', [
            function () {
                var currentPopup;
                var htmlEl = angular.element(document.querySelector('html'));
                htmlEl.on('click', function (event) {
                    if (event.target.nodeName === 'HTML') {
                        if (currentPopup) {
                            currentPopup.close();
                        }
                    }
                });

                this.register = function (popup) {
                    currentPopup = popup;
                }
            }
        ])

.factory('LoginService',function($q, $http) {
        return {
            Login: function(dataJSON) {
                var promise = $http({
                    url: USER_LOGIN,
                    method: 'POST',
                    data:   dataJSON,
                    headers: GLOBAL_HEADERS
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise;
            },
            UpdateProfile: function(dataJSON) {
                var promise = $http({
                    url: UPDATE_PROFILE+"/"+dataJSON._id,
                    method: 'POST',
                    data:   dataJSON,
                    headers: GLOBAL_HEADERS
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise;
            },
             ChangePassword: function(dataJSON) {
                var promise = $http({
                    url: CHANGE_PASSWORD,
                    method: 'POST',
                    data:   dataJSON,
                    headers: GLOBAL_HEADERS
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise;
            },
            
        }
        
    }).factory('RegisterService',function($q, $http) {
        return {
            SignUp: function(dataJSON) {
                var promise = $http({
                    url: SIGNUP,
                    method: 'POST',
                    data:   dataJSON,
                    headers: GLOBAL_HEADERS
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise;
            },
            SignUpfacebook: function(dataJSON) {
                var promise = $http({
                    url: SIGNUP_FACEBOOK,
                    method: 'POST',
                    data:   dataJSON,
                    headers: GLOBAL_HEADERS
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise;
            }
         }
        
    }).factory('ForgotService',function($q, $http) {
        return {
            forgotUser: function(dataJSON) {
                var promise = $http({
                    url: FORGOT_PASSWORD,
                    method: 'POST',
                    data:   dataJSON,
                    headers: GLOBAL_HEADERS
                }).success(function(data, status, headers, config) {
                    return data;
                });
                return promise;
            }
         }
        
    })
    .factory('SkillsService',function($q, $http) {
          return {

            getSkillsListing: function() {
                var promise = $http.get(GET_SkILLS).success(function(data, status, headers, config) {               
                    return data;
                });
                return promise;
            }
            
         }   
    }).factory('LocationService',       function($q, $http) {
        return {
            getLocations: function() {
                var promise = $http.get(DEALS_LISTING).success(function(data, status, headers, config) {               
                    return data;
                });
                return promise;
            },
            getLocationByLatLong: function(latitude,longitude) {

                var deferred = $q.defer();                
                deferred.resolve($http.get(GET_ADDR + latitude + ',' + longitude +'&key='+GEOCODER_API_KEY));
                return deferred.promise;

            },
            getTimezoneByLatLong: function(latitude,longitude,timestamp) {

                var deferred = $q.defer();                 
                deferred.resolve($http.get(GET_TIMEZONE + latitude + ',' + longitude + '&timestamp=' + timestamp + '&key=' + GEOCODER_API_KEY));
                return deferred.promise;

            },
             getLatLongByLocation: function(address) {

                var deferred = $q.defer();                
                deferred.resolve($http.get(GET_LAT_LONG + address +'&key='+GEOCODER_API_KEY));
                return deferred.promise;
                
            }
        }
    })