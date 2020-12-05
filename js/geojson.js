/* Map of GeoJSON data from MegaCities.geojson */

//function to instantiate the Leaflet map
function createMap(){
    
    //add OSM base tilelayer
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
    
    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
       
    var baseMaps = {
    "Basic": CartoDB_Voyager,
    "Topographic": Esri_NatGeoWorldMap,
    "Streets": OpenStreetMap_Mapnik
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

    var TrailStyle = 
        {color: "green",
		opacity: 1,
		weight: 2,
		fillOpacity: 0};
    
    //var Trails = new L.GeoJSON.AJAX("data/NPTrails.geojson", {style: TrailStyle});
    
    var NationalParks = new L.geoJson();

        $.ajax({
        dataType: "json",
        url: "data/NationalParks.geojson",
        success: function(data) {
            $(data.features).each(function(key, data, createPoints) {
                NationalParks.addData(data);
            });
        }
        })
    
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
    "Trails": Trails,
    "Parks":NationalParks
};
    
    //create the map
    var map = L.map('mapid', {
        center: [46.5, -100],
        zoom: 4,
        layers: [CartoDB_Voyager, NationalParks]
    });
      
    //call getData function
    getData(map);
    
    L.control.layers(baseMaps, overlayMaps).addTo(map);
};

$(document).ready(createMap);