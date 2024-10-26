## Preparation
1. Set env variables
```sh
#! /bin/bash

# Create the DEVSHELL_PROJECT_ID on a VM
curl "http://metadata.google.internal/computeMetadata/v1/project/project-id" -H "Metadata-Flavor: Google" > Project_ID
awk '{print "export DEVSHELL_PROJECT_ID=" $0, "\n" "export BUCKET=" $0, "\n" "export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/jre" }' Project_ID > env.txt
source env.txt
echo $DEVSHELL_PROJECT_ID
```

## Launch Dataflow pipeline
1. Verify that Google Cloud Dataflow API is enabled for this project
```sh
gcloud services disable dataflow.googleapis.com --force
gcloud services enable dataflow.googleapis.com
```