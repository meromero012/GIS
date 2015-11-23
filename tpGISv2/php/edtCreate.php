<?php

$lat = $_POST['lat'];
$lng = $_POST['lng'];
$prov = $_POST['prov'];
$loc = $_POST['loc'];
$ele = $_POST['ele'];
$sit = $_POST['sit'];

$conbd = pg_connect("host=localhost port=5432 dbname=PracticoGIS user=postgres password=postgres") or die(pg_last_error());  
$res = pg_prepare($conbd, "insertEdt", 'INSERT INTO edt (id, provincia, localidad, latitud, longitud, altura_snm, sitio, geom)
VALUES
((SELECT max(id) FROM edt) +1,
 $1,
 $2,
 CAST($3 AS NUMERIC),
 CAST($4 AS NUMERIC),
 CAST($5 AS NUMERIC),
 $6,
 ST_SetSRID(ST_MakePoint(CAST($7 AS NUMERIC),CAST($8 AS NUMERIC)), 4326));');
$res = pg_execute($conbd, "insertEdt", array($prov, $loc, $lat, $lng, $ele, $sit, $lng, $lat));

$affRows = pg_affected_rows($res);

pg_close($conbd);

echo $affRows;

?>
