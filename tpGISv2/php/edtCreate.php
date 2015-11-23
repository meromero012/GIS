<?php

$lat = $_POST['lat'];
$lng = $_POST['lng'];
$lng = $_POST['prov'];
$lng = $_POST['loc'];
$lng = $_POST['alt'];
//$lng = $_POST['sit'];

$conbd = pg_connect("host=localhost port=5432 dbname=PracticoGIS user=postgres password=postgres") or die(pg_last_error());  
$sql = "INSERT INTO edt (id, provincia, localidad, latitud, longitud, altura_snm, sitio, geom)
VALUES
((SELECT max(id) FROM edt) +1, /*id*/
 $1, /*provincia*/
 $2, /*localidad*/
 $3, /*latitud*/
 $4, /*longitud*/
 $5, /*altura_snm*/
 $2, /*sitio*/
 ST_Point($4,$3) /*geom*/);";
$res = pg_query_params($conbd, $sql, array($prov, $loc, $lat, $lng, $alt));

$affRows = pg_affected_rows($res);

pg_close($conbd);

echo $affRows;

?>