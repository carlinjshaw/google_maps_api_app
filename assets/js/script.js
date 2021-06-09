if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function (response) {
  placesApi(response.coords.latitude, response.coords.longitude);
    // userLocation.push(response.coords.latitude)
    });
  }
  // console.log(userLocation)
  
function placesApi(lat, lon) {
  console.log(lat, lon);
  var currentLat = lat;
  var currentLon = lon;
  fetch(
    "https://api.allorigins.win/raw?url=" +
      encodeURIComponent(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
          lat +
          "," +
          lon +
          "&radius=100000&type=restaurant&key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo"
      )
  ).then(function (response) {
    console.log(response);
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);

        var searchResults =
          data.results[Math.floor(Math.random() * data.results.length)];
        console.log(searchResults);

        var locationLat = searchResults.geometry.location.lat;
        var locationLng = searchResults.geometry.location.lng;

        distanceMatrixApi(locationLat, locationLng, currentLat, currentLon);
      });
    }
  });
}

function distanceMatrixApi(lat, lng, userLat, userLon) {
  fetch(
    "https://api.allorigins.win/raw?url=" +
      encodeURIComponent(
        "https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyBjep3oamseN_xrez7jazTRvj92qBnDqFI&origins=" +
          userLat +
          "," +
          userLon +
          "&destinations=" +
          lat +
          "," +
          lng
      )
  ).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    }
  });
}
