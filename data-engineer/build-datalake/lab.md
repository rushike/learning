
## Preparing your environment
```sh
export PROJECT_ID=$(gcloud info --format='value(config.project)')
export BUCKET=${PROJECT_ID}-ml
```


## Create a Cloud SQL instance

1. Enter the following commands to create a Cloud SQL instance:
```sh
gcloud sql instances create taxi \
    --tier=db-n1-standard-1 --activation-policy=ALWAYS
```

2. Set a root password for the Cloud SQL instance:
```sh
gcloud sql users set-password root --host % --instance taxi \
 --password Passw0rd
```

3. Now create an environment variable with the IP address of the Cloud Shell:
```sh
export ADDRESS=$(wget -qO - http://ipecho.net/plain)/32
```


4. Whitelist the Cloud Shell instance for management access to your SQL instance
```sql
gcloud sql instances patch taxi --authorized-networks $ADDRESS
```

5. Get the IP address of your Cloud SQL instance by running:
```sh
MYSQLIP=$(gcloud sql instances describe \
taxi --format="value(ipAddresses.ipAddress)")
```

5. Paste the following content into the command line to create the schema for the trips table
```sql
create database if not exists bts;
use bts;
drop table if exists trips;
create table trips (
  vendor_id VARCHAR(16),		
  pickup_datetime DATETIME,
  dropoff_datetime DATETIME,
  passenger_count INT,
  trip_distance FLOAT,
  rate_code VARCHAR(16),
  store_and_fwd_flag VARCHAR(16),
  payment_type VARCHAR(16),
  fare_amount FLOAT,
  extra FLOAT,
  mta_tax FLOAT,
  tip_amount FLOAT,
  tolls_amount FLOAT,
  imp_surcharge FLOAT,
  total_amount FLOAT,
  pickup_location_id VARCHAR(16),
  dropoff_location_id VARCHAR(16)
);
```


## Add data to Cloud SQL instance

1. Connect to the mysql interactive console to load local infile data:

```sh
mysql --host=$MYSQLIP --user=root  --password  --local-infile
# Passw0rd
```

2. Load the local CSV file data using local-infile:
```sql
LOAD DATA LOCAL INFILE 'trips.csv-1' INTO TABLE trips
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(vendor_id,pickup_datetime,dropoff_datetime,passenger_count,trip_distance,rate_code,store_and_fwd_flag,payment_type,fare_amount,extra,mta_tax,tip_amount,tolls_amount,imp_surcharge,total_amount,pickup_location_id,dropoff_location_id);
```


```sql
LOAD DATA LOCAL INFILE 'trips.csv-2' INTO TABLE trips
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(vendor_id,pickup_datetime,dropoff_datetime,passenger_count,trip_distance,rate_code,store_and_fwd_flag,payment_type,fare_amount,extra,mta_tax,tip_amount,tolls_amount,imp_surcharge,total_amount,pickup_location_id,dropoff_location_id);
```