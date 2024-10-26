## Create API Key

```sh
export API_KEY=AIzaSyDX3eC5z5RkJg5zXOcGtOCRsZSVsrFSMKY
```

##  Create your Speech API request
create request.json
```json
{
  "config": {
      "encoding":"FLAC",
      "languageCode": "en-US"
  },
  "audio": {
      "uri":"gs://cloud-samples-tests/speech/brooklyn.flac"
  }
}
```

## Call the Speech API

1. Pass your request body, along with the API key environment variable, to the Speech API with the following curl command (all in one single command line):
```sh
curl -s -X POST -H "Content-Type: application/json" --data-binary @request.json \
"https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}"
```

2. Run the following command to save the response in a result.json file:
```sh
curl -s -X POST -H "Content-Type: application/json" --data-binary @request.json \
"https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}" > result.json
```