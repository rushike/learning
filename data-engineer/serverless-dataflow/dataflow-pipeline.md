## Ensure that the Dataflow API is successfully enabled
```sh
gcloud services disable dataflow.googleapis.com --force
gcloud services enable dataflow.googleapis.com
```

## Preparation
1. Download code repository
```sh
git clone https://github.com/GoogleCloudPlatform/training-data-analyst
```

2. Export the bucket name
```sh
BUCKET="qwiklabs-gcp-02-dfb7003b839f"
echo $BUCKET
```