// --- from kayla's rapidAPI account --- 
fetch("https://trueway-places.p.rapidapi.com/FindPlacesNearby?location=37.783366%2C-122.402325&language=en&radius=150&type=cafe", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "9b836ebcfamsh9bd18d25f72ad34p19e628jsn460c57bf97e3",
		"x-rapidapi-host": "trueway-places.p.rapidapi.com"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.error(err);
});