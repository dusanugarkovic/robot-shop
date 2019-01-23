#!/bin/bash

docker kill caller
docker rmi $(docker images -qa -f 'dangling=true')
docker build -t caller:latest .
docker run -p 8081:8081 --name caller --rm caller:latest