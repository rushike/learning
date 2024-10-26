wget https://dlcdn.apache.org/spark/spark-3.5.0/spark-3.5.0-bin-hadoop3.tgz

tar xvf spark-3.5.0-bin-hadoop3.tgz

# Moving spark from download to relevant folder
sudo mv spark-3.0.1-bin-hadoop3.2 /usr/local

# Add spark to path
export PATH="$PATH:/usr/local/spark-3.5.0-bin-hadoop3/bin"
export PATH="$PATH:/usr/local/spark-3.5.0-bin-hadoop3/sbin"