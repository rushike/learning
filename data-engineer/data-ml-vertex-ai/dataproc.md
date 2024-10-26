## Create a cluster
1. In Cloud Shell, run the following command to set the Region:
```sh
gcloud config set dataproc/region us-east1
```
2. Run the following command to create a cluster called example-cluster with default Cloud Dataproc settings:
```sh
gcloud dataproc clusters create example-cluster --worker-boot-disk-size 500
```

## Submit a job
1. Run this command to submit a sample Spark job that calculates a rough value for pi:
```sh
gcloud dataproc jobs submit spark --cluster example-cluster \
  --class org.apache.spark.examples.SparkPi \
  --jars file:///usr/lib/spark/examples/jars/spark-examples.jar -- 1000
```

## Update a cluster
1. To change the number of workers in the cluster to four, run the following command:
```sh
gcloud dataproc clusters update example-cluster --num-workers 4
```

2. You can use the same command to decrease the number of worker nodes:
```sh
gcloud dataproc clusters update example-cluster --num-workers 2
```