var userLocation = {};
// DOM Elements
var placeNameEl = document.querySelector("#place-name");
var imgEl = document.querySelector("#img-el");
var addressEl = document.querySelector("#address-el");
var distanceEl = document.querySelector("#distance");
var timeEl = document.querySelector("#travel-time");
var statusEl = document.querySelector("#status-el");
var mapHeaderEl = document.querySelector("#map-header");
var mapEl = document.querySelector("#map-content");
var storedPlacesEl = document.querySelector("#storage-row");


// function to display content to page
var displayContent = function(placeObject, infObject) {
    placeNameEl.innerHTML = placeObject.name;
    addressEl.innerText = placeObject.address; 
    distanceEl.innerText = infObject.distance;
    timeEl.innerText = infObject.time;
    if(placeObject.status) {
        statusEl.innerText = "Open Now";
    } else {
        statusEl.innerText = "Closed";
    }
}

// display map
var fetchStatic = function(originLat, originLon, zoomValue, destinationLat, destinationLon) {
    var staticUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" + originLat + "," + originLon + 
	"&zoom=" + zoomValue +"&size=400x400&maptype=roadmap&markers=color:green%7Clabel:Start%7C" + originLat + "," + originLon + 
	"&markers=color:red%7Clabel:Finish%7C" + destinationLat + "," + destinationLon + "&key=AIzaSyA76IoInowLeKlfuTlf0yYHVH95eZAz4mg"
	console.log(staticUrl)
mapEl.innerHTML = "<img src='"  + staticUrl + "'/ >"; 
}





// fetch photo from places 
var photoFetch = function(photoRef) {
    fetch(
        "https://api.allorigins.win/raw?url=" +
            encodeURIComponent("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + "CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU" + "&key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo"
    )).then(function(response) {
        console.log(response);
        response.json().then(function(data) {
            console.log(data);
        })
    })
}

// DISTANCE MATRIX API
function distanceMatrixApi(locationLat, locationLng, userLat, userLon, userMethod, placeObject) {
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
        var infObject = {
            distance: data.rows[0].elements[0].distance.text,
            time: data.rows[0].elements[0].duration.text
        }
		var zoomValue = ""
		var randomVar = parseInt(infObject.distance);
		if (randomVar <= 5){
zoomValue = 11;
		} else {
			zoomValue = 10;
		}
		
		fetchStatic(userLat, userLon, zoomValue, locationLat, locationLng)

        displayContent(placeObject, infObject);
    });
    }
});
}

// PLACES API Function
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
        var randomResults = data.results[Math.floor(Math.random() * data.results.length)];
        console.log(randomResults);

        // create obj to send to distanceMatrix()
        var placeObject = {
            name: randomResults.name,
            id: randomResults.place_id,
            address: randomResults.vicinity,
            photo: randomResults.photos[0].photo_reference,
            status: randomResults.opening_hours.open_now
        }
        // send photo ref to get photo
        //photoFetch(placeObject.photo);
        
        var locationLat = randomResults.geometry.location.lat;
        var locationLng = randomResults.geometry.location.lng;
        distanceMatrixApi(locationLat, locationLng, userLat, userLon, userMethod, placeObject);
        });
    }
});
}

//user location
$("#location-btn").on("click", function (e) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (response) {
        userLocation.lat = response.coords.latitude;
        userLocation.lon = response.coords.longitude;
    });
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

// Need: Function to print data to page
//       Function to reset page content for next click
//       Function to save places to local storage 
//       Function to remove places from local storage

//data.rows[0].elements[0].distance (use to compare to make sure the response returned is within distance parameters)