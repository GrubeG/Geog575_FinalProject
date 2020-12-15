var NationalParks;
//style school markers
var NationalParksStyle = {
    fillColor: "#56903A",
    fill: true,
    weight: 2,
    opacity: 1,
    color: '#213A1B',
    dashArray: '3',
    fillOpacity: 0.2
};

var NationalParksReset = {
    fillColor: "#56903A",
    fill: true,
    fillOpacity: 0.2
};

var highlight = {
    fillColor: "#56903A",
    fill: true,
    fillOpacity: 0.4
};

//style school markers
var PointsOfInterestMarker = {
    radius: 4,
    fillColor: "#f7fcb9",
    color: "#213A1B",
    weight: 1,
    opacity: 0.8,
    fillOpacity: 1,
    zIndex: 600
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data from the json
    $.ajax("data/EJmap2.geojson",  {
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
            onEachFeature: getParkPopup
            });

//attach popups to the markers
function getParkPopup(feature, layer) {
    
	//layer.bindPopup("<strong>" + feature.properties.UNIT_NAME + "</strong><br/>" + "Year Created: " + feature.properties.YEAR + "<br/>" + "<img src='" + feature.properties.imgurl + "'>", {maxHeight: 700, minWidth:400}
    //).openPopup();
    
    
    function selectfeature (e) {
        
            NationalParks.setStyle(NationalParksReset);

            layer.setStyle(highlight);

            layer.bringToBack()
            
            document.getElementById("panel2").innerHTML = "<strong><u>" + feature.properties.UNIT_NAME + "</strong></u><br/>" + "Year Established: " + "<i>" + feature.properties.dateEst + "</i>" + "<br/>" + "Acreage: " + "<i>" + feature.properties.acres + "</i>" + "<br/>" + "Visitors in 2019: " +  "<i>" + feature.properties.visitors + "</i>" + "<br/>" + "<img src='" + feature.properties.imgurl + "'>" + feature.properties.desc
        
            $("#panel2").stop();
            $("#panel2").fadeIn("fast");
        
            map.fitBounds(layer.getBounds());
        
            
    
            };
    
    // This is your click handler. Place elements in the panel
    layer.on({
        click: selectfeature,
    }); 
    
             
             
            
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
			
			var zoom = map.getBoundsZoom(latlng.layer.getBounds());
  			map.setView(latlng, zoom); // access the zoom
		}
    });
    
	searchControl.on('search:locationfound', function(e) {

    //style the search result
	if(e.layer._popup)
        //open the popup for the selected park
		e.layer.openPopup();
		
	});
	
    //initialize search control
    map.addControl(searchControl);
    
    //slider function
    var range = document.getElementById('range');

    //set up slider
    noUiSlider.create(range, {
        start: [ 1872, 2020 ], // Handle start position
        step: 4, // Slider moves in increments of '10'
        margin: 4, // Handles must be more than '10' apart
        connect: true, // Display a colored bar between the handles
        direction: 'ltr', // Put '0' at the bottom of the slider
        orientation: 'horizontal', // Orient the slider vertically
        behaviour: 'tap-drag', // Move handle on tap, bar is draggable
        range: { // Slider can select '0' to '100'
            'min': 1872,
            'max': 2020,
        },
        snap: false,
        //style the filter slider tooltips
        tooltips: true,
        format: wNumb({
                decimals: 0,
                //suffix: '- Parks'
        })
    });
    
    //sets min and max input values
    document.getElementById('input-number-min').setAttribute("value", 1872);
    document.getElementById('input-number-max').setAttribute("value", 2020);

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
    range.noUiSlider.on('update', function(values, handle) {
        if (handle==0){
            document.getElementById('input-number-min').setAttribute("value", values[0]);
            
        } else {
            document.getElementById('input-number-max').setAttribute("value", values[1]);
        }
        
        console.log(values)
        
        rangeMin = Number(document.getElementById('input-number-min').getAttribute("value"));
        rangeMax = Number(document.getElementById('input-number-max').getAttribute("value"));
        
        console.log(rangeMin)
        console.log(rangeMax)
        
        NationalParks.setStyle(function(feature){ 
            return styleFilter(feature); 
        });
        
        //remove interactivity from hidden points so they can't be clicked on
        //NationalParks.eachLayer(function(layer){
        //    if(!((+layer.feature.properties.YEAR <= rangeMax) && (+layer.feature.properties.YEAR >= rangeMin))){
        //        //remove class='leaflet-interactive' from hidden points
        //        L.DomUtil.removeClass(layer._path, 'leaflet-interactive');
        //    }else{
        //        //retain interactivity for visible points
        //        L.DomUtil.addClass(layer._path, 'leaflet-interactive');
        //    }
        //});

        //make points that are not within the filter range invisible
        function styleFilter(feature){
            if(!((+feature.properties.YEAR <= rangeMax) && (+feature.properties.YEAR >= rangeMin))){
                //invisible point styling
                var styleHidden = {
                    opacity: 0,
                    fillOpacity: 0.2
                };
                return styleHidden;

            }else{
                //regular point styling
                return NationalParksStyle;
            }
        }
        
    });
};
