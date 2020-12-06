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
	maxZoom: 20,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});
       
    var baseMaps = {
    "Basic": CartoDB_Voyager,
    "Topographic": Esri_NatGeoWorldMap,
    "Imagery": USGS_USImagery
    };
    
    var PointsOfInterest = new L.geoJson();

        $.ajax({
        dataType: "json",
        url: "data/NationalParks_POI.geojson",
        success: function(data) {
            $(data.features).each(function(key, data, createPoints) {
                PointsOfInterest.addData(data);
            });
        }
        })
    
//style points of interest layer
function stylePointsOfInterest(feature){
    return {
        radius: 4,
        fillColor: "#4D59F7",
        color: "#EFEFEF",
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8,
        zIndex: 600
    };
};

//style trails layer
function styleTrails(feature){
    return {
        fillColor: "#21F2F9",
        opacity: 0.5,
        weight: 0.5,
        color: "black",
        fillOpacity: 0.4,
        zIndex: 400
    };
};
    
    //var Trails = new L.GeoJSON.AJAX("data/NPTrails.geojson", {style: TrailStyle});
    
    var Trails = new L.geoJson();

        $.ajax({
        dataType: "json",
        url: "data/NPTrails.geojson",
        success: function(data) {
            $(data.features).each(function(key, data) {
                Trails.addData(data);
            });
        }
        })
    
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