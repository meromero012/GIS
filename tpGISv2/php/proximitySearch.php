<?php

$lat = $_POST['lat'];
$lng = $_POST['lng'];

$conbd = pg_connect("host=localhost port=5432 dbname=PracticoGIS user=postgres password=postgres") or die(pg_last_error());  
$sql = "SELECT row_to_json(p)
FROM
(SELECT trunc(latitud, 6) as latitud, trunc(longitud, 6) as longitud, provincia, localidad, sitio
FROM edt
ORDER BY ST_DISTANCE(ST_POINT($1, $2), ST_POINT(longitud, latitud)) ASC
LIMIT 1) p";
$res = pg_query_params($conbd, $sql, array($lng, $lat));

$edtData = pg_fetch_result($res, 0, 0);

pg_close($conbd);

echo $edtData;

?>
