var userLocation = {};
// DOM Elements
var placeNameEl = document.querySelector("#place-name");
var imgEl = document.querySelector("#img-el");
var addressEl = document.querySelector("#address");
var distanceEl = document.querySelector("#distance");
var mapHeaderEl = document.querySelector("#map-header");
var mapEl = document.querySelector("#map-content");
var storedPlacesEl = document.querySelector("#storage-row");

//user location
$("#location-btn").on("click", function (e) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (response) {
        userLocation.lat = response.coords.latitude;
        userLocation.lon = response.coords.longitude;
    });
      //console.log(userLocation);
    }
});


//on click function to gather user data
$("#submit").on("click", function (e) {
    var userDistance = $("input:radio[name=distance]:checked").val();
    var userMethod = $("input:radio[name=travel-method]:checked").val();
    var userDestination = $("input:radio[name=location-type]:checked").val();

    // package variables to send 
    var userLat = userLocation.lat;
    var userLon = userLocation.lon;
    placesApi(userDistance, userMethod, userDestination, userLat, userLon);
});


//function placesApi(location, distance, method, destinationType) {
function placesApi(userDistance, userMethod, userDestination, userLat, userLon) {
fetch(
    "https://api.allorigins.win/raw?url=" +
    encodeURIComponent(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
            userLat +
            "," +
            userLon +
            "&radius=" +
            userDistance +
            "&type=" +
            userDestination +
            "&key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo"
    )
).then(function (response) {
    if (response.ok) {
        response.json().then(function (data) {
        console.log(data);
        var randomResults = data.results[Math.floor(Math.random() * data.results.length)];
        console.log(randomResults);

        var locationLat = randomResults.geometry.location.lat;
        var locationLng = randomResults.geometry.location.lng;

        distanceMatrixApi(locationLat, locationLng, userLat, userLon, userMethod);
        });
    }
});
}

// Distance Matrix API
function distanceMatrixApi(locationLat, locationLng, userLat, userLon, userMethod) {
    //console.log(locationLat, locationLng, userLat, userLon, userMethod);
    fetch(
    "https://api.allorigins.win/raw?url=" +
        encodeURIComponent(
        "https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyBjep3oamseN_xrez7jazTRvj92qBnDqFI&units=imperial&origins=" +
            userLat +
            "," +
            userLon +
            "&destinations=" +
            locationLat +
            "," +
            locationLng +
            "&mode=" + userMethod
        )
).then(function (response) {
    if (response.ok) {
        response.json().then(function (data) {
        console.log(data);
    });
    }
});
}

// Need: Function to print data to page
//       Function to reset page content for next click
//       Function to save places to local storage 
//       Function to remove places from local storage

//data.rows[0].elements[0].distance (use to compare to make sure the response returned is within distance parameters)