# coordinate-transform

## Install

`yarn install`

## Run the server

`yarn start`

## Sample requests:

### Transform the coordinates of 2 Metrotech Center from EPSG:2263 to EPSG:4326
http://localhost:3000/proj4/EPSG:2263/EPSG:4326/988217/192020
http://localhost:3000/postgis/EPSG:2263/EPSG:4326/988217/192020

### Transform the coordinates of 2 Metrotech Center from EPSG:4326 to EPSG:3857
http://localhost:3000/proj4/EPSG:4326/EPSG:3857/-73.9856945509795/40.69372638702077
http://localhost:3000/postgis/EPSG:4326/EPSG:3857/-73.9856945509795/40.69372638702077

## Use of the postgis endpoint requires an environment variable for a connection string to a running instance of PostGIS

`POSTGIS_URI="postgresql://user:password@localhost:5432/dbname"`