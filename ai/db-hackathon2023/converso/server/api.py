# Using flask to make an api
# import necessary libraries and functions
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

from bs4 import BeautifulSoup
from data_map import link_map

import os
import json
import openai
import requests


from transform import get_label

# creating a Flask app
app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# on the terminal type: curl http://127.0.0.1:5000/
# returns hello world when we use GET.
# returns the data that we send when we use POST.
@app.route('/', methods = ['GET', 'POST'])
def home():
    if(request.method == 'GET'):
  
        data = "hello world"
        return jsonify({'data': data})
    

@app.route('/post_json', methods=['POST'])
def process_json():
    data = json.loads(request.data)
    user_prompt = data["user"]
    label = get_label(user_prompt)
    print("user prompt classification label : ", label)

    para_context = get_concateneted_urls(link_map[label])


    user_context_prompt = f"""
      {para_context}
      Question : {user_prompt}
    """
    # print("para_user_ context : ", user_context_prompt)

    res = call_gpt(user_context_prompt)
    print("response : res : ", res)
    return {"answer": res}




def call_gpt(msg):
    openai.api_type = "azure"
    openai.api_base = "https://dbhackathonai1-openai.openai.azure.com/"
    openai.api_version = "2023-03-15-preview"
    openai.api_key = os.environ.get("GPT_API_KEY") # "" #openai.api_key = os.getenv("OPENAI_API_KEY")

    response = openai.ChatCompletion.create(
      engine="gpt-35-turbo",
      messages = [
          {
              "role":"user",
              "content":msg
          }],
      temperature=0.7,
      max_tokens=800,
      top_p=0.95,
      frequency_penalty=0,
      presence_penalty=0,
      stop=None)
    
    return response['choices'][0]["message"]["content"]


def get_concateneted_urls(urls):
  s = ""
  for url in urls:
      s += get_page_content(url)
  return s

def get_page_content(url):
  api_response = requests.get(url).content
  soup = BeautifulSoup(api_response, "html.parser")  
  # title = soup.title.string  
  # header = soup.find("h1").string  
  # paragraphs = soup.find_all("p")  
  paragraphs = ",".join([str(v) for v in soup.find_all("p")])  
  return paragraphs

# driver function
if __name__ == '__main__':
  
    app.run(debug = True)
  