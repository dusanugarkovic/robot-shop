#!/usr/bin/env bash
# sudo npm install -g loadtest
# loadtest -c 10 --rps 6 -r -k http://35.193.44.124:8080/
# loadtest http://localhost:8081 -c 4 --rps 2 --keepalive -r --timeout 10000 --debug
# loadtest http://35.193.44.124:8080/ -c 6 --rps 4 --keepalive -r --timeout 10000
loadtest http://localhost:8081/ -c 6 --rps 4 --keepalive -r --timeout 10000