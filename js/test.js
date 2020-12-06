

//create icons
var StarIcon = L.icon({
  iconUrl: 'img/reserve.png',
  iconSize: [25, 25]
});

//create markers with different icons
function getStarMarker(feature, latlng) {
  return L.marker(latlng, {
    icon: StarIcon
  });
}

//attach popups to the markers
function getPopup(feature, layer) {
	layer.bindPopup("<strong>" + feature.properties.POINAME + "</strong><br/>" + feature.properties.UNITNAME + " " + feature.properties.REGIONCODE + ", " + feature.properties.CITY + "<br/>" + "<a target = _blank href=" +
                feature.properties.URL + ">" + feature.properties.URLDISPLAY + "</a>");
}

/////////////////////////////////////////////////////////////////////////////////////////////
//displaying the data//
/////////////////////////////////////////////////////////////////////////////////////////////

//create empty GeoJSON layers to be populated later
var PointsOfInterest = L.geoJson(false, {
    pointToLayer: getStarMarker,
    onEachFeature: getPopup
}).addTo(map);

//populate GeoJSON layers with data from external files
$.getJSON("https://dl.dropbox.com/s/iq4068wv4xv1imt/brew.geojson", function(data) {
    PointsOfInterest.addData(data);
});


