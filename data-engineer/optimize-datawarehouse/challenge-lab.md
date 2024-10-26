Given the fact that there will be models based on a range of time periods, you are instructed to create a new dataset and then create a date partitioned version of the oxford_policy_tracker table in your newly created dataset, with an expiry time set to 720 days.

You have also been instructed to exclude the United Kingdom ( alpha_3_code='GBR'), Brazil ( alpha_3_code='BRA'), Canada ( alpha_3_code='CAN') & the United States of America (alpha_3_code='USA) as these will be subject to more in-depth analysis through nation and state specific analysis.





## Task 1. Create a table partitioned by date
Create a new dataset covid_113 and create a table oxford_policy_tracker_446 in that dataset partitioned by date, with an expiry of 720 days. The table should initially use the schema defined for the oxford_policy_tracker table in the COVID 19 Government Response public dataset .

You must also populate the table with the data from the source table for all countries except the United Kingdom (GBR), Brazil (BRA), Canada (CAN) and the United States (USA).

```sql
CREATE TABLE
  covid_605.oxford_policy_tracker_595 
PARTITION BY
  date
  OPTIONS (
    partition_expiration_days = 720)
    
AS (
  SELECT
    *
  FROM
  `bigquery-public-data.covid19_govt_response.oxford_policy_tracker`
  where alpha_3_code not in ('GBR', 'BRA', 'CAN', 'USA')   
);
```


## Task 2. Add new columns to your table
Update your table to add new columns to your table with the appropriate data types to ensure alignment with the specification provided to you:
New Column Name          SQL Data Type
population               INTEGER
country_area             FLOAT
mobility                 RECORD
mobility.avg_retail      FLOAT
mobility.avg_grocery     FLOAT
mobility.avg_parks       FLOAT
mobility.avg_transit     FLOAT
mobility.avg_workplace   FLOAT
mobility.avg_residential FLOAT

```sql
ALTER TABLE oxford_policy_tracker.<YOUR_TABLE_NAME>
ADD COLUMN population INT64,
ADD COLUMN country_area FLOAT64,
ADD COLUMN mobility STRUCT<
   avg_retail      FLOAT64,
   avg_grocery     FLOAT64,
   avg_parks       FLOAT64,
   avg_transit     FLOAT64,
   avg_workplace   FLOAT64,
   avg_residential FLOAT64
   >
```

Alternative
refer schema.json and apply using below cmd through console

```sh 
bq update qwiklabs-gcp-02-5b812e37dbef:covid_605.oxford_policy_tracker_595 ./schema.json


 bq show \
   --schema \
   --format=prettyjson \
   qwiklabs-gcp-01-091e7ea54189:covid_113.oxford_policy_tracker_446 > ./myschema.json
```


## Task 3. Add country population data to the population column
Add the country population data to the population column in your table with covid_19_geographic_distribution_worldwide table data from the European Center for Disease Control COVID 19 public dataset table.

```sql
UPDATE  covid_605.oxford_policy_tracker_595  T
SET T.country_area = S.country_area
FROM (
  SELECT 
    country_name, 
    max(country_area) as country_area, 
    count(1) as cnt
  FROM `bigquery-public-data.census_bureau_international.country_names_area` 
  group by country_name
) S
WHERE T.country_name = S.country_name
;
```



Task 4. Add country area data to the country_area column
Add the country area data to the country_area column in your table with country_names_area table data from the Census Bureau International public dataset.

```sql
UPDATE  covid_605.oxford_policy_tracker_595  T
SET T.country_area = S.country_area
FROM (
  SELECT 
    country_name, 
    max(country_area) as country_area, 
    count(1) as cnt
  FROM `bigquery-public-data.census_bureau_international.country_names_area` 
  group by country_name
) S
WHERE T.country_name = S.country_name
;
```



## Task 5. Populate the mobility record data
Populate the mobility record in your table with data from the Google COVID 19 Mobility public dataset .

```sql
UPDATE  covid_605.oxford_policy_tracker_595  T
SET T.mobility = ARRAY<STRUCT<
  avg_retail FLOAT64, 
  avg_grocery FLOAT64, 
  avg_parks FLOAT64, 
  avg_transit FLOAT64, 
  avg_workplace FLOAT64, 
  avg_residential FLOAT64
  >>
 [(
  S.avg_retail, 
  S.avg_grocery, 
  S.avg_parks, 
  S.avg_transit, 
  S.avg_workplace, 
  S.avg_residential
)] FROM (
SELECT 
    date, country_region,
    AVG(retail_and_recreation_percent_change_from_baseline) as avg_retail, 
    AVG(grocery_and_pharmacy_percent_change_from_baseline)as avg_grocery,   
    AVG(parks_percent_change_from_baseline) as avg_parks, 
    AVG(transit_stations_percent_change_from_baseline) as avg_transit,
    AVG( workplaces_percent_change_from_baseline ) as avg_workplace,
    AVG( residential_percent_change_from_baseline)  as avg_residential
    FROM `bigquery-public-data.covid19_google_mobility.mobility_report` 
  group by date, country_region
) AS S
WHERE T.country_name = S.country_region
and T.date = S.date
;
```


```sql
SELECT DISTINCT country_name
FROM  covid_605.oxford_policy_tracker_595  T
WHERE population is NULL 

UNION ALL

SELECT DISTINCT country_name
FROM  covid_605.oxford_policy_tracker_595  T
WHERE country_area IS NULL 
ORDER BY country_name ASC
```

```sql
UPDATE
   `covid_605.oxford_policy_tracker_595` t0
SET
   t0.mobility.avg_retail      = t1.avg_retail,
   t0.mobility.avg_grocery     = t1.avg_grocery,
   t0.mobility.avg_parks       = t1.avg_parks,
   t0.mobility.avg_transit     = t1.avg_transit,
   t0.mobility.avg_workplace   = t1.avg_workplace,
   t0.mobility.avg_residential = t1.avg_residential
FROM
   ( SELECT country_region, date,
      AVG(retail_and_recreation_percent_change_from_baseline) as avg_retail,
      AVG(grocery_and_pharmacy_percent_change_from_baseline)  as avg_grocery,
      AVG(parks_percent_change_from_baseline) as avg_parks,
      AVG(transit_stations_percent_change_from_baseline) as avg_transit,
      AVG(workplaces_percent_change_from_baseline) as avg_workplace,
      AVG(residential_percent_change_from_baseline)  as avg_residential
      FROM `bigquery-public-data.covid19_google_mobility.mobility_report`
      GROUP BY country_region, date
   ) AS t1
WHERE
   CONCAT(t0.country_name, t0.date) = CONCAT(t1.country_region, t1.date)
```