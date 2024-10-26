### create dataset using gcloud console
```sh
bq --location=us-west1 mk taxirides
```

### Run this command to create the taxirides.realtime table (empty schema that you will stream into later).
```sh
bq --location=us-west1 mk \
--time_partitioning_field timestamp \
--schema ride_id:string,point_idx:integer,latitude:float,longitude:float,\
timestamp:timestamp,meter_reading:float,meter_increment:float,ride_status:string,\
passenger_count:integer -t taxirides.realtime
```
