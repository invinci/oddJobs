var GLOBAL_HEADERS = {
    'Content-Type': 'application/json'
};

//var HOST = 'http://52.39.212.226:4019/';
var HOST = 'http://52.39.212.226:4019/';
var PROFILE_IMAGE=HOST+'assets/upload/profileImg/';
var SKILLS_IMAGE=HOST+'assets/upload/skills/';


var POS_OPTIONS = {
					timeout: 10000, 
					enableHighAccuracy: false
				};
var GEOCODER_API_KEY = '';				

var USER_LOGIN                 = HOST + 'users/authenticate';
var SIGNUP                     = HOST + 'users/add';
var SIGNUP_FACEBOOK            = HOST + 'users/add';
var FORGOT_PASSWORD            = HOST + 'users/forgot_password';
var CHANGE_PASSWORD            = HOST + 'users/changePassword';
var UPDATE_PROFILE             = HOST + 'users/update';
var GET_SkILLS                 = HOST + 'skills/getSkills';


var GET_LAT_LONG        	= 'https://maps.googleapis.com/maps/api/geocode/json?address=';
var GET_ADDR              = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
var GET_TIMEZONE         	= 'https://maps.googleapis.com/maps/api/timezone/json?location=';

