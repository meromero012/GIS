var map;
var geocoder;
var markers=[];
var nearestEdtMarkers=[];

function initialize()
{
 var myCenter=new google.maps.LatLng(-39.9771201, -65.47851562);

 var mapProp = {
  center:myCenter,
  zoom:4,
  mapTypeId:google.maps.MapTypeId.ROADMAP
 };

 map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
 geocoder = new google.maps.Geocoder();

 showEDTs(getEdtFeatureCollection());
 placeMarker(myCenter);

 google.maps.event.addListener(map, 'click', function(event) {
  placeMarker(event.latLng);
  updateLatLng(event.latLng);
  geocodeLatLng(event.latLng)
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

function updateLatLng(latLng){
  document.getElementById("latbox").value=latLng.lat().toFixed(6);
  document.getElementById("lngbox").value=latLng.lng().toFixed(6);
}

function getEdtFeatureCollection() {
 var jqXHR = $.ajax({url: "php/edtFeatureCollection.php", async: false});

 return jqXHR.responseText;
}

function showEDTs(geojsonList){
 map.data.addGeoJson(JSON.parse(geojsonList), 'edtLayer');
 var antennaIcon = new google.maps.MarkerImage('img/edtAntenna.png');
 map.data.setStyle({
   icon:antennaIcon
 });
}

google.maps.event.addDomListener(window, 'load', initialize);

function proximitySearch(){
 var jqXHR = $.ajax({type: 'POST', url: 'php/proximitySearch.php',data: {'lat': document.getElementById("latbox").value, 'lng': document.getElementById("lngbox").value}, async: false});

 return jqXHR.responseText;
}


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

function clearGeocodeValues() {
 document.getElementById("newEdtLatBox").value = "";
 document.getElementById("newEdtLngBox").value = "";
 document.getElementById("newEdtProvBox").value = "";
 document.getElementById("newEdtLocBox").value = "";
 document.getElementById("newEdtSitBox").value = "";
}

function geocodeLatLng(latLng) {
 clearGeocodeValues();

 document.getElementById("newEdtLatBox").value = latLng.lat().toFixed(6);
 document.getElementById("newEdtLngBox").value = latLng.lng().toFixed(6);

 var latlng = {lat: parseFloat(latLng.lat().toFixed(6)), lng: parseFloat(latLng.lng().toFixed(6))};
 var prov;

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
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}
