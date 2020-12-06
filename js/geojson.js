/* Map of GeoJSON data from MegaCities.geojson */

//function to instantiate the Leaflet map
function createMap(){
    
    //add Carto base tilelayer
    var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	   subdomains: 'abcd',
	   maxZoom: 19
});
    //add Esri tilelayer    
    var Esri_NatGeoWorldMap =           L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	   attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	   maxZoom: 16
});
    
    var USGS_USImagery = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
	maxZoom: 16,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});
       
    var baseMaps = {
    "Basic": CartoDB_Voyager,
    "Topographic": Esri_NatGeoWorldMap,
    "Imagery": USGS_USImagery
    };
    
//create icons
//var StarIcon = L.icon({
  //iconUrl: 'file:///C:/users/Greg/Geog575_FinalProject/img/reserve.png',
  //iconSize: [25, 25]
//});

//create markers with different icons
function getPOIMarker(feature, latlng) {
  return L.circleMarker(latlng, PointsOfInterestMarker);
  };

//attach popups to the markers
function getPopup(feature, layer) {
	layer.bindPopup("<strong>" + feature.properties.POINAME + "</strong><br/>" + feature.properties.UNITNAME + " " + feature.properties.REGIONCODE + ", " + feature.properties.CITY + "<br/>" + "<a target = _blank href=" +
                feature.properties.URL + ">" + feature.properties.URLDISPLAY + "</a>");
}

//create empty GeoJSON layers to be populated later
var PointsOfInterest = L.geoJson(false, {
    pointToLayer: getPOIMarker,
    onEachFeature: getPopup
})

//populate GeoJSON layers with data from external files
$.getJSON("data/NationalParks_POI.geojson", function(data) {
    PointsOfInterest.addData(data);
});
    
    //var Trails = new L.GeoJSON.AJAX("data/NPTrails.geojson", {style: TrailStyle});

//create markers with different icons
function getTrails(feature, latlng) {
  return L.polyline(latlng, TrailsStyle);
  };

//attach popups to the markers
function getPopup(feature, layer) {
	layer.bindPopup("<strong>" + feature.properties.POINAME + "</strong><br/>" + feature.properties.UNITNAME + " " + feature.properties.REGIONCODE + ", " + feature.properties.CITY + "<br/>" + "<a target = _blank href=" +
                feature.properties.URL + ">" + feature.properties.URLDISPLAY + "</a>");
}

//create empty GeoJSON layers to be populated later
var Trails = L.geoJson(false, {
    pointToLayer: getTrails,
    onEachFeature: getPopup
})

//populate GeoJSON layers with data from external files
$.getJSON("data/NPTrails.geojson", function(data) {
    Trails.addData(data);
});
    
    var overlayMaps = {
    "Points of Interest": PointsOfInterest,
    "Trails": Trails
};
    
    //create the map
    var map = L.map('mapid', {
        center: [46.5, -100],
        zoom: 4,
        layers: [CartoDB_Voyager]
        
    });
      
    //call getData function
    getData(map);
    
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
};

$(document).ready(createMap);