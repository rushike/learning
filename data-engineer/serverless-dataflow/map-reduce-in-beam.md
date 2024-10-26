## MapReduce in Beam
1. Clone the training github repository
```sh
git clone https://github.com/GoogleCloudPlatform/training-data-analyst
```

## Identify map and reduce operations
Return to the training-vm SSH terminal and navigate to the directory **/training-data-analyst/courses/data_analysis/lab2/python** and view the file is_popular.py with Nano. Do not make any changes to the code. Press Ctrl+X to exit Nano.

## Execute the pipeline
1. In the training-vm SSH terminal, run the pipeline locally:
```sh
python3 ./is_popular.py
```

2. Identify the output file. It should be output<suffix> and could be a sharded file:
```sh
ls -al /tmp
```

3. Examine the output file, replacing '-*' with the appropriate suffix:
```sh
cat /tmp/output-*
```

## Use command line parameters
```sh
python3 ./is_popular.py --output_prefix=/tmp/myoutput
```

## Lab 2
BUCKET="qwiklabs-gcp-00-f6ddea493de6"
echo $BUCKET

PROJECT="qwiklabs-gcp-00-f6ddea493de6"
echo $PROJECT

Run Below Pipeline
```sh
python3 JavaProjectsThatNeedHelp.py --bucket $BUCKET --project $PROJECT --DirectRunner
```