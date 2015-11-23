var map;
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

 showEDTs(getEdtFeatureCollection());
 placeMarker(myCenter);

 google.maps.event.addListener(map, 'click', function(event) {
  placeMarker(event.latLng);
  updateLatLng(event.latLng)
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
