// fetch all places with the type restaurant, with a keyword red, within a 60 mile radius of orlando
var fetchOrlando = function() {
fetch('https://api.allorigins.win/raw?url=' +  
encodeURIComponent('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.5383,-81.3792&radius=100000&type=restaurant&key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo'))
.then(res => res.json())
.then(console.log);
};

//fetchOrlando();
// var lat = ""; 
// var lon = "";
// var type = ""; //restaurant,
// var keyword = "";  //"red", 

// function to fetch data in a 60mile radius using input variables PLACES API
// var fetchPlaces = function() {
// 	fetch('https://api.allorigins.win/raw?url=' +  
// 	encodeURIComponent('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lon + '&radius=100000&type=' + type + '&keyword=' + keyword + '&key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo'))
// 	.then(res => res.json())
// 	.then(console.log);
// };
	

// Distance Matrix API 
// var fetchDistanceMatrix = function() {
// 	fetch('https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo&origins=' + '' +'&destinations=' + )
// }


var fetchDistanceMatrix = function() {
	fetch('https://api.allorigins.win/raw?url=' +  
	encodeURIComponent('https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyBjep3oamseN_xrez7jazTRvj92qBnDqFI&origins=' + '40.6655101,-73.89188969999998' +'&destinations=' + '40.6905615%2C-73.9976592'))
	.then(res => res.json())
	.then(console.log);
};

//fetchDistanceMatrix();





// fetch('')
// .then(function(response) {
// 	response.json().then(function(data) {
// 		console.log(data);
// 	});
// });

// for distance matrix api endpoint 
// https://maps.googleapis.com/maps/api/distancematrix/json?parameters
// required parameters: origins=""&destinations=""&key=""
// optional parameters: mode= (default is driving, can be walking, bicycling, ), units=imperial, 
// If you pass an address, the service geocodes the string and converts it to a latitude/longitude coordinate to calculate distance. 
// This coordinate may be different from that returned by the Geocoding API, for example a building entrance rather than its center.
// ex. using an address: origins=Bobcaygeon+ON|24+Sussex+Drive+Ottawa+ON
// ex. using coordinates: origins=41.43206,-81.38992|-33.86748,151.20699
// can add restrictions: avoid=highways, avoid=tolls

// google example using lat/lon 
//https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=40.6655101,-73.89188969999998&destinations=40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.6905615%2C-73.9976592%7C40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626%7C40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=YOUR_API_KEY


// Link to HTML Search Input 
// Create User Search Capabilities.
const searchBox = document.querySelector('.search-box');

//searchBox.addEventListener('keypress', setQuery);

//Create Search Functions and Display Results.
function setQuery(evt){
    if (evt.keyCode == 13) {
    getSearch(searchBox.value);
    console.log(searchBox.value);
    }
}







// MATERIALIZE JS
var options = {
    hover: true,
};

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, options);
});