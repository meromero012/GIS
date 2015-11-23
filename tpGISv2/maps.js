/*GLOBAL VARIABLES*/
var map;
var geocoder;
var elevator;
var markers=[];
var nearestEdtMarkers=[];

/*MAPS*/
function initialize()
{
 resetContents();

 var myCenter=new google.maps.LatLng(-39.9771201, -65.47851562);

 var mapProp = {
  center:myCenter,
  zoom:4,
  mapTypeId:google.maps.MapTypeId.ROADMAP
 };

 map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
 geocoder = new google.maps.Geocoder();
 elevator = new google.maps.ElevationService();

 showEDTs(getEdtFeatureCollection());
 placeMarker(myCenter);

 google.maps.event.addListener(map, 'click', function(event) {
  placeMarker(event.latLng);
  updateLatLng(event.latLng);
  geocodeLatLng(event.latLng);
  getElevation(event.latLng)
 });
}

function placeMarker(eventPosition) {
 if (markers.length == 1) {
  markers[0].setPosition(eventPosition);
 }
 else if (markers.length < 1) {
  var marker = new google.maps.Marker({
   position: eventPosition,
   map: map,
   draggable: false
  });

  markers.push(marker);
 }
}

function showEDTs(geojsonList){
 map.data.addGeoJson(JSON.parse(geojsonList), 'edtLayer');
 var antennaIcon = new google.maps.MarkerImage('img/edtAntenna.png');
 map.data.setStyle({
   icon:antennaIcon
 });
}

google.maps.event.addDomListener(window, 'load', initialize);

function setNearestEDTMarker(lat, lng) {
 var pos=new google.maps.LatLng(lat, lng);

 if (nearestEdtMarkers.length == 1) {
  nearestEdtMarkers[0].setPosition(pos);
 }
 else if (nearestEdtMarkers.length < 1) {
  var marker = new google.maps.Marker({
   position: pos,
   map: map,
   icon:'img/NearesEdtAntenna.png',
   draggable: false
  });

  nearestEdtMarkers.push(marker);
 }
}

function geocodeLatLng(latLng) {
 clearGeocodeValues();

 var latlng = {lat: parseFloat(latLng.lat().toFixed(6)), lng: parseFloat(latLng.lng().toFixed(6))};

 geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        for(i=0; i<results[0].address_components.length; i++) {
         if (results[0].address_components[i].types[0]=="administrative_area_level_1") {
          document.getElementById("newEdtProvBox").value = results[0].address_components[i].long_name;
         } else if (results[0].address_components[i].types[0]=="locality") {
          document.getElementById("newEdtLocBox").value = results[0].address_components[i].long_name;
          document.getElementById("newEdtSitBox").value = results[0].address_components[i].long_name;
         }
        }
//Si la ubicacion no posee localidad se le asigna la provincia.
       if (document.getElementById("newEdtLocBox").value=="") {
         document.getElementById("newEdtLocBox").value = document.getElementById("newEdtProvBox").value;
         document.getElementById("newEdtSitBox").value = document.getElementById("newEdtProvBox").value;
       }
       document.getElementById("newEdtLatBox").value = latLng.lat().toFixed(6);
       document.getElementById("newEdtLngBox").value = latLng.lng().toFixed(6);
      } else {
        window.alert('No se encontraron resultados para el alta de antenas EDT');
      }
    } else {
      window.alert('Geocoder fallo debido a: ' + status);
    }
  });
}

function getElevation(latLng) {
 clearElevationValue();

 var positionalRequest = {'locations': [latLng]};

 elevator.getElevationForLocations(positionalRequest, function(results, status) {
  if (status == google.maps.ElevationStatus.OK) {
   if (results[0]) {
//Verifico que se posicione sobre una ubicacion valida (no sobre el mar)
    if (document.getElementById("newEdtLocBox").value!="") {
     document.getElementById("newEdtEleBox").value = results[0].elevation.toFixed(6);
    }
   }
  }
 });
}

/*REQUESTS*/
function getEdtFeatureCollection() {
 var jqXHR = $.ajax({url: "php/edtFeatureCollection.php", async: false});

 return jqXHR.responseText;
}

function proximitySearch(){
 var jqXHR = $.ajax({type: 'POST', url: 'php/proximitySearch.php',data: {'lat': document.getElementById("latbox").value, 'lng': document.getElementById("lngbox").value}, async: false});

 return jqXHR.responseText;
}

function edtCreate(){
 var ele = 0;
 if (document.getElementById("newEdtEleBox").value != "") {
  ele = document.getElementById("newEdtEleBox").value;
 }
 
 var jqXHR = $.ajax({type: 'POST', url: 'php/edtCreate.php',
                     data: {'lat': document.getElementById("newEdtLatBox").value,
                            'lng': document.getElementById("newEdtLngBox").value,
                            'prov': document.getElementById("newEdtProvBox").value,
                            'loc': document.getElementById("newEdtLocBox").value,
                            'ele': ele,
                            'sit': document.getElementById("newEdtSitBox").value},
                    async: false});

 return jqXHR.responseText;
}

/*HTML PAGE CONTROL*/
function updateLatLng(latLng){
  document.getElementById("latbox").value=latLng.lat().toFixed(6);
  document.getElementById("lngbox").value=latLng.lng().toFixed(6);
}

function clearElevationValue() {
 document.getElementById("newEdtEleBox").value = "";
}

function clearGeocodeValues() {
 document.getElementById("newEdtLatBox").value = "";
 document.getElementById("newEdtLngBox").value = "";
 document.getElementById("newEdtProvBox").value = "";
 document.getElementById("newEdtLocBox").value = "";
 document.getElementById("newEdtSitBox").value = "";
}

function clearNearestEdtData() {
 document.getElementById("nearestEdtLatBox").value = "";
 document.getElementById("nearestEdtLngBox").value = "";
 document.getElementById("nearestEdtProvBox").value = "";
 document.getElementById("nearestEdtLocBox").value = "";
 document.getElementById("nearestEdtSitBox").value = "";
}

function resetLatLng(latLng){
  document.getElementById("latbox").value=-39.9771201;
  document.getElementById("lngbox").value=-65.47851562;
}

function resetContents() {
 clearNearestEdtData();
 clearElevationValue();
 clearGeocodeValues();
}

function validateData() {
 return (document.getElementById("newEdtLatBox").value != "" &&
 document.getElementById("newEdtLngBox").value != "" &&
 document.getElementById("newEdtProvBox").value != "" &&
 document.getElementById("newEdtLocBox").value != "" &&
 document.getElementById("newEdtSitBox").value != "");
}

function showDiv(divID) {
 document.getElementById(divID).style.display = "block";
}

function search(){
 edtJSON = JSON.parse(proximitySearch());
 document.getElementById("nearestEdtLatBox").value = edtJSON['latitud'];
 document.getElementById("nearestEdtLngBox").value = edtJSON['longitud'];
 document.getElementById("nearestEdtProvBox").value = edtJSON['provincia'];
 document.getElementById("nearestEdtLocBox").value = edtJSON['localidad'];
 document.getElementById("nearestEdtSitBox").value = edtJSON['sitio'];
 showDiv('results');
 setNearestEDTMarker(edtJSON['latitud'], edtJSON['longitud']);
}

function create() {
 var status;

 if(validateData()) {
  status = edtCreate();
  if(status != 0) {
   alert("La antena EDT fue dada de alta exitosamente.");
   location.reload();
  } else {
   alert("Hubo un problema y el alta no pudo realizarse.");
  }
 } else {
  alert("Verifique que la ubicacion a dar de alta sea valida.");
 }
}
