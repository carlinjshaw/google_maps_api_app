var savedUserInput = [];
var userLocation = {};

var storedPlacesEl = document.querySelector("#storage-row");

function updateLocalStorage(key, data) {
  localStorage.setItem(key, data);
}

function checkHistory() {
  var localHistory = localStorage.getItem("history");
  if (localHistory != null) {
    locationHistory = JSON.parse(localHistory);
    console.log(localHistory);
    return true;
  }
  return false;
}

// LOCAL STORAGE function
// function checkStorage(key, savedUserInput, storedObj) {
//     var localHistory = localStorage.getItem("history");
//     if (localHistory != null) {
//     locationHistory = JSON.parse(localHistory);
//     console.log(localHistory);
//     return true;
//     }
//     else {
//         localHistory = [];
//     }

//     localHistory.push(storedObj);
//     console.log(localHistory);

//     localStorage.setItem("history",  JSON.stringify(localHistory));
//     console.log("we made it");
//     console.log(localStorage);
// }

// function to display content to page
var displayContent = function (placeObject, infObject) {
  $("#place-name").text(placeObject.name);
  $("#address-el").text(placeObject.address);
  $("#distance").text(infObject.distance);
  $("#travel-time").text(infObject.time);
  if (placeObject.status) {
    $("#status-el").text("Open Now");
  } else {
    $("#status-el").text("Closed");
  }
  console.log(placeObject.type);
  if (placeObject.type === "restaurant") {
    $("#place-icon").text("local_dining");
    $("#place-icon").removeClass("red-text").addClass("black-text");
  }
  if (placeObject.type === "point-of-interest") {
    $("#place-icon").text("room");
    $("#place-icon")
      .removeClass("black-text")
      .addClass("large material-icons red-text");
  }
};

// display map
var fetchStatic = function (ranLocation, locationObject, zoomValue) {
  var staticUrl =
    "https://maps.googleapis.com/maps/api/staticmap?center=" +
    locationObject.lat +
    "," +
    locationObject.lon +
    "&zoom=" +
    zoomValue +
    "&size=480x480&maptype=roadmap&markers=color:green%7Clabel:Start%7C" +
    locationObject.lat +
    "," +
    locationObject.lon +
    "&markers=color:red%7Clabel:Finish%7C" +
    ranLocation.lat +
    "," +
    ranLocation.lng +
    "&key=AIzaSyA76IoInowLeKlfuTlf0yYHVH95eZAz4mg";
  console.log(staticUrl);
  $("#map-content").html("<img src='" + staticUrl + "'/ >");
};

// DISTANCE MATRIX API
function distanceMatrixApi(ranLocation, locationObject, placeObject) {
  fetch(
    "https://api.allorigins.win/raw?url=" +
      encodeURIComponent(
        "https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyBjep3oamseN_xrez7jazTRvj92qBnDqFI&units=imperial&origins=" +
          locationObject.lat +
          "," +
          locationObject.lon +
          "&destinations=" +
          ranLocation.lat +
          "," +
          ranLocation.lng +
          "&mode=" +
          locationObject.method
      )
  )
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // set distance matrix data into object
          var infObject = {
            distance: data.rows[0].elements[0].distance.text,
            time: data.rows[0].elements[0].duration.text,
          };
          var zoomValue = "";
          var randomVar = parseInt(infObject.distance);
          if (randomVar <= 5) {
            zoomValue = 11;
          } else {
            zoomValue = 10;
          }

          // on click save btn to update local storage
          $("#save-btn").on("click", function (e) {
            // save to local storage!
            var storedObj = {};
            storedObj.name = placeObject.name;
            storedObj.address = placeObject.address;
            storedObj.distance = infObject.distance;
            storedObj.method = userMethod;

            savedUserInput.push(storedObj);
            updateLocalStorage("history", JSON.stringify(savedUserInput));
          });

          // savedUserInput.push(storedObj);
          // updateLocalStorage("history", JSON.stringify(savedUserInput));

          // get map and display content
          fetchStatic(ranLocation, locationObject, zoomValue);
          displayContent(placeObject, infObject);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect");
    });
}

// PLACES API Function
function placesApi(locationObject) {
  fetch(
    "https://api.allorigins.win/raw?url=" +
      encodeURIComponent(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
          locationObject.lat +
          "," +
          locationObject.lon +
          "&radius=" +
          locationObject.distance +
          "&type=" +
          locationObject.destination +
          "&opennow=true&key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo"
      )
  )
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var randomResults =
            data.results[Math.floor(Math.random() * data.results.length)];
          console.log(randomResults);

          // create obj to send to distanceMatrix()
          var placeObject = {
            name: randomResults.name,
            id: randomResults.place_id,
            address: randomResults.vicinity,
            status: randomResults.opening_hours.open_now,
            type: locationObject.destination,
          };

          var locationLat = randomResults.geometry.location.lat;
          var locationLng = randomResults.geometry.location.lng;
          distanceMatrixApi(
            { lat: locationLat, lng: locationLng },
            locationObject,
            placeObject
          );
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect");
    });
}

//user location
$("#location-btn").on("click", function (e) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (response) {
      userLocation.lat = response.coords.latitude;
      userLocation.lon = response.coords.longitude;
      fetch(
        "https://api.allorigins.win/raw?url=" +
          encodeURIComponent(
            "https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyBjep3oamseN_xrez7jazTRvj92qBnDqFI&units=imperial&origins=" +
              userLocation.lat +
              "," +
              userLocation.lon +
              "&destinations=" +
              userLocation.lat +
              "," +
              userLocation.lon
          )
      )
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              $("#address").text(data.origin_addresses[0]);
            });
          } else {
            alert("Error: " + response.statusText);
          }
        })
        .catch(function (error) {
          alert("Unable to connect");
        });
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
  placesApi({
    distance: userDistance,
    method: userMethod,
    destination: userDestination,
    lat: userLat,
    lon: userLon,
  });
});

var outerCard = document.createElement("div");
outerCard.className = "col xl2 l6 m12 s12";
var secondCard = document.createElement("div");
secondCard.className = "card blue-grey";
var thirdCard = document.createElement("div");
thirdCard.className = "card-content white-text";
var cardTitle = document.createElement("span");
cardTitle.className = "card-title";
cardTitle.innerText = "Card Header";
var cardIcon = document.createElement("i");
cardIcon.className = "material-icons";
cardIcon.innerHTML = "add";
var cardAddress = document.createElement("p");
cardAddress.innerHTML = "1422 Fettler Way, Winter Garden FL 32787";

thirdCard.appendChild(cardTitle);
thirdCard.appendChild(cardIcon);
thirdCard.appendChild(cardAddress);
secondCard.appendChild(thirdCard);
outerCard.appendChild(secondCard);
storedPlacesEl.appendChild(outerCard);

$(document).ready(function () {
  $(".sidenav").sidenav();
});
