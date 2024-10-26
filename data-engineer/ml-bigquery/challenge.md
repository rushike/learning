## Select * queries
```sql
SELECT 
  EXTRACT(ISOYEAR FROM start_time) trip_year, 
  start_station_name, 
  EXTRACT(HOUR FROM start_time) hour_of_day,
  FORMAT_DATE('%A', start_time) AS weekday,
  station.address as location,
  duration_minutes as label
  FROM `bigquery-public-data.austin_bikeshare.bikeshare_trips` trips
  join `bigquery-public-data.austin_bikeshare.bikeshare_stations` station
  on trips.start_station_id = station.station_id
where EXTRACT(ISOYEAR FROM start_time) = 2016
limit 100
;
```

## Create Model
Create the first machine learning model to predict the trip duration for bike trips.
The features of this model must incorporate the starting station name, the hour the trip started, the weekday of the trip, and the address of the start station labeled as location. You must use 2016 data only to train this model.

```sql
CREATE OR REPLACE MODEL `data.basic`
OPTIONS(model_type='linear_reg') AS
SELECT 
  EXTRACT(ISOYEAR FROM start_time) trip_year, 
  start_station_name, 
  EXTRACT(HOUR FROM start_time) hour_of_day,
  FORMAT_DATE('%A', start_time) AS weekday,
  station.address as location,
  duration_minutes as label
  FROM `bigquery-public-data.austin_bikeshare.bikeshare_trips` trips
  join `bigquery-public-data.austin_bikeshare.bikeshare_stations` station
  on trips.start_station_id = station.station_id
where EXTRACT(ISOYEAR FROM start_time) = 2016
limit 100
;
```

### Create second model 
Create the second machine learning model to predict the trip duration for bike trips.
The features of this model must incorporate the starting station name, the bike share subscriber type and the start time for the trip. You must also use 2016 data only to train this model.
```sql
CREATE OR REPLACE MODEL `data.basic2`
OPTIONS(model_type='linear_reg') AS
SELECT 
  start_station_name, 
  subscriber_type,
  start_time,
  duration_minutes as label
  FROM `bigquery-public-data.austin_bikeshare.bikeshare_trips` trips
  join `bigquery-public-data.austin_bikeshare.bikeshare_stations` station
  on trips.start_station_id = station.station_id
where EXTRACT(ISOYEAR FROM start_time) = 2016
;
```

PREDICT 
```sql
SELECT AVG(predicted_duration_minutes) AS average_predicted_trip_length

FROM ML.predict(MODEL data.subscriber_model, (

SELECT

    start_station_name,

    EXTRACT(HOUR FROM start_time) AS start_hour,

    subscriber_type,

    duration_minutes

FROM

  `bigquery-public-data.austin_bikeshare.bikeshare_trips`

WHERE 

  EXTRACT(YEAR FROM start_time) = 2018

  AND subscriber_type = 'Single Trip'

  AND start_station_name = '21st & Speedway @PCL'))
```