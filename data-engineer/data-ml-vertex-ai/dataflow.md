## Install pip and the Cloud Dataflow SDK
1. The latest Cloud Dataflow SDK for Python requires a Python version >= 3.7.
To ensure you are running the process with the correct version, run the Python3.9 Docker Image:

```sh
docker run -it -e DEVSHELL_PROJECT_ID=$DEVSHELL_PROJECT_ID python:3.9 /bin/bash
```
This command pulls a Docker container with the latest stable version of Python 3.9 and then opens up a command shell for you to run the following commands inside your container.

2. After the container is running, install the latest version of the Apache Beam for Python by running the following command from a virtual environment
```sh
```

3. Run the wordcount.py example locally by running the following command:
```sh
python -m apache_beam.examples.wordcount --output OUTPUT_FILE
```

## Run an example pipeline remotely
1. Set the BUCKET environment variable to the bucket you created earlier:
```sh
BUCKET=gs://qwiklabs-gcp-03-97307ef6a57b-bucket
```

2. Now you'll run the wordcount.py example remotely:
```sh
python -m apache_beam.examples.wordcount --project $DEVSHELL_PROJECT_ID \
  --runner DataflowRunner \
  --staging_location $BUCKET/staging \
  --temp_location $BUCKET/temp \
  --output $BUCKET/results/output \
  --region us-east4
```