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
    

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    createPopup(feature.properties, attribute, layer, options.radius);

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
    var popupContent = "<p><b>Location:</b> " + properties.MCD_NAME + "</p>";

    //add formatted attribute to panel content string
    var year = attribute.split("_")[1];
    
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

    //calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = .008;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
}

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
        
        updatePropSymbols(map, attributes[index]);    

    });

    //Step 5: input listener for slider
    $('.range-slider').on('input', function(){
        //Step 6: get the new index value
        var index = $(this).val();
        
    updatePropSymbols(map, attributes[index]);
        
    });  
    
};

function filterControl (map, attributes, index){
    var WisCities = null
    
    $.getJSON('data/WisMuniType.geojson',function(data){
        var geojsonMarkerOptions = {
                radius: .1,
                fillColor: "#80cdc1",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            };
        // add GeoJSON layer to the map once the file is loaded
            WisCities = L.geoJson(data,{
                pointToLayer: function(feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map);
        });

    $( "#removeButton" ).click(function() {
         WisCities.length = 0;
         map.removeLayer(WisCities);
    });

        
    // Use $( "elementID") and the jQuery click listener method to create a filter
    $( "#Cities" ).click(function() {
        map.removeLayer(WisCities);
        $.getJSON('data/WisMuniType.geojson',function(data){
            var geojsonMarkerOptions = {
                radius: 2,
                fillColor: "#c7eae5",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            
            var popAtt = processData(data)
            var searchAtt = popAtt[index]
            
            
            // add GeoJSON layer to the map once the file is loaded
            WisCities = L.geoJson(data,{
                pointToLayer: function(feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }, filter: function (feature) {
                return feature.properties[searchAtt] == "City";    
                },
                
            }).addTo(map);
        });
        
    });
        
    // Use $( "elementID") and the jQuery click listener method to create a filter
    $( "#Towns" ).click(function() {
        map.removeLayer(WisCities);
        $.getJSON('data/WisMuniType.geojson',function(data){
            var geojsonMarkerOptions = {
                radius: 2,
                fillColor: "#c7eae5",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            
            var popAtt = processData(data)
            var searchAtt = popAtt[index]
            
            // add GeoJSON layer to the map once the file is loaded
            WisCities = L.geoJson(data,{
                pointToLayer: function(feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }, filter: function (feature) {
                    return feature.properties[searchAtt] == "Town";
                }
            }).addTo(map);
        });
        
    });
        
    // Use $( "elementID") and the jQuery click listener method to create a filter
    $( "#Unincorporated" ).click(function() {
        map.removeLayer(WisCities);
        $.getJSON('data/WisMuniType.geojson',function(data){
            var geojsonMarkerOptions = {
                radius: 2,
                fillColor: "#c7eae5",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            
            var popAtt = processData(data)
            var searchAtt = popAtt[index]
            // add GeoJSON layer to the map once the file is loaded
            WisCities = L.geoJson(data,{
                pointToLayer: function(feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }, filter: function (feature) {
                    return feature.properties[searchAtt] == "Non";
                }
            }).addTo(map);
        });
        
    });
}

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
    
    updateLegend(map, attributes[0]);
};

//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};

//Update the legend with new attribute
function updateLegend(map, attribute){
    //create content for legend
    var year = attribute.split("_")[1];
    var content = "Population in " + year;

    //replace legend content
    $('#temporal-legend').html(content);
    
    //get the max, mean, and min values as an object
    var circleValues = getCircleValues(map, attribute);
    
    for (var key in circleValues){
        //get the radius
        var radius = calcPropRadius(circleValues[key]);

        //Step 3: assign the cy and r attributes
        $('#'+key).attr({
            cy: 95 - radius,
            r: radius
        });
        
        //Step 4: add legend text
        $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100);
    };
};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);  
            
            createPopup(props, attribute, layer, radius);
            updateLegend(map, attribute);
        }
                
    });
}


//Above Example 3.8...Step 3: build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Pop") > -1){
            attributes.push(attribute);
        }
    }


    return attributes;
}


//Import GeoJSON data
function getData(map){
    var WisCities = 'data/WisCities.geojson';
    //load the data
    $.ajax(WisCities, {
        dataType: "json",
        success: function(response){
            //create an attributes array
            var attributes = processData(response);
            
            //call function to create proportional symbols
            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
            createLegend(map, attributes);
            filterControl (map, attributes)
            
        }
    });  
}

