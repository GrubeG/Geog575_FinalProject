//style schools
var PointsOfInterest;

//style school markers
var PointsOfInterestMarker = {
    radius: 4,
    fillColor: "#4D50F7",
    color: "#EFEFEF",
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8,
    zIndex: 600
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data from the json
    $.ajax("data/NationalParks_POI.geojson", {
        dataType: "json",
        success: function(response){
            createPoints(response, map);
            otherLayers(response, map);
		}
    });
};

function createPoints(data,map){
        PointsOfInterest = L.geoJson(data, {
                    pointToLayer: function (feature, latlng){
                        return pointToLayer(feature, latlng);
                    }
                });
        map.addLayer(PointsOfInterest);
    };
    
    //create function to make the proportional symbols of a certain color, fill, opacity, etc
    function pointToLayer(feature, latlng){	
        var layer = L.circleMarker(latlng, PointsOfInterestMarker);

        //build popup content string
        var popupContent = "<p><b>Feature Name:</b> " + feature.properties.POINAME + "</p>";
        popupContent += "<p><b>Park Name:</b> " + feature.properties.UNITNAME + "</p>";

        //bind the popup to the circle marker
        layer.bindPopup(popupContent, {
            offset: new L.point(0, -1)
        });

        return layer;		
    };


var pointsofinterest = L.layerGroup(PointsOfInterest);
var trails = L.layerGroup(Trails);

//style counties layer
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

//style districts layer
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

function createMap(){
    //create map object
    var map = L.map("map", {
        center: [44.7844, -89.7879],
        zoom: 7,
        minZoom: 3,
        maxZoom: 12
    });
    
	getData(map);
};


function otherLayers(response, map){ 
    //add base tile layer
    var light = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ', {
        //map attribution
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        //zoom
        maxZoom: 18,
        // mapbox light
        id: 'mapbox.light',
        //my unique access token
        accessToken: 'pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ'
    }),
        streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ', {
        //map attribution
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
        //zoom
        maxZoom: 18,
        // mapbox streets
        id: 'mapbox.streets',
        //my unique access token
        accessToken: 'pk.eyJ1IjoiZW1pbGxpZ2FuIiwiYSI6ImNqczg0NWlxZTBia2U0NG1renZyZDR5YnUifQ.UxV3OqOsN6KuZsclo96yvQ'
    }).addTo(map);
    
    var counties = new L.geoJSON(Counties, {style:styleCounties}).addTo(map);
    var districts = new L.geoJSON(Districts, {style:styleDistricts}).addTo(map);
    
    //add basemaps
    var baseMaps = {
        "Greyscale": light,
        "Streets": streets,
    };
    //add new data layer
    var overlayMaps = {
        "Unified School Districts": districts,
        "Counties": counties
    };
    //layer control
    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(map);
    //bring schools layer to front right away
    schools.bringToFront();
    
    //bring schools layer to the front every time overlay is changed
    map.on("overlayadd", function (event) {
        schools.bringToFront();
    });
        
    //search for a school
    var searchControl = new L.Control.Search({
        position: 'topright', //position on page
        layer: schools,
		propertyName: 'SCHOOL', //school column
        textPlaceholder: 'Search School Name', //search by name of school
        marker: {
            icon: false
        },
        collapsed: false,
		moveToLocation: function(latlng, title, map) {
			//console.log(latlng);
			zoom = 10;
  			map.setView(latlng, zoom); // access the zoom
		}
    });
    
	searchControl.on('search:locationfound', function(e) {

    //style the search icon result
	e.layer.setStyle({fillColor: '#ffff00', color: '#ffff00', fillOpacity: 1});
	if(e.layer._popup)
        //open the popup for the selected school
		e.layer.openPopup();
	});
	
    //initialize search control
    map.addControl(searchControl);
    
    
    
    //slider function
    var range = document.getElementById('range');

    //set up slider
    noUiSlider.create(range, {
        start: [ 50, 80 ], // Handle start position
        step: 5, // Slider moves in increments of '10'
        margin: 10, // Handles must be more than '10' apart
        connect: true, // Display a colored bar between the handles
        direction: 'rtl', // Put '0' at the bottom of the slider
        orientation: 'vertical', // Orient the slider vertically
        behaviour: 'tap-drag', // Move handle on tap, bar is draggable
        range: { // Slider can select '0' to '100'
            'min': 30,
            'max': 100
        },
        //style the filter slider tooltips
        tooltips: true,
        format: wNumb({
                decimals: 0,
                suffix: '% vaccinated'
        })
    });
    
    //sets min and max input values
    document.getElementById('input-number-min').setAttribute("value", 30);
    document.getElementById('input-number-max').setAttribute("value", 100);

    var inputNumberMin = document.getElementById('input-number-min'),
        inputNumberMax = document.getElementById('input-number-max');
    
    //when the input changes, set the slider value
    inputNumberMin.addEventListener('change', function(){
        range.noUiSlider.set([this.value, null]);
    });
    
    //when the input changes, set the slider value
    inputNumberMax.addEventListener('change', function(){
        range.noUiSlider.set([null, this.value]);
    });

    //define what values are being called by the slider
    range.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            document.getElementById('input-number-min').setAttribute("value", values[0].split("%")[0]);
        } else {
            document.getElementById('input-number-max').setAttribute("value", values[1].split("%")[0]);
        }
        
        rangeMin = Number(document.getElementById('input-number-min').getAttribute("value"));
        rangeMax = Number(document.getElementById('input-number-max').getAttribute("value"));
        
        
        schools.setStyle(function(feature){ 
            return styleFilter(feature); 
        });
        
        //remove interactivity from hidden points so they can't be clicked on
        schools.eachLayer(function(layer){
            if(!((+layer.feature.properties.PctMetMinRequirements_Vax <= rangeMax) && (+layer.feature.properties.PctMetMinRequirements_Vax >= rangeMin))){
                //remove class='leaflet-interactive' from hidden points
                L.DomUtil.removeClass(layer._path, 'leaflet-interactive');
            }else{
                //retain interactivity for visible points
                L.DomUtil.addClass(layer._path, 'leaflet-interactive');
            }
        });

        //make points that are not within the filter range invisible
        function styleFilter(feature){
            if(!((+feature.properties.PctMetMinRequirements_Vax <= rangeMax) && (+feature.properties.PctMetMinRequirements_Vax >= rangeMin))){
                //invisible point styling
                var styleHidden = {
                    opacity: 0,
                    fillOpacity: 0
                };
                return styleHidden;

            }else{
                //regular point styling
                return schoolsMarker;
            }
        }
        
    });
};

$(document).ready(createMap);

