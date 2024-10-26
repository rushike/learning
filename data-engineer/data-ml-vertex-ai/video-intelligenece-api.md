## Enable the Video Intelligence API
Enable the API.

## Enable the Video Intelligence API
1. In Cloud Shell, run the following command to create a new service account named quickstart:
```sh
gcloud iam service-accounts create quickstart
```
2. Create a service account key file, replacing <your-project-123> with your Project ID:
```sh
gcloud iam service-accounts keys create key.json --iam-account quickstart@qwiklabs-gcp-02-d7583962f2d6.iam.gserviceaccount.com
```

3. Now authenticate your service account, passing the location of your service account key file:
```sh
gcloud auth activate-service-account --key-file key.json
```

4. Obtain an authorization token using your service account:
```sh
gcloud auth print-access-token
```

```cmd
ya29.c.b0Aaekm1JTCUT8KcXkz3_SicbwfBV1C1AZs-rQzgs8vZq2blD2V5iwRuUHBohozBEDGFG9aXyPbg1ESLYWlg8KDoUY3wrSnpibE9WkbibgU6_yCnDidnVbJmbbmeYw2disczEh0GAtZEc7iAAl4S99U__Yr50oZbZGXEZq1PuNLobJ_rDN7dxDkl9Bc2fpOnbT66gYAL7jYGcPeB_JEBf-FtGiSldWJ58ljIpikTj8EnKIFDDCYZi2GzBThX71WFXMfKII44RK56Pwtd0jR00mHd4S17XKK4gSeIjJXRqMLXoS_wrFtbNAGnX4532zO-IM-36odtCzG4q1p-CGoQRRVgE351DlZJmM7vYF87Syv85FmWYpngr6Z3tdbX5tsgSWr_Q6vbhYibu9lwr_p6y9izSOqtM3z4o_2WRMMQZZw7_txymo3_jxdc4-qjf0Y_qm5_UreItny5gxgcRZMO51F50omyX5YhMbezsBftOSO8YipsaqYgiVs1WqnlUaf6y5y8f6X7m0scXRrv5Xoruw3Jd2Xnjj_svtuWep_6X_WdkMqF44gWRxUF6o2z2Si1izOzQJ9f0xBZtZVd4gV_0-9aeJc8R9hSSJbhQV7SvFx4smk2-gJIbysQy7kUnqYMe5YImo_Odc6YQF7hwRcv02gXJRtIVu3RkfWOdq9Zmmvqi57oXxBssS_8ybk_J0hgOFr_Vtd3kRkImXigxug33p_2iwVuVdQJxFiskj7FuhI3vtzBXsk-k6VSrnghrFh9Qle2UFcki3SW-pkoUw9qbY30V34pvOeUo3wY-6izbr1YufxxSdeOBxV82V43u0twl6Bx4YfJ5gWOy73ar1x7qvWBfxj1Oae2nRJkVcrd3JRjbs3ys_-VU-516elpfh1rq6z5VrX7hsJv6Zy_zcV_fUlyzi9BSxWzd9J_BBZUB6vpJUYIp48R8-1Z4yxp9FkxUn6z9jQv2i4gvO7q6ukzf8tX6ng__qhOSSy1hJS284fklZi1ov-tYgcW4
```

## Make an annotate video request
1. Run this command to create a JSON request file with the following text, and save it as request.json :
```sh
cat > request.json <<EOF
{
   "inputUri":"gs://spls/gsp154/video/train.mp4",
   "features": [
       "LABEL_DETECTION"
   ]
}
EOF
```

2. Use curl to make a videos:annotate request passing the filename of the entity request:
```sh
curl -s -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer '$(gcloud auth print-access-token)'' \
    'https://videointelligence.googleapis.com/v1/videos:annotate' \
    -d @request.json
```

3. Use this script to request information on the operation by calling the v1.operations endpoint. Replace the PROJECTS, LOCATIONS and OPERATION_NAME with the value you just received in the previous command:
```sh
curl -s -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer '$(gcloud auth print-access-token)'' \
    'https://videointelligence.googleapis.com/v1/projects/186047201840/locations/asia-east1/operations/18065191228205136063'
```


gcloud composer environments run composer-advanced-lab \
--location us-east1 variables -- \
set table_list_file_path /home/airflow/gcs/dags/bq_copy_eu_to_us_sample.csv
gcloud composer environments run composer-advanced-lab \
--location us-east1 variables -- \
set gcs_source_bucket qwiklabs-gcp-00-68986adc1665-source
gcloud composer environments run composer-advanced-lab \
--location us-east1 variables -- \
set gcs_dest_bucket qwiklabs-gcp-00-68986adc1665-destination


gcloud iam service-accounts create my-natlang-sa \
  --display-name "my natural language service account"

gcloud iam service-accounts keys create ~/key.json \
  --iam-account my-natlang-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com

export GOOGLE_APPLICATION_CREDENTIALS="/home/$USER/key.json"

gcloud auth activate-service-account my-natlang-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --key-file=$GOOGLE_APPLICATION_CREDENTIALS

gcloud ml language analyze-entities --content="Old Norse texts portray Odin as one-eyed and long-bearded, frequently wielding a spear named Gungnir and wearing a cloak and a broad hat." > result.json

gcloud auth login 

gsutil cp result.json gs://qwiklabs-gcp-02-f7c82f7363a9-marking/task4-cnl.



gcloud ml language analyze-entities --content="Old Norse texts portray Odin as one-eyed and long-bearded, frequently wielding a spear named Gungnir and wearing a cloak and a broad hat." > result.json



API_KEY=AIzaSyA2MoT-AlhsQWlTA4p-j09POqkd3innIdM