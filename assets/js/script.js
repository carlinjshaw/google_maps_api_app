let userLocation = {};
var savedUserInput = [];
let lastSearchedItem = {};
var lastSearchedMap = (lastSearchedItem.hasSaved = false);

var storedPlacesEl = document.querySelector("#storage-row");

function updateLocalStorage(key, data) {
  localStorage.setItem(key, data);
  console.log("break");
  var localTest = localStorage.getItem("history");
  console.log(JSON.parse(localTest));
}

function checkHistory() {
  var localHistory = localStorage.getItem("history");
  if (localHistory != null) {
    savedUserInput = JSON.parse(localHistory);
    $.each(savedUserInput, function (key, data) {
      generateSavedItem(data);
    });
    return true;
  }
  return false;
}

// function to display content to page
function displayContent(placeObject, infObject) {
  $("#place-name").text(placeObject.name);
  $("#address-el").text(placeObject.address);
  $("#distance").text(infObject.distance);
  $("#travel-time").text(infObject.time);
  // $("#map-content").html("<img src='" + placeObject.map + "'/ >");

  if (placeObject.status) {
    $("#status-el").text("Open Now");
  } else {
    $("#status-el").text("Closed");
  }
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
}

function displaySavedMap(data) {
  $("#map-content").html("<img src='" + data.map + "'/ >");
}

function generateSavedItem(data) {
  var outerCard = document.createElement("div");
  outerCard.className = "col xl3 l6 m12 s12 storageItem";
  outerCard.dataset.time = data.time;
  outerCard.dataset.status = data.status;
  outerCard.dataset.name = data.name;
  outerCard.dataset.distance = data.distance;
  outerCard.dataset.address = data.address;
  outerCard.dataset.type = data.type;
  outerCard.dataset.map = data.map;
  var secondCard = document.createElement("div");
  secondCard.className = "card blue-grey";
  var thirdCard = document.createElement("div");
  thirdCard.className = "card-content white-text";
  var cardTitle = document.createElement("span");
  cardTitle.className = "card-title";
  cardTitle.innerText = data.name;
  var cardIcon = document.createElement("i");
  cardIcon.className = "material-icons";

  if (data.type === "point-of-interest") {
    cardIcon.innerHTML = "place";
  } else if (data.type === "restaurant") {
    cardIcon.innerHTML = "restaurant_menu";
  }
  var cardAddress = document.createElement("p");
  cardAddress.innerHTML = data.address;

  thirdCard.appendChild(cardTitle);
  thirdCard.appendChild(cardIcon);
  thirdCard.appendChild(cardAddress);
  secondCard.appendChild(thirdCard);
  outerCard.appendChild(secondCard);
  storedPlacesEl.prepend(outerCard);
}

// display map
function fetchStatic(ranLocation, locationObject, zoomValue) {
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

  lastSearchedMap = staticUrl;
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

          lastSearchedItem.name = placeObject.name;
          lastSearchedItem.address = placeObject.address;
          lastSearchedItem.distance = infObject.distance;
          lastSearchedItem.method = location.method;
          lastSearchedItem.type = placeObject.type;
          lastSearchedItem.time = infObject.time;
          lastSearchedItem.status = placeObject.status;
          lastSearchedItem.hasSaved = false;
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

// on click save btn to update local storage
$("#save-btn").on("click", function (e) {
  // save to local storage!
  if (!lastSearchedItem.hasSaved) {
    var storedObj = {};
    storedObj.name = lastSearchedItem.name;
    storedObj.address = lastSearchedItem.address;
    storedObj.distance = lastSearchedItem.distance;
    storedObj.method = lastSearchedItem.method;
    storedObj.type = lastSearchedItem.type;
    storedObj.time = lastSearchedItem.time;
    storedObj.status = lastSearchedItem.status;
    storedObj.map = lastSearchedMap;
    lastSearchedItem.hasSaved = true;

    savedUserInput.push(storedObj);

    updateLocalStorage("history", JSON.stringify(savedUserInput));
    generateSavedItem(storedObj);
  }
});

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

// on click for user location
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

// on click save button for storage 
$("#storage-row").on("click", ".storageItem", function (e) {
  var $this = $(this);
  displayContent($this.data(), $this.data());
  displaySavedMap($this.data());
});

// on click side nav bar 
$(document).ready(function () {
  $(".sidenav").sidenav();
  checkHistory();
});
