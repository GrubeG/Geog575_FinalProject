

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
    
var PointsOfInterestMarker = {
    radius: 4,
    fillColor: "#f7fcb9",
    color: "#213A1B",
    weight: 1.5,
    opacity: 0.7,
    fillOpacity: 1,
    zIndex: 600
};
    
//create markers with different icons
function getPOIMarker(feature, latlng) {
  return L.circleMarker(latlng, PointsOfInterestMarker);
  };

//attach popups to the markers
function getPOIPopup(feature, layer) {
	layer.bindPopup("<strong>" + feature.properties.POINAME + "</strong><br/>" + feature.properties.UNITNAME);
    layer.on('mouseover', function() { layer.openPopup(); });
    layer.on('mouseout', function() { layer.closePopup(); });
}

//create empty GeoJSON layers to be populated later
var PointsOfInterest = L.geoJson(false, {
    pointToLayer: getPOIMarker,
    onEachFeature: getPOIPopup
})

//populate GeoJSON layers with data from external files
$.getJSON("data/NationalParks_POI.geojson", function(data) {
    PointsOfInterest.addData(data);
});
    
    //var Trails = new L.GeoJSON.AJAX("data/NPTrails.geojson", {style: TrailStyle});

function BestTrailStyle(feature) {
    return {
        fillColor: '#E31A1C',
        weight: 4,
        opacity: 1,
        color: '#6F4930',
        dashArray: '4',
        fillOpacity: 0.7
    };
}

//attach popups to the markers
function getTrailPopup(feature, layer) {
	layer.bindPopup("<strong>" + feature.properties.TRLNAME + "</strong><br/>" + feature.properties.UNITNAME);
    layer.on('mouseover', function() { layer.openPopup(); });
    layer.on('mouseout', function() { layer.closePopup(); });
}

//create empty GeoJSON layers to be populated later
var BestTrails = L.geoJson(false, {
    style: BestTrailStyle,
    onEachFeature: getTrailPopup
})

//populate GeoJSON layers with data from external files
$.getJSON("data/NP_BestTrails.geojson", function(data) {
    BestTrails.addData(data);
});
    
function AllTrailStyle(feature) {
    return {
        fillColor: '#E31A1C',
        weight: 1,
        opacity: 1,
        color: '#C56C39',
        dashArray: '2',
        fillOpacity: 0.7
    };
}

//create empty GeoJSON layers to be populated later
var AllTrails = L.geoJson(false, {
    style: AllTrailStyle
})

//populate GeoJSON layers with data from external files
$.getJSON("data/NPTrails.geojson", function(data) {
    AllTrails.addData(data);
});
    
    var overlayMaps = {
    "Points of Interest": PointsOfInterest,
    "Best Trails": BestTrails,    
    "All Trails": AllTrails
};
    
    //create the map
    var map = L.map('mapid', {
        center: [39.5, -97],
        zoom: 4,
        minZoom: 3,
        layers: [CartoDB_Voyager]
        
    });
    
    //call getData function
    getData(map);
    
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
    
};



$(document).ready(createMap);