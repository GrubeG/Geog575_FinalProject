//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];
    
    //create marker options
    var options = {
        fillColor: "#01665e",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);
    
    //create circle marker layer
    var layer = L.polygon(latlng, options);

    createPopup(feature.properties, attribute, layer);

    //event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
}

function createPopup(properties, attribute, layer, radius){
    //add city to popup content string
    var popupContent = "<p><b>Location:</b> " + properties.UNIT_NAME + "</p>";

    //add formatted attribute to panel content string
    var year = properties.YEAR;
    
    if (properties[attribute] >1) {
        var popDisplay = properties[attribute];
        } else {
        var popDisplay = "Unincorporated";
        }
    
    popupContent += "<p><b>Population in " + year + ":</b> " + popDisplay;

    //replace the layer popup
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-radius)
    });
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
    
    
    
}

//Step 1: Create new sequence controls
function createSequenceControls(map, attributes){
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            //create range input element (slider)
            $(container).append('<input class="range-slider" type="range">');
            
            //add skip buttons
            $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
            $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');
            
            //kill any mouse event listeners on the map
            $(container).on('mousewheel dblclick', function(e){
                L.DomEvent.stopPropagation(e);
                });
            
            $(container).mousedown(function () {
                map.dragging.disable();
            });
            $(document).mouseup(function () {
                map.dragging.enable();
            });

            return container;
        }
    });

    map.addControl(new SequenceControl());   
    
    
    //set slider attributes
    $('.range-slider').attr({
        max: 8,
        min: 0,
        value: 0,
        step: 1
    });
    
    //below Example 3.4...add skip buttons
    
    
    //Below Example 3.5...replace button content with images
    $('#reverse').html('<img src="img/reverse.png">');
    $('#forward').html('<img src="img/forward.png">');
    
    
    
    //Below Example 3.6 in createSequenceControls()
    //Step 5: click listener for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 8 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 8 : index;
        }

        filterControl (map, attributes, index)
        
        //Step 8: update slider
        $('.range-slider').val(index);
            

    });

    //Step 5: input listener for slider
    $('.range-slider').on('input', function(){
        //Step 6: get the new index value
        var index = $(this).val();
        
        
    });  
    
};



function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">')

            //Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="100px">';
            
            //array of circle names to base loop on
            var circles = {
                max: 20,
                mean: 55,
                min: 90
            };

            //Step 2: loop to add each circle and text to svg string
            for (var circle in circles){
            //circle string
            svg += '<circle class="legend-circle" id="' + circle + 
            '" fill="#01665e" fill-opacity="0.8" stroke="#000000" cx="45"/>';
            
            //text string
            svg += '<text id="' + circle + '-text" x="95" y="' + circles[circle] + '"></text>';
            };

            //close svg string
            svg += "</svg>";

            //add attribute legend svg to container
            $(container).append(svg);

            return container;
        }
    });

    map.addControl(new LegendControl());
    
};


//Above Example 3.8...Step 3: build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;


    return attributes;
}


//Import GeoJSON data
function getData(map){
    var NationalParks = 'data/NationalParks.geojson';
    //load the data
    $.ajax(NationalParks, {
        dataType: "json",
        success: function(response){
            //create an attributes array
            var attributes = processData(response);
            
            //call function to create proportional symbols
            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
            createLegend(map, attributes);
           
            
        }
    });  
}

