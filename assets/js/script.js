// fetch all places with the type restaurant, with a keyword red, within a 60 mile radius of orlando
fetch('https://api.allorigins.win/raw?url=' +  
encodeURIComponent('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.5383,-81.3792&radius=100000&type=restaurant&key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo'))
.then(res => res.json())
.then(console.log);

// var lat = ""; 
// var lon = "";
// var type = ""; //restaurant,
// var keyword = "";  //"red", 

// function to fetch data in a 60mile radius using input variables
var fetchLocationData = function() {
	fetch('https://api.allorigins.win/raw?url=' +  
	encodeURIComponent('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + '','' + lon + '&radius=100000&type=' + type + '&keyword=' + keyword + '&key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo'))
	.then(res => res.json())
	.then(console.log);
	};
	
	// fetch('')
	// .then(function(response) {
	// 	response.json().then(function(data) {
	// 		console.log(data);
	// 	});
	// });