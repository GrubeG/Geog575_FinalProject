

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
        weight: 3,
        opacity: 1,
        color: '#6F4930',
        dashArray: '3',
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
        center: [37.5, -100],
        zoom: 4,
        minZoom: 3,
        layers: [CartoDB_Voyager]
        
    });
    
    //call getData function
    getData(map);
    
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
    
    // Array of easy buttons for areas outside continental US
var buttons = [
  L.easyButton('<img src="img/noun_Home_Symbol.svg">', function(){
      map.setView([37.5, -100], 4);
  },'Zoom to Original Extent',{ position: 'topleft' }),

  L.easyButton('<span>AK</span>', function(){
      map.setView([63.144912, -152.541399], 5);
  },'Zoom to Alaska',{ position: 'topleft' }),

  L.easyButton('<span>HI</span>', function(){
      map.setView([20.5, -156.959362], 7);
  },'Zoom to Hawaii',{ position: 'topleft' }),

  L.easyButton('<span>VI</span>', function(){
       map.setView([18, -64.727032], 10);
   },'Zoom to U.S. Virgin Islands',{ position: 'topleft' }),
    
  L.easyButton('<span>AS</span>', function(){
       map.setView([-14.251697, -170.116709], 9);
   },'Zoom to American Samoa',{ position: 'topleft' }),
];
    L.easyBar(buttons, { position: 'topleft' }
                
    ).addTo(map);
    
     // Add easy button to pull up splash screen
    L.easyButton('<img src="img/noun_Information.svg">', function(){
        $('#splash-screen').modal('show');
    },'Complete List of Parks',{ position: 'topright' }).addTo(map);
    

};



$(document).ready(createMap);