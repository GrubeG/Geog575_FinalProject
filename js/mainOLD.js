var NationalParks;
//style National Park polygons
var NationalParksStyle = {
    fillColor: "#56903A",
    fill: true,
    weight: 2,
    opacity: 1,
    color: '#213A1B',
    dashArray: '3',
    fillOpacity: 0.1
};

var NationalParksReset = {
    fillColor: "#56903A",
    fill: true,
    fillOpacity: 0.1
};

var highlight = {
    fillColor: "#56903A",
    fill: true,
    fillOpacity: 0.4
};

//Save original table view for later use
var old_html = $("#panel2").html();

//function to retrieve the park data and place it on the map
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
            onEachFeature: getParkPopup
            });

//Code to get pop-up message, place it in the panel and zoom to location
function getParkPopup(feature, layer) {
    
    function selectfeature (e) {
        
            NationalParks.setStyle(NationalParksReset);

            layer.setStyle(highlight);

            layer.bringToBack()
            
            document.getElementById("panel2").innerHTML = "<strong><u><span class='bigger'>" + feature.properties.UNIT_NAME + "</strong></u></span><br/>" + "Year Established: " + "<i>" + feature.properties.dateEst + "</i>" + "<br/>" + "Acreage: " + "<i>" + feature.properties.acres + "</i>" + "<br/>" + "Visitors in 2019: " +  "<i>" + feature.properties.visitors + "</i>" + "<br/>" + "<img src='" + feature.properties.imgurl + "'>" + "<br/>" + feature.properties.desc_
        
            $("#panel2").stop();
            $("#panel2").fadeIn("fast");
        
            map.fitBounds(layer.getBounds());
        
            };
    
    //Click handler. Place elements in the panel
    layer.on({
        click: selectfeature,
    }); 
            
}
};

//Search and Slider bar code
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
	
    //initialize search control
    map.addControl(searchControl);
    
    // Array of easy buttons for areas outside continental US
    var buttons = [
          L.easyButton('<img src="img/noun_Home_Symbol.svg">', function(){
              map.setView([39.5, -97], 4);
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
    
     // Add easy button to return to the table view
    L.easyButton('<img src="img/noun_TableView.svg">', function(){
        $("#panel2").html(old_html);
    },'Show List of Parks',{ position: 'topright' }).addTo(map);
    
    //slider function
    var range = document.getElementById('range');

    //set up slider
    noUiSlider.create(range, {
        start: [ 1872, 2020 ], // Handle start position
        step: 4, // Slider moves in increments of '10'
        //margin: 4, // Used for linear scale
        connect: true, // Display a colored bar between the handles
        direction: 'ltr', // Put '0' at the bottom of the slider
        orientation: 'horizontal', // Orient the slider vertically
        behaviour: 'tap-drag', // Move handle on tap, bar is draggable
        range: { // Slider can select '0' to '100.' Designed for steps by presidential year.
            'min': 1872,
            '3.475': 1877,
            '6.175': 1881,
            '8.875': 1885,
            '11.575': 1889,
            '14.275':1893,
            '16.975': 1897,
            '19.675': 1901,
            '25.075': 1909,
            '27.775': 1913,
            '33.175': 1921,
            '34.525': 1923,
            '38.575': 1929,
            '41.275': 1933,
            '49.375': 1945,
            '54.775': 1953,
            '60.175': 1961,
            '61.525': 1963,
            '65.575': 1969,
            '68.95': 1974,
            '70.975': 1977,
            '73.675': 1981,
            '79.075': 1989,
            '81.775': 1993,
            '87.175': 2001,
            '92.575': 2009,
            '97.975': 2017,       
            'max': 2020,
        },
        snap: true,
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
                    fillOpacity: 0.1
                };
                return styleHidden;

            }else{
                //regular point styling
                return NationalParksStyle;
            }
        }
        
    });
};
