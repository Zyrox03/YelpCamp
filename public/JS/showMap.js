
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v11',// style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});


// create the popup
const popup = new mapboxgl.
  Popup({ offset: 25 })
  .setHTML(
    `<h2>${campground.name}</h2><p>${campground.location}</p>`
  );


// Create a default Marker and add it to the map.

const marker1 = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);


  // Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());


console.log(campground)
