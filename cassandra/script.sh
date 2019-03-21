#!/usr/bin/env bash

docker stop cassandra
docker rm cassandra
docker run --name cassandra -d -e CASSANDRA_START_RPC=true -p 9160:9160 -p 9042:9042 -p 7199:7199 -p 7001:7001 -p 7000:7000 cassandra
echo "wait for cassandra to start"
while ! docker logs cassandra | grep "Listening for thrift clients..."
do
 echo "$(date) - still trying"
 sleep 1
done
echo "$(date) - connected successfully"

echo "copy init script in container"
docker cp initial_db.sql cassandra:/

echo "create database"
docker exec -d cassandra cqlsh localhost -f /initial_db.sql