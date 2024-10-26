## Lift and shift

###  Configure and start a Cloud Dataproc cluster

### Clone the source repository for the lab
1. To clone the Git repository for the lab enter the following command in Cloud Shell:
```sh
git -C ~ clone https://github.com/GoogleCloudPlatform/training-data-analyst
```

2. To locate the default Cloud Storage bucket used by Cloud Dataproc enter the following command in Cloud Shell:
```sh
export DP_STORAGE="gs://$(gcloud dataproc clusters describe sparktodp --region=us-central1 --format=json | jq -r '.config.configBucket')"
```

3. To copy the sample notebooks into the Jupyter working folder enter the following command in Cloud Shell:
```sh
gcloud storage cp ~/training-data-analyst/quests/sparktobq/*.ipynb $DP_STORAGE/notebooks/jupyter
```

### Log in to the Jupyter Notebook
1. The first code cell fetches the source data file, which is an extract from the KDD Cup competition from the Knowledge, Discovery, and Data (KDD) conference in 1999. The data relates to computer intrusion detection events.

```sh
!wget https://storage.googleapis.com/cloud-training/dataengineering/lab_assets/sparklab/kddcup.data_10_percent.gz
```

2. In the second code cell, the source data is copied to the default (local) Hadoop file system.
```sh
!hadoop fs -put kddcup* /
```

### Reading in data
1. In this cell Spark SQL is initialized and Spark is used to read in the source data as text and then returns the first 5 rows.

```py3
from pyspark.sql import SparkSession, SQLContext, Row
spark = SparkSession.builder.appName("kdd").getOrCreate()
sc = spark.sparkContext
data_file = "hdfs:///kddcup.data_10_percent.gz"
raw_rdd = sc.textFile(data_file).cache()
raw_rdd.take(5)
```

2. In cell In [5] each row is split, using , as a delimiter and parsed using a prepared inline schema in the code.
```py3
csv_rdd = raw_rdd.map(lambda row: row.split(","))
parsed_rdd = csv_rdd.map(lambda r: Row(
    duration=int(r[0]),
    protocol_type=r[1],
    service=r[2],
    flag=r[3],
    src_bytes=int(r[4]),
    dst_bytes=int(r[5]),
    wrong_fragment=int(r[7]),
    urgent=int(r[8]),
    hot=int(r[9]),
    num_failed_logins=int(r[10]),
    num_compromised=int(r[12]),
    su_attempted=r[14],
    num_root=int(r[15]),
    num_file_creations=int(r[16]),
    label=r[-1]
    )
)
parsed_rdd.take(5)
```

### Spark analysis
1. Row data can be selected and displayed using the dataframe's .show() method to output a view summarizing a count of selected fields:
```py3
sqlContext = SQLContext(sc)
df = sqlContext.createDataFrame(parsed_rdd)
connections_by_protocol = df.groupBy('protocol_type').count().orderBy('count', ascending=False)
connections_by_protocol.show()
```

2. In cell In [7] a temporary table (connections) is registered that is then referenced inside the subsequent SparkSQL SQL query statement:
```py3
df.registerTempTable("connections")
attack_stats = sqlContext.sql("""
    SELECT
      protocol_type,
      CASE label
        WHEN 'normal.' THEN 'no attack'
        ELSE 'attack'
      END AS state,
      COUNT(*) as total_freq,
      ROUND(AVG(src_bytes), 2) as mean_src_bytes,
      ROUND(AVG(dst_bytes), 2) as mean_dst_bytes,
      ROUND(AVG(duration), 2) as mean_duration,
      SUM(num_failed_logins) as total_failed_logins,
      SUM(num_compromised) as total_compromised,
      SUM(num_file_creations) as total_file_creations,
      SUM(su_attempted) as total_root_attempts,
      SUM(num_root) as total_root_acceses
    FROM connections
    GROUP BY protocol_type, state
    ORDER BY 3 DESC
    """)
attack_stats.show()
```

3. The last cell, In [8] uses the %matplotlib inline Jupyter magic function to redirect matplotlib to render a graphic figure inline in the notebook instead of just dumping the data into a variable. This cell displays a bar chart using the attack_stats query from the previous step.
```py3
%matplotlib inline
ax = attack_stats.toPandas().plot.bar(x='protocol_type', subplots=True, figsize=(10,25))
```
