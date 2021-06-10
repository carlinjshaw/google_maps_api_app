
fetch('https://api.allorigins.win/raw?url=' +  
encodeURIComponent('https://maps.googleapis.com/maps/js?key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo'))
.then(res => res.json())
.then(console.log);

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 15,
  });
}