## Preparation

1. Identify a project
```sh
export DEVSHELL_PROJECT_ID=$(gcloud config get-value project)
```

## Create Pub/Sub topic and subscription
1. Verify that the Pub/Sub service is accessible and working using the gcloud command.
```sh
gcloud pubsub topics create sandiego
```

2. Publish messages to topic
```sh
gcloud pubsub topics publish sandiego --message "hello"
```

3. Create the subscription for topic
```sh
gcloud pubsub subscriptions create --topic sandiego mySub1
```

4. Pull the first message that was published to your topic:
```sh
gcloud pubsub subscriptions pull --auto-ack mySub1
```

5. In the training-vm SSH terminal, cancel your subscription:
```sh
gcloud pubsub subscriptions delete mySub1
```

## Simulate traffic sensor data into Pub/Sub
1. Simulate streaming sensor data