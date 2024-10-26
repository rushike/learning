# Use a pipeline as a high-level helper
from transformers import pipeline

from data_map import link_map

pipe = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

labels = list(link_map.keys())

def get_label(text):
  prob = pipe(
        text,
      candidate_labels=labels,
    )
  label_prob = sorted(list(zip(prob["labels"], prob["scores"])), key= lambda x : x[1], reverse=True)
  print("label_prob : ", label_prob)
  if label_prob[0][1] < 0.25 : return "none"
  return label_prob[0][0]