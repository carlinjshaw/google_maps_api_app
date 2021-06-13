var savedUserInput = [];
var userLocation = {};
// DOM Elements
var placeNameEl = document.querySelector("#place-name");
var imgEl = document.querySelector("#img-el");
var addressEl = document.querySelector("#address-el");
var distanceEl = document.querySelector("#distance");
var timeEl = document.querySelector("#travel-time");
var statusEl = document.querySelector("#status-el");
var mapEl = document.querySelector("#map-content");
var iconEl = document.querySelector("#place-icon")
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
    locationHistory = JSON.parse(localHistory);
    console.log(localHistory);
    return true;
  }
  return false;
}

//LOCAL STORAGE function - run immediately on page load ****************************** ******************************************************************************************
// if empty 
// if not empty load cards at bottom 
function checkStorage(key, savedUserInput, storedObj) {
    var localHistory = localStorage.getItem("history");
    localHistory = JSON.parse(localHistory);
    if (!localHistory ||localHistory.length === 0) {
    //if (localHistory || localHistory.length > 0) {
    localHistory = [];
    console.log(localHistory); 
    }
    else {
        console.log(localHistory);
    }

    // MOVE TO UPDATELOCAL STORAGE - separate function 
    // local stoage should save on click, local storage should be checked on page load 
    localHistory.push(storedObj);
    console.log(localHistory);

    localStorage.setItem("history",  JSON.stringify(localHistory));
    console.log("we made it");
    console.log(localStorage);
}



// function to display content to page
var displayContent = function (placeObject, infObject) {
  placeNameEl.innerHTML = placeObject.name;
  addressEl.innerText = placeObject.address;
  distanceEl.innerText = infObject.distance;
  timeEl.innerText = infObject.time;
  if (placeObject.status) {
    statusEl.innerText = "Open Now";
  } else {
    statusEl.innerText = "Closed";
    }
    if(placeObject.type === "restaurant") {
        iconEl.innerText = "local_dining";
        if(iconEl.classList.contains("red-text")) {
            iconEl.classList.remove("red-text");
        }
    }
    if(placeObject.type === "point-of-interest") {
        iconEl.innerText = "room";
        iconEl.classList.add("red-text");
    }
};

// display map
var fetchStatic = function (
  originLat,
  originLon,
  zoomValue,
  destinationLat,
  destinationLon
) {
  var staticUrl =
    "https://maps.googleapis.com/maps/api/staticmap?center=" +
    originLat +
    "," +
    originLon +
    "&zoom=" +
    zoomValue +
    "&size=480x480&maptype=roadmap&markers=color:green%7Clabel:Start%7C" +
    originLat +
    "," +
    originLon +
    "&markers=color:red%7Clabel:Finish%7C" +
    destinationLat +
    "," +
    destinationLon +
    "&key=AIzaSyA76IoInowLeKlfuTlf0yYHVH95eZAz4mg";
  mapEl.innerHTML = "<img src='" + staticUrl + "'/ >";
};

// fetch photo from places
// var photoFetch = function (photoRef) {
//   fetch(
//     "https://api.allorigins.win/raw?url=" +
//       encodeURIComponent(
//         "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
//           "CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU" +
//           "&key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo"
//       )
//   )
//     .then(function (response) {
//       if (response.ok) {
//         response.json().then(function (data) {
//           console.log(data);
//         });
//       } else {
//         alert("Error: " + response.statusText);
//       }
//     })
//     .catch(function (error) {
//       alert("Unable to connect");
//     });
// };

// DISTANCE MATRIX API
function distanceMatrixApi(
  locationLat,
  locationLng,
  userLat,
  userLon,
  userMethod,
  placeObject
) {
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
          "&mode=" +
          userMethod
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
            $("#save-btn").on("click", function(e) {
                // save to local storage! 
                var storedObj = {};
                storedObj.name = placeObject.name; 
                storedObj.address = placeObject.address;
                storedObj.distance = infObject.distance;
                storedObj.method = userMethod;
                savedUserInput.push(storedObj);

                // run local storage set logic HERE 
                updateLocalStorage("history", JSON.stringify(savedUserInput));
            })
            

        // savedUserInput.push(storedObj);
        // updateLocalStorage("history", JSON.stringify(savedUserInput));

          // get map and display content
          fetchStatic(userLat, userLon, zoomValue, locationLat, locationLng);
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
function placesApi(
  userDistance,
  userMethod,
  userDestination,
  userLat,
  userLon
) {
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
            "&opennow=true&key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo"
        )
    ).then(function (response) {
    if (response.ok) {
        response.json().then(function (data) {
          var randomResults =
            data.results[Math.floor(Math.random() * data.results.length)];

          // create obj to send to distanceMatrix()
          var placeObject = {
            name: randomResults.name,
            id: randomResults.place_id,
            address: randomResults.vicinity,
            //photo: randomResults.photos[0].photo_reference,
            status: randomResults.opening_hours.open_now,
            type: userDestination
        };

        
        // send photo ref to get photo
        //photoFetch(placeObject.photo);

          var locationLat = randomResults.geometry.location.lat;
          var locationLng = randomResults.geometry.location.lng;
          distanceMatrixApi(
            locationLat,
            locationLng,
            userLat,
            userLon,
            userMethod,
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
  placesApi(userDistance, userMethod, userDestination, userLat, userLon);
});




var outerCard = document.createElement("div"); 
outerCard.className = "col s2"; 
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
