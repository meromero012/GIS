<?php

$conbd = pg_connect("host=localhost port=5432 dbname=PracticoGIS user=postgres password=postgres") or die(pg_last_error());  
$sql = "SELECT row_to_json(fc)
 FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
 FROM (SELECT 'Feature' As type
    , ST_AsGeoJSON(lg.geom)::json As geometry
    , row_to_json((SELECT l FROM (SELECT gid, provincia, localidad, sitio) As l
      )) As properties
   FROM edt As lg   ) As f )  As fc;";
$res = pg_query($conbd, $sql);

$edtLocations = pg_fetch_result($res, 0, 0);

pg_close($conbd);

echo $edtLocations;
?>
