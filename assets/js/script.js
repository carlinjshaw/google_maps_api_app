// fetch all places with the type restaurant, with a keyword red, within a 60 mile radius of orlando
fetch('https://api.allorigins.win/raw?url=' +  
encodeURIComponent('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.5383,-81.3792&radius=100000&type=restaurant&key=AIzaSyBNemHqQ_a0mlEfgAo0C2IZN3hwCYT4RDo'))
.then(res => res.json())
.then(console.log);