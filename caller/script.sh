#!/bin/bash
docker kill caller
docker rmi $(docker images -qa -f 'dangling=true')
docker build -t caller:latest .
docker run \
-e SERVER_HOST='http://localhost' \
-e SERVER_PORT='8081' \
-e WEB_HOST_CATALOGUE='http://35.193.134.114' \
-e WEB_PORT_CATALOGUE='8080' \
-e LOAD_CONCURRENCY=8 \
-e LOAD_REQUESTS_PER_SECOND=5 \
-p 8081:8081 \
--name caller \
--rm caller:latest 