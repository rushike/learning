## Creating a Cloud Data Fusion instance
https://cloud.google.com/data-fusion/docs/how-to/create-instance

## Loading the data
1. In this example, Cloud Data Fusion will read data out of a storage bucket. In the cloud shell console execute the following commands to create a new bucket and copy the relevant data into it:
```sh
export BUCKET=$GOOGLE_CLOUD_PROJECT
gcloud storage buckets create gs://$BUCKET
gcloud storage cp gs://cloud-training/OCBL017/ny-taxi-2018-sample.csv gs://$BUCKET
```

2. In the command line, execute the following command to create a bucket for temporary storage items that Cloud data Fusion will create:
```sh
gcloud storage buckets create gs://$BUCKET-temp
```

## Cleaning the data
Click the Down arrow next to the trip_distance column, select Change data type and then click on Float. Repeat for the total_amount column.

Click the Down arrow next to the pickup_location_id column, select Change data type and then click on String.

If you look at the data closely, you may find some anomalies, such as negative trip distances. You can avoid those negative values by filtering out in Wrangler. Click the Down arrow next to the trip_distance column and select Filter. Click if Custom condition and input >0.0


 ## Creating the pipeline

Basic data cleansing is now complete and you've run transformations on a subset of your data. You can now create a batch pipeline to run transformations on all your data.

Cloud Data Fusion translates your visually built pipeline into an Apache Spark or MapReduce program that executes transformations on an ephemeral Cloud Dataproc cluster in parallel. This enables you to easily execute complex transformations over vast quantities of data in a scalable, reliable manner, without having to wrestle with infrastructure and technology.

On the upper-right side of the Google Cloud Fusion UI, click Create a Pipeline.

In the dialog that appears, select Batch pipeline.

In the Data Pipelines UI, you will see a GCSFile source node connected to a Wrangler node. The Wrangler node contains all the transformations you applied in the Wrangler view captured as directive grammar. Hover over the Wrangler node and select Properties.

Wrangler node.

At this stage, you can apply more transformations by clicking the Wrangle button. Delete the extra column by pressing the red trashcan icon beside its name. Click Validate on the top right corner to check for any errors. To close the Wrangler tool click the X button in the top right corner.

