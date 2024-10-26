from flask import Flask
from google.cloud import storage
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
cors = CORS(app)

BUCKET_NAME="stock-recommendations-output"

@app.route("/")
@cross_origin()
def hello():
    return "Stocks Recommendation platform"

@app.route("/getAllStocks")
@cross_origin()
def getAllStocks():
    data = "All stocks"
    data = read_file_blob(BUCKET_NAME,"stocks_info.json")
    return data

@app.route("/getStockById")
@cross_origin()
def getStockById():
    #data = "Stock by Id"
    data = read_file_blob(BUCKET_NAME,"stock_id_info.json")
    return data

@app.route("/getUserPortfolio")
@cross_origin()
def getUserPortfolio():
    #data = "User portfolio"
    data = read_file_blob(BUCKET_NAME,"user_portfolio.json")
    return data

@app.route("/getRecommendations")
@cross_origin()
def getRecommendations():
    #data = "User Recommendations"
    data = read_file_blob(BUCKET_NAME,"recommendations.json");
    return data

def read_file_blob(bucket_name, destination_blob_name):
    """Read a file from the bucket."""
 
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
 
    # read as string
    #read_output = json.loads(blob.download_as_string())
    read_output = blob.download_as_string()
 
    print("File {} read successfully  from Bucket  {}.".format(destination_blob_name, bucket_name))

    return read_output

#import stocks_controller
#import user_controller

if __name__ == "__main__":
    print(" Starting app...")
    app.run(host="0.0.0.0", port=5000)