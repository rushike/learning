# ETL Processing on Google Cloud Using Dataflow and BigQuery

 ## Ensure that the Dataflow API is successfully enabled
 enabel and disable

 ## Create Cloud Storage Bucket
 ```sh
 gsutil mb -c regional -l us-west3  gs://$PROJECT
 ```

 ## Copy files to your bucket
 ```sh
 gsutil cp gs://spls/gsp290/data_files/usa_names.csv gs://$PROJECT/data_files/
gsutil cp gs://spls/gsp290/data_files/head_usa_names.csv gs://$PROJECT/data_files/
 ```

 ## Create the BigQuery dataset
```sh
bq mk lake
```

## Run the Apache Beam pipeline

### Ingestion
- Ingest the files from Cloud Storage.
- Filter out the header row in the files.
- Convert the lines read to dictionary objects.
- Output the rows to BigQuery.

1. Create docker container with volume as source code . 

```sh
docker run -it -e PROJECT=$PROJECT -v $(pwd)/dataflow-python-examples:/dataflow python:3.7 /bin/bash
```

2. Once the container finishes pulling, run the following to install apache-beam:
```sh
pip install apache-beam[gcp]==2.24.0
```

3. Next, change directories into where you linked the source code:
```sh
cd dataflow/
```

4. The following will spin up the workers required, and shut them down when complete:
```sh
python dataflow_python_examples/data_ingestion.py \
  --project=$PROJECT --region=us-west3 \
  --runner=DataflowRunner \
  --staging_location=gs://$PROJECT/test \
  --temp_location gs://$PROJECT/test \
  --input gs://$PROJECT/data_files/head_usa_names.csv \
  --save_main_session
```


### Transformation
- Ingest the files from Cloud Storage.
- Convert the lines read to dictionary objects.
- Transform the data which contains the year to a format BigQuery understands as a date.
- Output the rows to BigQuery.
1. Run transformation
```sh
python dataflow_python_examples/data_transformation.py \
  --project=$PROJECT \
  --region=us-west3 \
  --runner=DataflowRunner \
  --staging_location=gs://$PROJECT/test \
  --temp_location gs://$PROJECT/test \
  --input gs://$PROJECT/data_files/head_usa_names.csv \
  --save_main_session
```

### Enrichment
- Ingest the files from Cloud Storage.
- Filter out the header row in the files.
- Convert the lines read to dictionary objects.
- Output the rows to BigQuery.

```sh
python dataflow_python_examples/data_enrichment.py \
  --project=$PROJECT \
  --region=us-west3 \
  --runner=DataflowRunner \
  --staging_location=gs://$PROJECT/test \
  --temp_location gs://$PROJECT/test \
  --input gs://$PROJECT/data_files/head_usa_names.csv \
  --save_main_session
```

##  Data lake to Mart
- Ingest files from 2 BigQuery sources.
- Join the 2 data sources.
- Filter out the header row in the files.
- Convert the lines read to dictionary objects.
- Output the rows to BigQuery.

```sh
python dataflow_python_examples/data_lake_to_mart.py \
  --worker_disk_type="compute.googleapis.com/projects//zones//diskTypes/pd-ssd" \
  --max_num_workers=4 \
  --project=$PROJECT \
  --runner=DataflowRunner \
  --staging_location=gs://$PROJECT/test \
  --temp_location gs://$PROJECT/test \
  --save_main_session \
  --region=us-west3
```