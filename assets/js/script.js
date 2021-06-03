const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://trueway-places.p.rapidapi.com/FindPlacesNearby?location=37.783366%2C-122.402325&language=en&radius=150&type=cafe",
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "54ce5bf2cdmshd88304cae69d7fbp1de188jsn1610517fe23b",
		"x-rapidapi-host": "trueway-places.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});