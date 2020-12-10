//style school markers
var NationalParksStyle = {
    fillColor: "#56903A",
    fill: true,
    weight: 2,
    opacity: 1,
    color: '#213A1B',
    dashArray: '5',
    fillOpacity: 0.2
};

//style school markers
var PointsOfInterestMarker = {
    radius: 4,
    fillColor: "#f7fcb9",
    color: "#213A1B",
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8,
    zIndex: 600
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data from the json
    $.ajax("data/NationalParks.geojson",  {
        dataType: "json",
        success: function(response){
            
            NationalParksPoly(response, map);
            otherLayers(response, map);
		}
    });
        
};

function NationalParksPoly(data, map){
        NationalParks = L.geoJson(data, {
            style: NationalParksStyle,
            onEachFeature: onEachFeature
            });

      
function onLayerClick () {
    map.once('moveend', getParkPopup, this);
    map.fitBounds(this.getBounds());
}
    
function onEachFeature (feature, layer) {
    layer.on('click', onLayerClick);
}

//attach popups to the markers
function getParkPopup(feature, layer, map) {
    
	this.bindPopup("<strong>" + this.feature.properties.UNIT_NAME + "</strong><br/>" + "Year Created: " + this.feature.properties.YEAR + "<br/>" + "<a target = _blank href=" + this.feature.properties.URL + ">" + this.feature.properties.URLDISPLAY + "</a>").openPopup();
       
}
};

function otherLayers(response, map){ 
        
    //search for a park
    var searchControl = new L.Control.Search({
        position: 'topright', //position on page
        layer: NationalParks,
		propertyName: 'UNIT_NAME', //name column
        textPlaceholder: 'Search Park Name', //search by park name
        marker: false,
        collapsed: false,
        initial: true,
		moveToLocation: function(latlng, title, map) {
			//console.log(latlng);
			var zoom = map.getBoundsZoom(latlng.layer.getBounds());
  			map.setView(latlng, zoom); // access the zoom
		}
    });
    
	searchControl.on('search:locationfound', function(e) {

    //style the search result
	e.layer.setStyle({fillColor: '#56903A', color: '#213A1B', fillOpacity: 0.2});
	if(e.layer._popup)
        //open the popup for the selected park
		e.layer.openPopup();
	}).on('search:collapsed', function(e) {

		NationalParks.eachLayer(function(layer) {	//restore feature color
			NationalParks.resetStyle(layer);
		});	
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


